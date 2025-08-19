import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const main = async () => {
  try {
    // Step 2: load the pdf data after raw data
    const pdfPath = "./nodejs.pdf";
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();

    console.log(docs);
  } catch (err) {
    console.log(`Indexing error: ${err}`);
  }
};

main();
