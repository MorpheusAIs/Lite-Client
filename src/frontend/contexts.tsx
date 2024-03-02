/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  SetStateAction,
  Dispatch,
} from 'react';
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

export type SidebarContextType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => {},
});

export const SidebarProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(`useSidebarContext must be used within SidebarProvider`);
  }

  return context;
};
