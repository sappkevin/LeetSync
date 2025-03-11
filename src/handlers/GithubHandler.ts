/// <reference types="chrome"/>
import { QuestionDifficulty } from '../types/Question';
import { Submission } from '../types/Submission';
import { getFromStorage, saveToStorage } from '../utils/chrome-api';

type DistributionType = {
  percentile: string;
  value: number;
};

const languagesToExtensions: Record<string, string> = {
  Python: '.py',
  Python3: '.py',
  'C++': '.cpp',
  C: '.c',
  Java: '.java',
  'C#': '.cs',
  JavaScript: '.js',
  Javascript: '.js',
  Ruby: '.rb',
  Swift: '.swift',
  Go: '.go',
  Kotlin: '.kt',
  Scala: '.scala',
  Rust: '.rs',
  PHP: '.php',
  TypeScript: '.ts',
  MySQL: '.sql',
  'MS SQL Server': '.sql',
  Oracle: '.sql',
  PostgreSQL: '.sql',
  'C++14': '.cpp',
  'C++17': '.cpp',
  'C++11': '.cpp',
  'C++98': '.cpp',
  'C++03': '.cpp',
  'C++20': '.cpp',
  'C++1z': '.cpp',
  'C++1y': '.cpp',
  'C++1x': '.cpp',
  'C++1a': '.cpp',
  CPP: '.cpp',
  Dart: '.dart',
  Elixir: '.ex',
};

interface GithubUser {
  id: number;
  avatar_url?: string | null;
  url: string;
  login: string;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
}

export default class GithubHandler {
  base_url: string = 'https://api.github.com';
  private accessToken: string = '';
  private username: string = '';
  private repo: string = '';
  private github_leetsync_subdirectory: string = '';
  private initialized: boolean = false;

  constructor() {
    this.loadCredentialsFromStorage();
  }

  private async loadCredentialsFromStorage(): Promise<void> {
    try {
      const result = await getFromStorage([
        'github_leetsync_token', 
        'github_username', 
        'github_leetsync_repo', 
        'github_leetsync_subdirectory'
      ]);
      
      if (!result.github_leetsync_token || !result.github_username || !result.github_leetsync_repo) {
        console.log('⚠️ GithubHandler: Missing Github Credentials');
      } else {
        this.accessToken = result.github_leetsync_token;
        this.username = result.github_username;
        this.repo = result.github_leetsync_repo;
        this.github_leetsync_subdirectory = result.github_leetsync_subdirectory || '';
        this.initialized = true;
        console.log('✅ GithubHandler: Credentials loaded successfully');
      }
    } catch (error) {
      console.error('Error loading GitHub credentials:', error);
    }
  }

  async ensureInitialized(): Promise<boolean> {
    if (!this.initialized) {
      await this.loadCredentialsFromStorage();
    }
    return this.initialized && !!this.accessToken && !!this.username && !!this.repo;
  }

  async loadTokenFromStorage(): Promise<string> {
    try {
      const result = await getFromStorage(['github_leetsync_token']);
      const token = result['github_leetsync_token'];
      if (!token) {
        console.log('No access token found.');
        return '';
      }
      return token;
    } catch (error) {
      console.error('Error loading token from storage:', error);
      return '';
    }
  }

