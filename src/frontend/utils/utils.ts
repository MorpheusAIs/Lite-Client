import { json } from 'react-router-dom';
import { ModelResponse } from './types';

export const parseResponse = (jsonString: string) => {
  // Assert the type of the parsed object.
  console.log(jsonString);
  // uses regex to remove comments that llama sometimes includes in the JSON string
  // ranges from // to the end of the line or the end of the string
  jsonString = jsonString.replace(/(?<!\\)\/\/.*?(?=\n|$)/gm, '');
  let parsed: string;
  try {
    parsed = JSON.parse(jsonString);
  } catch (error) {
    try {
      jsonString = jsonString + '}'; //llama often forgets this
      parsed = JSON.parse(jsonString);
    } catch (error) {
      new Error('Ollama error');
      return { response: 'error', action: {} };
    }
  }

  if (isModelResponse(parsed)) {
    return { response: parsed.response, action: parsed.action };
  } else {
    throw new Error('Invalid ModelResponse format');
  }
};

const isModelResponse = (object: any): object is ModelResponse => {
  return 'response' in object && 'action' in object;
};
