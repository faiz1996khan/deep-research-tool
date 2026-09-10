import { Embeddings } from "@langchain/core/embeddings";
import { config } from "../config";
import { geminiClient } from "./gemini.client";

export class GeminiEmbeddings extends Embeddings {
    private readonly batchSize = 4;

    constructor() {
        super({})
    }

    async embedQuery(text: string): Promise<number[]> {
        const response = await geminiClient.models.embedContent({
            model: config.embeddingModel,
            contents: text,
            config : {
                outputDimensionality: Number(config.dimensions)
            }
        })

        const values = response.embeddings?.[0]?.values;

        if(!values?.length){
            throw new Error("Gemini returned an empty query embedding")
        }
        return values;
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        const results: number[][] = [];

        for (let i = 0; i < texts.length; i += this.batchSize) {
            const batch = texts.slice(i, i + this.batchSize);
            const embeddings = await Promise.all(batch.map(async (text:string) => this.embedQuery(text)));
            results.push(...embeddings);
        }

        return results;
    }
}