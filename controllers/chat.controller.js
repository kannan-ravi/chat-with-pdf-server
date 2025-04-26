import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { QdrantVectorStore } from "@langchain/qdrant";
import { ChatGroq } from "@langchain/groq";
const getChat = async (req, res, next) => {
  try {
    const query = req.query.message;

    const embeddings = new HuggingFaceTransformersEmbeddings({
      model: "sentence-transformers/all-mpnet-base-v2",
      apiKey: process.env.HUGGINGFACE_API_KEY,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "pdf-embeddings",
        apiKey: process.env.QDRANT_API_KEY,
      }
    );

    const ret = vectorStore.asRetriever({
      k: 2,
    });

    const result = await ret.invoke(query);
    const SYSTEM_PROMPT = `
    You are helful AI Assistant who answeres the query based on the available context from PDF File.
    Context:
    ${JSON.stringify(result)}
    `;

    const model = new ChatGroq({
      // model: "deepseek-r1-distill-llama-70b",
      model: "allam-2-7b",
      temperature: 0,
      apiKey: process.env.GROQ_API_KEY,
    });

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query },
    ];

    const chatResult = await model.invoke(messages);

    res.status(200).json({ docs: result, message: chatResult.content });
  } catch (error) {
    next(error);
  }
};

export default { getChat };
