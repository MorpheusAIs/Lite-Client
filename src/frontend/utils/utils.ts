import { ModelResponse } from './types';

export const parseResponse = (jsonString: string) => {
  // Assert the type of the parsed object.
  console.log(jsonString)
  let parsed: string
  try {
    parsed = JSON.parse(jsonString);
  } catch(error) {
    try {
      jsonString = jsonString + '}' //llama often forgets this
      parsed = JSON.parse(jsonString);
    } catch(error){
      //new Error("Ollama error")
      //console.log("RETURN WHOLE STRING")
      return {response: "error", transaction: {}} //alot of the time the answer is in the jsonString but you got to get it out
    }
  }

  if (isModelResponse(parsed)) {
    return { response: parsed.response, transaction: parsed.transaction };
  } else {
    throw new Error('Invalid ModelResponse format');
  }
};

const isModelResponse = (object: any): object is ModelResponse => {
  return 'response' in object && 'transaction' in object;
};
