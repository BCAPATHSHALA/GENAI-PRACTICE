import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";

const main = async () => {
  try {
    // Step 2: load the pdf data after raw data
    const pdfPath = "./nodejs.pdf";
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();
    console.log("Pages loaded:", docs.length);

    // Step 3: split pdf data into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 10000,
      chunkOverlap: 1000,
    });
    const chunks = await splitter.splitDocuments(docs);
    console.log("Total chunks: ", chunks.length);
    console.log("First chunk: ", chunks[0]);

    // Step 4: create vector embedding for each chunks
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: "text-embedding-3-large",
    });
    const vectorData = await embeddings.embedDocuments(
      chunks.map((chunk) => chunk.pageContent)
    );

    console.log("Total embeddings generated:", vectorData.length);
    console.log("Embedding for first chunk:", vectorData[0]);
  } catch (err) {
    console.log(`Indexing error: ${err}`);
  }
};

main();
