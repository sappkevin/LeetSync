/// <reference types="chrome"/>
import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  HStack,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { BsGithub } from 'react-icons/bs';
import { GithubHandler } from '../handlers';
import { getFromStorage, saveToStorage } from '../utils/chrome-api';

interface GitHubAuthProps {
  onAuthSuccess: () => void;
}

const GitHubAuth: React.FC<GitHubAuthProps> = ({ onAuthSuccess }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [repositories, setRepositories] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const github = new GithubHandler();

  // Load existing token if available
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const result = await getFromStorage(['github_leetsync_token', 'github_username']);
        if (result.github_leetsync_token && result.github_username) {
          setToken(result.github_leetsync_token);
          setUsername(result.github_username);
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };
    
    loadStoredData();
  }, []);

  const handleTokenValidation = async () => {
    if (!token.trim()) {
      setError('Please enter a personal access token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await github.validateToken(token);
      
      if (user) {
        setUsername(user.login);
        setShowRepoSelector(true);
        
        // Fetch repositories
        const repos = await github.getUserRepositories();
        setRepositories(repos);
        
        // Show repository selection modal
        onOpen();
      } else {
        setError('Invalid token or network issue. Please check your token and try again.');
      }
    } catch (err) {
      setError('An error occurred while validating your token.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRepoSelection = async () => {
    if (!selectedRepo) {
      return;
    }

    setLoading(true);
    try {
      const success = await github.selectRepository(selectedRepo);
      if (success) {
        onClose();
        onAuthSuccess();
      } else {
        setError('Failed to select repository. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while selecting the repository.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRepo = async () => {
    setLoading(true);
    try {
      const newRepo = await github.createRepository('leetcode-solutions', 'My LeetCode solutions synchronized by LeetSync', false);
      if (newRepo) {
        onClose();
        onAuthSuccess();
      } else {
        setError('Failed to create repository. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while creating the repository.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack w="100%">
      <VStack pb={4}>
        <Heading size="md">Connect with GitHub</Heading>
        <Text color="GrayText" fontSize="sm" w="95%" textAlign="center">
          LeetSync needs permission to push your LeetCode solutions to your GitHub repository.
        </Text>
      </VStack>

      <VStack width="100%" spacing={4}>
        <FormControl isInvalid={!!error}>
          <Text fontSize="sm" mb={2}>
            Enter a GitHub Personal Access Token with <strong>repo</strong> scope:
          </Text>
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            size="sm"
            type="password"
          />
          {error ? (
            <FormErrorMessage>{error}</FormErrorMessage>
          ) : (
            <FormHelperText fontSize="xs">
              <Link href="https://github.com/settings/tokens/new?scopes=repo&description=LeetSync%20Chrome%20Extension" isExternal color="blue.500">
                Create a new token on GitHub
              </Link>
            </FormHelperText>
          )}
        </FormControl>

        <Button
          colorScheme="blackAlpha"
          bg="blackAlpha.800"
          w="100%"
          leftIcon={<BsGithub />}
          color="whiteAlpha.900"
          border="1px solid"
          borderColor="gray.200"
          _hover={{ bg: 'blackAlpha.700' }}
          onClick={handleTokenValidation}
          isLoading={loading}
          loadingText="Validating"
          isDisabled={loading}
        >
          {username ? `Connected as ${username}` : 'Connect with GitHub'}
        </Button>
      </VStack>

      {/* Repository Selection Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select a Repository</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>Choose a repository to store your LeetCode solutions:</Text>
              {repositories.length > 0 ? (
                <Select
                  placeholder="Select a repository"
                  value={selectedRepo}
                  onChange={(e) => setSelectedRepo(e.target.value)}
                >
                  {repositories.map((repo) => (
                    <option key={repo.id} value={repo.name}>
                      {repo.name} {repo.private ? '(Private)' : '(Public)'}
                    </option>
                  ))}
                </Select>
              ) : (
                <HStack justify="center" w="100%">
                  <Spinner size="sm" />
                  <Text>Loading repositories...</Text>
                </HStack>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" mr={3} onClick={handleCreateRepo} isLoading={loading}>
              Create New Repository
            </Button>
            <Button
              colorScheme="green"
              onClick={handleRepoSelection}
              isDisabled={!selectedRepo || loading}
              isLoading={loading}
            >
              Select Repository
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default GitHubAuth;