import "dotenv/config";

function getRequiredEnv(name:string){
    const value = process.env[name];
    if(!value){
        throw new Error("Environment varibales missing");
    }

    return value;
}

export const config = {
    port: getRequiredEnv("PORT"),
    supportedDocTypes: getRequiredEnv("SUPPORTED_DOCS"),
    geminiApiKey: getRequiredEnv("GEMINI_API_KEY"),
    embeddingModel: getRequiredEnv("EMBEDDING_MODEL"),
    dimensions: getRequiredEnv("DIMENSIONS"),
    elasticsearchUrl: getRequiredEnv("ES_URL"),
    chromaHost: getRequiredEnv("CHROMA_HOST"),
    chromaPort: getRequiredEnv("CHROMA_PORT")
}