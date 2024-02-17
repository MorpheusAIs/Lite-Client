export type ModelResponse = {
  response: string;
  transaction: TransactionParams;
};

export type TransactionParams = {
  [key: string]: string;
};

export type Transaction = {
  from: string;
  to: string;
  gas: string;
  gasPrice: any;
  value: string;
  data: string;
};
