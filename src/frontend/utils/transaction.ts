import { ethers } from 'ethers';
import { SDKProvider } from '@metamask/sdk';
import { Transaction, TransactionParams } from './types';

export const isTransactionInitiated = (transaction: TransactionParams) => {
  return !(Object.keys(transaction).length === 0);
};

export const buildTransaction = (
  transaction: TransactionParams,
  account: string,
  gasPrice: string,
) => {
  const transactionType = transaction.type.toLowerCase();

  let tx: Transaction;

  switch (transactionType) {
    case 'transfer':
      tx = buildTransferTransaction(transaction, account, gasPrice);
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

const buildTransferTransaction = (
  transaction: TransactionParams,
  account: string,
  gasPrice: any,
): Transaction => {
  return {
    from: account,
    to: transaction.targetAddress,
    gas: '0x76c0', //for more complex tasks estimate this from metamast
    gasPrice: gasPrice,
    value: '0x' + ethers.parseEther(transaction.ethAmount).toString(16),
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
  response: string,
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
    return `${response} ${formatWalletBalance(balanceWeiHex)}`;
  } else {
    console.error('Failed to retrieve a valid balance.');

    throw Error('Invalid Balance Received from MetaMask.');
  }
};

const estimateGasWithOverHead = (estimatedGasMaybe: string) => {
  const estimatedGas = parseInt(estimatedGasMaybe, 16);
  const gasLimitWithOverhead = Math.ceil(estimatedGas * 5);

  return `0x${gasLimitWithOverhead.toString(16)}`;
};

export const handleTransactionRequest = async (
  provider: SDKProvider | undefined,
  transaction: TransactionParams,
  account: string,
) => {
  const gasPrice = await provider?.request({
    method: 'eth_gasPrice',
    params: [],
  });

  // Sanity Check
  if (typeof gasPrice !== 'string') {
    console.error('Failed to retrieve a valid gasPrice');
    
    throw new Error('Invalid gasPrice received');
  }

  const builtTx = buildTransaction(transaction, account, gasPrice);

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
