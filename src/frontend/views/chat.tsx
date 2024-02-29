// libs
import React, { FormEvent, useEffect, useState, useRef } from 'react';
import Styled from 'styled-components';
import { useSDK } from '@metamask/sdk-react';
import { ThreeDots } from 'react-loader-spinner';

// types and helpers
import { AIMessage } from '../types';
import { OllamaChannel } from './../../events';
import { useAIMessagesContext } from '../contexts';

import {
  isActionInitiated,
  handleBalanceRequest,
  handleTransactionRequest,
} from '../utils/transaction';
import { parseResponse } from '../utils/utils';
import { ActionParams } from '../utils/types';
import { getChainInfoByChainId } from '../utils/chain';

const ChatView = (): JSX.Element => {
  const [selectedModel, setSelectedModel] = useState('llama2');
  const [dialogueEntries, setDialogueEntries] = useAIMessagesContext();
  const [inputValue, setInputValue] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<AIMessage>();
  const [isOllamaBeingPolled, setIsOllamaBeingPolled] = useState(false);
  const { ready, sdk, connected, connecting, provider, chainId, account, balance } = useSDK();
  const ethInWei = '1000000000000000000';
  const [selectedNetwork, setSelectedNetwork] = useState('');

  const chatMainRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.backendBridge.ollama.onAnswer((response) => {
      setDialogueEntries([
        ...dialogueEntries,
        { question: inputValue, answer: response.message.content, answered: true },
      ]);

      setInputValue('');
    });

    return () => {
      window.backendBridge.removeAllListeners(OllamaChannel.OllamaAnswer);
    };
  });

  // Scroll to bottom of chat when user adds new dialogue
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (chatMainRef.current && mutation.type === 'childList') {
          chatMainRef.current.scrollTop = chatMainRef.current.scrollHeight;
        }
      }
    });

    if (chatMainRef.current) {
      observer.observe(chatMainRef?.current, {
        childList: true, // observe direct children
      });
    }

    return () => observer.disconnect();
  }, []);

  // Refocus onto input field once new dialogue entry is added
  useEffect(() => {
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [dialogueEntries]); //

  //Function to update dialogue entries
  const updateDialogueEntries = (question: string, message: string) => {
    setCurrentQuestion(undefined);
    setDialogueEntries([
      ...dialogueEntries,
      { question: question, answer: message, answered: true },
    ]);
  };

  const checkGasCost = (balance: string, transaction: ActionParams): boolean => {
    // calculate the max gas cost in Wei (gasPrice * gas)
    // User's balance in ETH as a float string
    const balanceInEth = parseFloat(balance);
    // Convert balance to Wei
    const balanceInWei = BigInt(balanceInEth * 1e18); // 1 ETH = 10^18 Wei
    const fivePercentOfBalanceInWei = balanceInWei / BigInt(20); // Equivalent to 5%
    const gasCostInWei = BigInt(transaction.gasPrice) * BigInt(transaction.gas);
    return gasCostInWei > fivePercentOfBalanceInWei;
  };
  const processResponse = async (
    question: string,
    response: string,
    action: ActionParams | undefined,
  ) => {
    if (action == undefined) {
      action = {};
    }
    if (!isActionInitiated(action)) {
      updateDialogueEntries(question, response); //no additional logic in this case

      return;
    }

    // Sanity Checks:
    if (!account || !provider) {
      const errorMessage = `Error: Please connect to metamask`;
      updateDialogueEntries(question, errorMessage);

      return;
    }

    switch (action.type.toLowerCase()) {
      case 'balance':
        let message: string;
        try {
          message = await handleBalanceRequest(provider, account);
        } catch (error) {
          message = `Error: Failed to retrieve a valid balance from Metamask, try reconnecting.`;
        }
        updateDialogueEntries(question, message);
        break;

      case 'transfer':
        try {
          const builtTx = await handleTransactionRequest(provider, action, account, question);
          console.log('from: ' + builtTx.params[0].from);
          //if gas is more than 5% of balance - check with user
          const balance = await handleBalanceRequest(provider, account);
          const isGasCostMoreThan5Percent = checkGasCost(balance, builtTx.params[0]);
          if (isGasCostMoreThan5Percent) {
            updateDialogueEntries(
              question,
              `Important: The gas cost is expensive relative to your balance please proceed with caution\n\n${response}`,
            );
          } else {
            updateDialogueEntries(question, response);
          }
          await provider?.request(builtTx);
        } catch (error) {
          const badTransactionMessage =
            'Error: There was an error sending your transaction, if the transaction type is balance or transfer please reconnect to metamask';
          updateDialogueEntries(question, badTransactionMessage);
        }
        break;

      case 'address':
        updateDialogueEntries(question, account);
        break;

      default:
        // If the transaction type is not recognized, we will not proceed with the transaction.
        const errorMessage = `Error: Invalid transaction type: ${action.type}`;
        updateDialogueEntries(question, errorMessage);
    }
  };

  const handleQuestionAsked = async (question: string) => {
    if (isOllamaBeingPolled) {
      return;
    }

    const dialogueEntry = {
      question: question,
      answered: false,
    };

    setCurrentQuestion(dialogueEntry);
    setInputValue('');

    setIsOllamaBeingPolled(true);

    const inference = await window.backendBridge.ollama.question({
      model: selectedModel,
      query: question,
    });

    console.log(inference);
    if (inference) {
      const { response, action: action } = parseResponse(inference.message.content);
      if (response == 'error') {
        updateDialogueEntries(question, 'Sorry, I had a problem with your request.');
      } else {
        await processResponse(question, response, action);
      }
    }

    setIsOllamaBeingPolled(false);
  };

  const handleQuestionChange = (e: FormEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  const handleNetworkChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChain = e.target.value;

    // Check if the default option is selected
    if (!selectedChain) {
      console.log('No network selected.');
      return; // Early return to avoid further execution
    }

    // Sanity Checks:
    if (!account || !provider) {
      const errorMessage = `Error: Please connect to MetaMask`;
      updateDialogueEntries('', errorMessage);
      return;
    }

    try {
      const response = await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: selectedChain }],
      });
      console.log(response);
    } catch (error) {
      //if switch chain fails then add the chain
      try {
        const chainInfo = getChainInfoByChainId(selectedChain);
        const response = await provider.request({
          method: 'wallet_addEthereumChain',
          params: [chainInfo],
        });
      } catch (error) {
        console.error('Failed to switch networks:', error);
      }
    }
  };

  return (
    <Chat.Layout>
      <Chat.Dropdown onChange={handleNetworkChange} value="">
        <option value="">Select a network</option>
        <option value="0x1">Ethereum</option>
        <option value="0xaa36a7">Sepolia</option>
        <option value="0xa4b1">Arbitrum</option>
        <option value="0x64">Gnosis</option>
      </Chat.Dropdown>
      <Chat.Main ref={chatMainRef}>
        {dialogueEntries.map((entry, index) => {
          return (
            <Chat.QuestionWrapper
              key={`dialogue-${index}`}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {entry.question && <Chat.Question>{`> ${entry.question}`}</Chat.Question>}
              {entry.answer && <Chat.Answer>{entry.answer}</Chat.Answer>}
            </Chat.QuestionWrapper>
          );
        })}
        {currentQuestion && (
          <Chat.QuestionWrapper>
            <Chat.Question>{`> ${currentQuestion.question}`}</Chat.Question>
            <Chat.Answer>
              <Chat.PollingIndicator width="30" height="20" />
            </Chat.Answer>
          </Chat.QuestionWrapper>
        )}
      </Chat.Main>
      <Chat.Bottom>
        <Chat.InputWrapper>
          <Chat.Arrow>&gt;</Chat.Arrow>
          <Chat.Input
            ref={chatInputRef}
            disabled={isOllamaBeingPolled}
            value={inputValue}
            onChange={handleQuestionChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                handleQuestionAsked(inputValue);
              }
            }}
          />
          <Chat.SubmitButton
            disabled={isOllamaBeingPolled}
            onClick={() => handleQuestionAsked(inputValue)}
          />
        </Chat.InputWrapper>
      </Chat.Bottom>
      {/* <div onClick={() => handleQuestionAsked('How much is 5 times 5?')}>Ask Olama</div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {currentQuestion && <span style={{ backgroundColor: 'yellow' }}>{currentQuestion}</span>}
      </div> */}
    </Chat.Layout>
  );
};

