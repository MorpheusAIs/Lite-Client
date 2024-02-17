import { ModelResponse } from './types';

export const parseResponse = (jsonString: string) => {
  // Assert the type of the parsed object.
  const parsed = JSON.parse(jsonString);

  if (isModelResponse(parsed)) {
    return { response: parsed.response, transaction: parsed.transaction };
  } else {
    throw new Error('Invalid ModelResponse format');
  }
};

const isModelResponse = (object: any): object is ModelResponse => {
  return 'response' in object && 'transaction' in object;
};