  /**
   * Validate a personal access token and get user information
   */
  async validateToken(token: string): Promise<GithubUser | null> {
    try {
      const response = await fetch(`${this.base_url}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `token ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const user = await response.json();
      
      // Store the user info and token in chrome storage
      await saveToStorage({
        github_leetsync_token: token,
        github_username: user.login,
      });
      
      this.accessToken = token;
      this.username = user.login;
      this.initialized = true;
      
      console.log(`✅ GitHub user authenticated: ${user.login}`);
      return user;
    } catch (error) {
      console.error('Error validating GitHub token:', error);
      return null;
    }
  }

  /**
   * Get all repositories for the authenticated user
   */
  async getUserRepositories(): Promise<Repository[]> {
    try {
      if (!await this.ensureInitialized()) {
        throw new Error('GitHub handler not initialized');
      }
      
      const response = await fetch(`${this.base_url}/user/repos?sort=updated&per_page=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `token ${this.accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const repos = await response.json();
      return repos;
    } catch (error) {
      console.error('Error fetching user repositories:', error);
      return [];
    }
  }

  /**
   * Create a new repository
   */
  async createRepository(name: string, description: string = 'LeetCode solutions', isPrivate: boolean = false): Promise<Repository | null> {
    try {
      if (!await this.ensureInitialized()) {
        throw new Error('GitHub handler not initialized');
      }
      
      const response = await fetch(`${this.base_url}/user/repos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `token ${this.accessToken}`,
        },
        body: JSON.stringify({
          name,
          description,
          private: isPrivate,
          auto_init: true, // Initialize with a README
        }),
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const repo = await response.json();
      
      // Save the selected repository
      await saveToStorage({ github_leetsync_repo: repo.name });
      console.log(`Repository created and selected: ${repo.name}`);
      
      this.repo = repo.name;
      return repo;
    } catch (error) {
      console.error('Error creating repository:', error);
      return null;
    }
  }

  /**
   * Select a repository for syncing
   */
  async selectRepository(repoName: string): Promise<boolean> {
    try {
      if (!this.accessToken || !this.username) {
        throw new Error('Not authenticated with GitHub');
      }
      
      // Check if the repository exists
      const repoExists = await this.checkIfRepoExists(`${this.username}/${repoName}`);
      if (!repoExists) {
        throw new Error('Repository not found');
      }
      
      // Save the selected repository
      await saveToStorage({ github_leetsync_repo: repoName });
      console.log(`Repository selected: ${repoName}`);
      
      this.repo = repoName;
      return true;
    } catch (error) {
      console.error('Error selecting repository:', error);
      return false;
    }
  }

  async checkIfRepoExists(repo_name: string): Promise<boolean> {
    const trimmedRepoName = repo_name.replace('.git', '').trim();
    if (!trimmedRepoName) return false;
    
    try {
      const response = await fetch(`${this.base_url}/repos/${trimmedRepoName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `token ${this.accessToken}`,
        },
      });
      
      if (response.status === 404) {
        return false;
      }
      
      if (!response.ok) {
        console.error(`GitHub API error: ${response.status} ${response.statusText}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking if repo exists:', error);
      return false;
    }
  }

  public getProblemExtension(lang: string): string {
    return languagesToExtensions[lang] || '.txt'; // Default to .txt if language not found
  }

  /* Submissions Methods */
  async fileExists(path: string, fileName: string): Promise<string | null> {
    if (!await this.ensureInitialized()) {
      console.error('GitHub handler not initialized');
      return null;
    }
    
    try {
      const url = `${this.base_url}/repos/${this.username}/${this.repo}/contents/${path}/${fileName}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `token ${this.accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        console.error(`GitHub API error checking file: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const data = await response.json();
      return data.sha;
    } catch (error) {
      console.error(`Error checking if file exists: ${path}/${fileName}`, error);
      return null;
    }
  }

  async upload(path: string, fileName: string, content: string, commitMessage: string): Promise<boolean> {
    if (!await this.ensureInitialized()) {
      console.error('GitHub handler not initialized');
      return false;
    }
    
    try {
      // First check if the file already exists
      const sha = await this.fileExists(path, fileName);
      
      // Prepare the data for the API call
      const url = `${this.base_url}/repos/${this.username}/${this.repo}/contents/${path}/${fileName}`;
      const requestData: any = {
        message: commitMessage,
        content: btoa(unescape(encodeURIComponent(content))),
      };
      
      // If the file already exists, include the SHA
      if (sha) {
        requestData.sha = sha;
      }
      
      // Send the request to create/update the file
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `token ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`GitHub API error uploading file: ${response.status} ${response.statusText}`, errorText);
        return false;
      }
      
      console.log(`✅ Successfully uploaded: ${path}/${fileName}`);
      return true;
    } catch (error) {
      console.error(`Error uploading file: ${path}/${fileName}`, error);
      return false;
    }
  }

  getDifficultyColor(difficulty: QuestionDifficulty): string {
    switch (difficulty) {
      case 'Easy':
        return 'brightgreen';
      case 'Medium':
        return 'orange';
      case 'Hard':
        return 'red';
      default:
        return 'blue';
    }
  }

  createDifficultyBadge(difficulty: QuestionDifficulty): string {
    return `<img src='https://img.shields.io/badge/Difficulty-${difficulty}-${this.getDifficultyColor(
      difficulty,
    )}' alt='Difficulty: ${difficulty}' />`;
  }

  async createReadmeFile(
    path: string,
    content: string,
    message: string,
    problemSlug: string,
    questionTitle: string,
    difficulty: QuestionDifficulty,
  ): Promise<boolean> {
    const mdContent = `<h2><a href="https://leetcode.com/problems/${problemSlug}">${questionTitle}</a></h2> ${this.createDifficultyBadge(
      difficulty,
    )}<hr>${content}`;

    return await this.upload(path, 'README.md', mdContent, message);
  }

  async createNotesFile(
    path: string, 
    notes: string, 
    message: string, 
    questionTitle: string
  ): Promise<boolean> {
    const mdContent = `<h2>${questionTitle} Notes</h2><hr>${notes}`;
    return await this.upload(path, 'Notes.md', mdContent, message);
  }

  async createSolutionFile(
    path: string,
    code: string,
    problemName: string,
    lang: string,
    stats: {
      memory: number;
      memoryDisplay: string;
      memoryPercentile: number;
      runtime: number;
      runtimeDisplay: string;
      runtimePercentile: number;
    },
  ): Promise<boolean> {
    const msg = `Time: ${stats.runtimeDisplay} (${stats.runtimePercentile.toFixed(2)}%) | Memory: ${
      stats.memoryDisplay
    } (${stats.memoryPercentile.toFixed(2)}%) - LeetSync`;
    
    return await this.upload(path, `${problemName}${lang}`, code, msg);
  }

  async submit(submission: Submission): Promise<boolean> {
    if (!await this.ensureInitialized()) {
      console.error('GitHub handler not initialized properly. Please check your settings.');
      return false;
    }
    
    try {
      const {
        code,
        memory,
        memoryDisplay,
        memoryPercentile,
        runtime,
        runtimePercentile,
        runtimeDisplay,
        statusCode,
        lang,
        question,
        notes,
      } = submission;

      // Check if submission was successful
      if (statusCode !== 10) {
        console.log('❌ Failed Attempt - Not syncing to GitHub');
        return false;
      }
      
      // Create path for the files
      let basePath = `${question.questionFrontendId ?? question.questionId ?? 'unknown'}-${question.titleSlug}`;
      
      if (this.github_leetsync_subdirectory) {
        basePath = `${this.github_leetsync_subdirectory}/${basePath}`;
      }
      
      const { title, titleSlug, content, difficulty, questionId } = question;
      
      // Get file extension for the language
      const langExtension = this.getProblemExtension(lang.verboseName);
      if (!langExtension) {
        console.log(`❌ Language not supported: ${lang.verboseName}`);
        return false;
      }
      
      // Create README file
      console.log(`Creating README for ${title}`);
      const readmeCreated = await this.createReadmeFile(
        basePath, content, `Added README.md file for ${title}`, titleSlug, title, difficulty
      );
      
      if (!readmeCreated) {
        console.error('Failed to create README file');
      }
      
      // Create Notes file if there are notes
      if (notes && notes?.length) {
        console.log(`Creating Notes for ${title}`);
        await this.createNotesFile(basePath, notes, `Added Notes.md file for ${title}`, title);
      }
      
      // Create solution file
      console.log(`Creating solution file for ${title}`);
      const solutionCreated = await this.createSolutionFile(
        basePath, 
        code, 
        question.titleSlug, 
        langExtension, 
        {
          memory,
          memoryDisplay,
          memoryPercentile,
          runtime,
          runtimeDisplay,
          runtimePercentile,
        }
      );
      
      if (!solutionCreated) {
        console.error('Failed to create solution file');
        return false;
      }
      
      // Update last solved problem in storage
      const todayTimestamp = Date.now();
      await saveToStorage({
        lastSolved: { slug: titleSlug, timestamp: todayTimestamp },
      });
      
      // Update problems solved list
      try {
        const result = await getFromStorage('problemsSolved');
        const problemsSolved = result.problemsSolved || {};
        
        await saveToStorage({
          problemsSolved: {
            ...problemsSolved,
            [titleSlug]: {
              question: {
                difficulty,
                questionId,
              },
              timestamp: todayTimestamp,
            },
          },
        });
        
        console.log(`✅ Successfully synced ${title} to GitHub!`);
        return true;
      } catch (error) {
        console.error('Error updating problems solved in storage:', error);
        return false;
      }
    } catch (error) {
      console.error('Error submitting to GitHub:', error);
      return false;
    }
  }
}