const Chat = {
  Layout: Styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.colors.core};
  `,
  Main: Styled.div`
    display: flex;
    width: 100%;
    height: 80%;
    flex-direction: column;
    padding: 20px;
    margin-bottom: 20px;
    overflow: scroll;
  `,
  QuestionWrapper: Styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  `,
  Question: Styled.span`
    display: flex;
    color: ${(props) => props.theme.colors.notice};
    font-family: ${(props) => props.theme.fonts.family.primary.regular};
    font-size: ${(props) => props.theme.fonts.size.small};
    margin-bottom: 5px;
  `,
  Answer: Styled.span`
    display: flex;
    color: ${(props) => props.theme.colors.emerald};
    font-family: ${(props) => props.theme.fonts.family.primary.regular};
    font-size: ${(props) => props.theme.fonts.size.small};
    margin-left: 20px;
  `,
  PollingIndicator: Styled(ThreeDots)`
    display: flex;
  `,
  Bottom: Styled.div`
    display: flex;
    width: 100%;
    height: 20%;
    background: ${(props) => props.theme.colors.core};
    justify-content: center;
  `,
  InputWrapper: Styled.div`
    display: flex;
    width: 90%;
    height: 40px;
    position: relative;
    align-items: center;
  `,
  Input: Styled.input`
    display: flex;
    width: 100%;
    height: 40px;
    border-radius: 30px;
    padding: 0 25px;
    background: ${(props) => props.theme.colors.core};
    border: 2px solid ${(props) => props.theme.colors.hunter};
    color: ${(props) => props.theme.colors.notice};
    font-family: ${(props) => props.theme.fonts.family.primary.regular};
    font-size: ${(props) => props.theme.fonts.size.small};
  `,
  Arrow: Styled.span`
    display: flex;
    color: ${(props) => props.theme.colors.notice};
    font-family: ${(props) => props.theme.fonts.family.primary.regular};
    font-size: ${(props) => props.theme.fonts.size.small};
    position: absolute;
    left: 10px;
  `,
  SubmitButton: Styled.button`
    display: flex;
    width: 30px;
    height: 30px;
    border-radius: 25px;
    background: ${(props) => props.theme.colors.hunter};
    position: absolute;
    right: 5px;
    cursor: pointer;
    border: none;

    &:hover {
      background: ${(props) => props.theme.colors.emerald};
    }
  `,
  Dropdown: Styled.select`
      position: absolute;
      top: 42px;
      left: 25px;
      padding: 8px 10px;
      border-radius: 10px;
      background-color: ${(props) => props.theme.colors.core}; 
      color: ${(props) => props.theme.colors.notice}; 
      border: 2px solid ${(props) => props.theme.colors.hunter}; 
      font-family: ${(props) => props.theme.fonts.family.primary.regular};
      font-size: ${(props) => props.theme.fonts.size.small};
      cursor: pointer;

      &:hover {
        border: 2px solid ${(props) => props.theme.colors.emerald};
      }

      option {
        background-color: ${(props) => props.theme.colors.core};
        color: ${(props) => props.theme.colors.emerald};
      }
    `,
};

export default ChatView;
