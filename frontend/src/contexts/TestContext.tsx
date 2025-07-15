import React, { createContext, useContext, ReactNode } from 'react';

interface TestContextType {
  value: string;
}

const TestContext = createContext<TestContextType>({ value: 'test' });

export const TestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contextValue = { value: 'test working' };
  
  return (
    <TestContext.Provider value={contextValue}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = (): TestContextType => {
  const context = useContext(TestContext);
  return context;
};
