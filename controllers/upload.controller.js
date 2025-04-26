import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { QdrantVectorStore } from "@langchain/qdrant";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

const uploadPDFFile = async (req, res, next) => {
  try {
    const filename = req.file.filename;
    const filePath = path.join("uploads", req.file.filename);
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    const embeddings = new HuggingFaceTransformersEmbeddings({
      model: "sentence-transformers/all-mpnet-base-v2",
      apiKey: process.env.HUGGINGFACE_API_KEY,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "pdf-embeddings",
      }
    );
    await vectorStore.addDocuments(docs);
    console.log(`All docs are added to vector store`);

    res.status(201).json({ message: "PDF uploaded successfully", filename });
  } catch (error) {
    next(error);
  }
};

export default { uploadPDFFile };
