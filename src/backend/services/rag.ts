import * as fs from 'fs';
import * as path from 'path';
import {
  serviceContextFromDefaults,
  Document,
  Ollama,
  VectorStoreIndex,
  OllamaEmbedding,
} from 'llamaindex';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';

// Constants
const TOP_K_METADATA: number = 2;
const TOP_K_ABIS: number = 5;
const TOP_K_EXAMPLES: number = 1;

const NLQ: string = 'What is the current block number?';

// Smart Contracts Directory with ABI to make initial function call
const CONTRACTS_DIR: string = 'src/backend/data/contracts';

// Contracts
let contracts: Array<[string, any]> = [];

// Contract Filenames
const contractFilenames: string[] = [
  '1inch.json',
  'curve.json',
  'lido.json',
  'pancakeswap.json',
  'router.json',
  'sushiswap.json',
  'uniswap.json',
  'usdc.json',
  'usdt.json',
];

// Function to extract metadata and abi from a contract object
function extractMetadataAbi(contract: any): any {
  const subsetKeys: Set<string> = new Set(['metadata', 'abi']);
  let result: any = {};
  for (let key in contract) {
    if (subsetKeys.has(key)) {
      result[key] = contract[key];
    }
  }
  return result;
}

contractFilenames.forEach((contractFilename) => {
  let filePath: string = path.join(CONTRACTS_DIR, contractFilename);
  let rawData: string = fs.readFileSync(filePath, 'utf8');
  let payload: any = JSON.parse(rawData);

  if (payload.contracts) {
    payload.contracts.forEach((contract: any) => {
      contracts.push([contractFilename, extractMetadataAbi(contract)]);
    });
  } else {
    contracts.push([contractFilename, extractMetadataAbi(payload)]);
  }
});

// For Smart Contract ABI Metadata
const documentsContractsMetadata = contracts.map((contract) => {
  return new Document({
    text: contract[1].metadata.toString(),
    metadata: {
      fname: contract[0],
      abis: contract[1].abi,
    },
    excludedEmbedMetadataKeys: ['abis', 'fname'],
    excludedLlmMetadataKeys: ['abis', 'fname'],
  });
});

console.log('Documents Contracts Metadata:', documentsContractsMetadata);

const ollamaLLM = new Ollama({ model: 'llama2:7b' });

const serviceContext = serviceContextFromDefaults({
  llm: ollamaLLM,
  embedModel: ollamaLLM,
  chunkSize: 4096,
});

// Create Vector Store Index
const indexCreation = async () => {
  var index = await VectorStoreIndex.fromDocuments(documentsContractsMetadata, {
    serviceContext: serviceContext,
  });

  console.log('Index:', index);

  return index;
};

const index = await indexCreation();

// Load Contract ABIs
const loadContractABIs = async (): Promise<any> => {
  try {
    console.log('Retrieving Contract ABIs...');

    const retriever = index.asRetriever();

    console.log('Retriever:', retriever);

    const retrievedContracts = await retriever.retrieve(NLQ);

    // Format the Retrieved Contracts based on the results
    const formattedContracts = retrievedContracts.map((contract) => {
      return `The Contract: ${contract.node.text}\nThe Contract's ABI:\n${contract.node.metadata.abis}`;
    });

    console.log('Formatted Contracts:', formattedContracts);

    // Create In Memory Vector Store
    return createInMemoryVectorStore(formattedContracts);
  } catch (error) {
    console.error('Error loading contracts:', error);
    throw error;
  }
};

// Create In Memory Vector Store
const createInMemoryVectorStore = async (contracts: string[]): Promise<any> => {
  console.log('Creating In Memory Vector Store...');

  // Metadata
  const metadata = [];

  // Embeddings
  const embeddings = new OllamaEmbeddings({ model: 'llama2:7b' });

  return FaissStore.fromTexts(contracts, metadata, embeddings);
};

console.log('Loading Contract ABIs...');

// Load Contract ABIs
const abiInMemoryVectorStore = await loadContractABIs();

// Create ABI Retriever
export const contractAbiRetriever = await abiInMemoryVectorStore.asRetriever({ k: TOP_K_ABIS });

// Load Metamask Examples
const loadMetamaskExamples = async (): Promise<any> => {
  try {
    const directoryLoader = new DirectoryLoader('src/backend/data/metamask_eth_examples', {
      '.txt': (path: string) => new TextLoader(path),
    });

    const examples = await directoryLoader.load();

    console.log('Examples:', examples);

    return createFaissStoreFromExamples(examples);
  } catch (error) {
    console.error('Error loading examples:', error);
    throw error;
  }
};

// Create Faiss Store
const createFaissStoreFromExamples = async (examples: any[]): Promise<any> => {
  // Embeddings
  const embeddings = new OllamaEmbeddings({ model: 'llama2:7b' });

  return FaissStore.fromDocuments(examples, embeddings);
};

// Metamask Examples
const metamaskExamplesInMemoryVectorStore = await loadMetamaskExamples();

// Retrieval Engine
export const metamaskExamplesRetriever = metamaskExamplesInMemoryVectorStore.asRetriever({
  k: TOP_K_EXAMPLES,
});
