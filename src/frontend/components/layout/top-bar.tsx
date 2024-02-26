// libs
import React, { useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import { useSDK } from '@metamask/sdk-react';

// components
import MetaMaskModal from '../modals/metamask-modal';
import ConnectWalletButton from '../buttons/connect-wallet-button';

// custom hooks
import { useClickOutside } from '../../hooks';

// img
import logo from './../../assets/images/logo_white.png';
import chevronDown from '../../assets/images/chevron-down.png';
import close from './../../assets/images/close.svg';
import minimize from './../../assets/images/minimize.svg';

// constants
import { ETHEREUM_CHAINS, EthereumChain } from '../../constants';

export default () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const { ready, sdk, connected, connecting, provider, chainId, account, balance } = useSDK();
  const [metamaskVisible, setMetamaskVisible] = useState(false);

  const metamaskButtonRef = useRef(null);
  const ref = useClickOutside((event) => {
    // eslint-disable-next-line
    // @ts-ignore
    if (metamaskButtonRef.current && !metamaskButtonRef.current.contains(event.target)) {
      setMetamaskVisible(false);
    }
  });

  useEffect(() => {
    if (chainId) {
      setSelectedNetwork(chainId);
    }
  }, [chainId]);

  const connect = async () => {
    try {
      const connectResult = await sdk?.connect();
    } catch (err) {
      console.error(`failed to connect...`, err);
    }
  };

  const onConnectClicked = async () => {
    if (connected) {
      if (metamaskVisible) {
        setMetamaskVisible(false);

        return;
      }

      setMetamaskVisible(true);

      return;
    }

    await connect();
  };

  const onCloseClicked = () => {
    window.backendBridge.main.close();
  };

  const onMinimizeClicked = () => {
    window.backendBridge.main.minimize();
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

      return;
    }

    const chain = ETHEREUM_CHAINS[selectedChain];

    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: selectedChain,
            chainName: chain.chainName,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: chain.rpcUrls,
          },
        ],
      });

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: selectedChain }],
      });

      setSelectedNetwork(selectedChain);
    } catch (error) {
      console.error('Failed to switch networks:', error);
    }
  };

  return (
    <TopBar.Layout>
      <TopBar.Draggable />
      <TopBar.HeaderWrapper>
        <TopBar.Left>
          {/* <TopBar.CloseButton onClick={onCloseClicked} />
          <TopBar.MinimizeButton onClick={onMinimizeClicked} /> */}
        </TopBar.Left>
        <TopBar.Middle>
          <TopBar.Logo src={logo} />
          <TopBar.Header>Morpheus</TopBar.Header>
        </TopBar.Middle>
        <TopBar.Right>
          {connected && (
            <TopBar.Dropdown onChange={handleNetworkChange} value={selectedNetwork}>
              <option value="" style={{ display: 'none' }}>
                select a network
              </option>
              {Object.entries(ETHEREUM_CHAINS).map((value, index) => {
                return (
                  <option value={value[0]} key={`network-${index}`}>
                    {value[1].chainName}
                  </option>
                );
              })}
            </TopBar.Dropdown>
          )}
          <ConnectWalletButton
            {...{ connected, connecting, onClick: onConnectClicked }}
            ref={metamaskButtonRef}
          />
          {metamaskVisible && <MetaMaskModal {...{ account }} ref={ref} />}
        </TopBar.Right>
      </TopBar.HeaderWrapper>
    </TopBar.Layout>
  );
};

const TopBar = {
  Layout: Styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    height: 100%;
    margin: 0;
    background: ${(props) => props.theme.colors.core};
  `,
  Draggable: Styled.div`
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 80%;
    height: 40px;
    z-index: 0;
    -webkit-app-region: drag;
  `,
  HeaderWrapper: Styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 0 20px;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  `,
  Left: Styled.div`
    display: flex;
    flex: 1;
  `,
  Middle: Styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 250px;
    align-items: center;
    justify-content: center;
    z-index: 1;
    position: relative;
    height: 100%;
  `,
  Right: Styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    z-index: 1;
    position: relative;
  `,
  CloseButton: Styled(close)`
    display: flex;
    width: 25px;
    height: 25px;
    cursor: pointer;
    margin-right: 10px;
  `,
  MinimizeButton: Styled(minimize)`
    display: flex;
    width: 25px;
    height: 25px;
    cursor: pointer;
  `,
  Logo: Styled.img`
    display: flex;
    height: 100px;
    width: 100px;
  `,
  Header: Styled.h2`
    font-size: ${(props) => props.theme.fonts.size.medium};
    font-family: ${(props) => props.theme.fonts.family.primary.regular};
    font-weight: normal;
    color: ${(props) => props.theme.colors.balance};
    position: absolute;
    bottom: 10px;
  `,
  Dropdown: Styled.select`
    display: flex;
    padding: 0 15px;
    margin-right: 20px;
    border-radius: 30px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    transition: all 0.5s;
    background: url('${chevronDown}') calc(100% - 15px) center no-repeat;
    background-size: 15px;
    padding-right: 40px;
    color: ${(props) => props.theme.colors.notice}; 
    border: 2px solid ${(props) => props.theme.colors.hunter}; 
    font-family: ${(props) => props.theme.fonts.family.primary.regular};
    font-size: ${(props) => props.theme.fonts.size.small};
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    pointer-events: all;

    &:hover {
      border: 2px solid ${(props) => props.theme.colors.emerald};
    }

    option {
      background-color: ${(props) => props.theme.colors.core};
      color: ${(props) => props.theme.colors.emerald};

      &:hover, &:checked {
        background-color: ${(props) => props.theme.colors.emerald};
        color: ${(props) => props.theme.colors.notice};
      }
    }
  `,
};
