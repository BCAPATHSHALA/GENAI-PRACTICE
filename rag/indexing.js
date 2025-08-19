import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

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
    console.log(`Total chunks: ${chunks.length} | First chunk: ${chunks[0]}`);
  } catch (err) {
    console.log(`Indexing error: ${err}`);
  }
};

main();
