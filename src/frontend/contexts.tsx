/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { AIMessage } from './types';

export type AIMessagesContextType = [Array<AIMessage>, (messages: Array<AIMessage>) => void];

export const AIMessagesContext = createContext<AIMessagesContextType>([
  [],
  (messages: Array<AIMessage>) => {},
]);

export const AIMessagesProvider = ({ children }: PropsWithChildren) => {
  const [messages, setMessages] = useState<Array<AIMessage>>([]);

  return (
    <AIMessagesContext.Provider value={[messages, setMessages]}>
      {children}
    </AIMessagesContext.Provider>
  );
};

export const useAIMessagesContext = () => {
  const context = useContext(AIMessagesContext);

  if (!context) {
    throw new Error(`useAIMessagesContext must be used within AIMessagesProvider`);
  }

  return context;
};
