import { ethers } from 'ethers';
import { SDKProvider } from '@metamask/sdk';
import { TransferAction, ActionParams } from './types';

export const isActionInitiated = (action: ActionParams) => {
  return !(Object.keys(action).length === 0);
};

export const buildAction = (action: ActionParams, account: string, gasPrice: string) => {
  const transactionType = action.type.toLowerCase();

  let tx: TransferAction;

  switch (transactionType) {
    case 'transfer':
      tx = buildTransferTransaction(action, account, gasPrice);
      break;
    default:
      throw Error(`Transaction of type ${transactionType} is not yet supported`);
  }

  // returned wrapped call with method for metamask with transaction params
  return {
    method: 'eth_sendTransaction',
    params: [tx],
  };
};

function extractEthereumAddress(text: string): string | null {
  const regex = /0x[a-fA-F0-9]{40}/;
  const match = text.match(regex);
  return match ? match[0] : null;
}

const buildTransferTransaction = (
  action: ActionParams,
  account: string,
  gasPrice: any,
): TransferAction => {
  return {
    from: account,
    to: action.targetAddress,
    gas: '0x76c0', //for more complex tasks estimate this from metamast
    gasPrice: gasPrice,
    value: '0x' + ethers.parseEther(action.ethAmount).toString(16),
    data: '0x000000',
  };
};

//TODO: take chain ID to get arb balance or w/e chain
const formatWalletBalance = (balanceWeiHex: string) => {
  const balanceBigInt = BigInt(balanceWeiHex);
  const balance = ethers.formatUnits(balanceBigInt, 'ether');

  return `${parseFloat(balance).toFixed(2)} ETH`;
};

export const handleBalanceRequest = async (
  provider: SDKProvider | undefined,
  account: string | undefined,
) => {
  const blockNumber = await provider?.request({
    method: 'eth_blockNumber',
    params: [],
  });

  const balanceWeiHex = await provider?.request({
    method: 'eth_getBalance',
    params: [account, blockNumber],
  });

  if (typeof balanceWeiHex === 'string') {
    return `${formatWalletBalance(balanceWeiHex)}`;
  } else {
    console.error('Failed to retrieve a valid balance.');

    throw Error('Invalid Balance Received from MetaMask.');
  }
};

const estimateGasWithOverHead = (estimatedGasMaybe: string) => {
  const estimatedGas = parseInt(estimatedGasMaybe, 16);
  const gasLimitWithOverhead = Math.ceil(estimatedGas * 2.5);

  return `0x${gasLimitWithOverhead.toString(16)}`;
};

export const handleTransactionRequest = async (
  provider: SDKProvider | undefined,
  transaction: ActionParams,
  account: string,
  question: string,
) => {
  const addressInQuestion = extractEthereumAddress(question);
  if (addressInQuestion?.toLowerCase() !== transaction.targetAddress.toLowerCase()) {
    console.error(
      `${addressInQuestion} !== ${transaction.targetAddress} target address did not match address in question`,
    );
    throw new Error('Error, target address did not match address in question');
  }

  const gasPrice = await provider?.request({
    method: 'eth_gasPrice',
    params: [],
  });

  // Sanity Check
  if (typeof gasPrice !== 'string') {
    console.error('Failed to retrieve a valid gasPrice');

    throw new Error('Invalid gasPrice received');
  }

  const builtTx = buildAction(transaction, account, gasPrice);

  const estimatedGas = await provider?.request({
    method: 'eth_estimateGas',
    params: [builtTx],
  });

  //Sanity Check
  if (typeof estimatedGas !== 'string') {
    console.error('Failed to estimate Gas with metamask');

    throw new Error('Invalid gasPrice received');
  }

  const gasLimitWithOverhead = estimateGasWithOverHead(estimatedGas);
  builtTx.params[0].gas = gasLimitWithOverhead; // Update the transaction with the new gas limit in hex

  return builtTx;
};
