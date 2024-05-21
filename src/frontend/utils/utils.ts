import { ModelResponse } from './types';

export const parseResponse = (jsonString: string) => {
  console.log(jsonString);

  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch (error) {
    console.log(error);
    return { response: 'error', action: {} };
  }

  if (isModelResponse(parsed)) {
    return { response: parsed.response, action: parsed.action };
  } else {
    throw new Error('Invalid ModelResponse format');
  }
};

const isModelResponse = (object: any): object is ModelResponse => {
  return typeof object.response === 'string' && typeof object.action === 'object';
};
