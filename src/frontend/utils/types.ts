export type ModelResponse = {
  response: string;
  action: ActionParams;
};

export type ActionParams = {
  [key: string]: string;
};

export type TransferAction = {
  from: string;
  to: string;
  gas: string;
  gasPrice: any;
  value: string;
  data: string;
};
