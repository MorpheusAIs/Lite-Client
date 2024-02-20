import { Document, VectorIndexRetriever } from "llamaindex";
import { buildLlamaIndex } from "./rag";

//have metamask retriever and contract retriever as fields
interface SmartAgent {
  process(): void //take nlq and process it
  retrieve(): void //retrieve contracts from nlq to create abi/method retreiver
}

type topK = {
  metadata: number,
  examples: number,
  abis: number
}

export class Morpheus implements SmartAgent {

    private contractRetriever: any
    private exampleRetriever: any
    private topK: topK // maybe initialise these in constructor and ensure these are unsigned integers, getters and setters

    constructor(_topK: topK){
      //intalise example and contract retreiver

      //build vector store than intialise retriever
      const llamaIndex = buildLlamaIndex() //make this return index
      this.topK = _topK
      const topKMetadata = _topK.metadata
      //this.contractRetriever = new VectorIndexRetriever({index: llamaIndex, similarityTopK: topKMetadata} )
    }
    //return abi retriever to use in RunnablePassthrough wrapped in RunnableParallel
    retrieve(): void {
      
    }
    process(): void {
      
    }
}
//function to call to instantiate morpheus in background process
export const initaliseMorpheus = async (): Promise<void> => {
  
}