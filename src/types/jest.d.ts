// Jest type definitions
declare global {
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  function expect(value: any): any;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
}

export {};
