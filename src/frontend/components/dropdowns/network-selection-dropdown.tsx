import React from 'react';
import Styled from 'styled-components';

import { getChainInfoByChainId } from '../../utils/chain';
import { useSDK } from '@metamask/sdk-react';
import { useAIMessagesContext } from '../../contexts';

const NetworkSelectionDropdown = () => {
  const { provider, account } = useSDK();
  const [dialogueEntries, setDialogueEntries] = useAIMessagesContext();

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
      setDialogueEntries([
        ...dialogueEntries,
        { question: '', answer: errorMessage, answered: true },
      ]);
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
    <Dropdown onChange={handleNetworkChange} value="">
      <option value="">Select a network</option>
      <option value="0x1">Ethereum</option>
      <option value="0xaa36a7">Sepolia</option>
      <option value="0xa4b1">Arbitrum</option>
      <option value="0x64">Gnosis</option>
    </Dropdown>
  );
};

const Dropdown = Styled.select`
    padding: 8px 10px;
    margin: 12px 0 12px 12px;
    
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
`;

export default NetworkSelectionDropdown;
