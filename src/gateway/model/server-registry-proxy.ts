import Database from "better-sqlite3";
import { pipeline } from "@xenova/transformers"; // Local embeddings
import { ToolResultContent } from "@modelcontextprotocol/sdk/types";
import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import {
  Prompt,
  Resource,
  ServerCapabilities,
  Tool,
} from "../../common/mcp-types";

interface ServerCache {
  serverId: string;
  capabilities: ServerCapabilities;
  tools: Tool[];
  resources: Resource[];
  prompts: Prompt[];
  lastUpdated: number;
}

interface SearchResult {
  serverId: string;
  toolName: string;
  description: string;
  tool: ToolResultContent;
  similarity: number;
}
export class ServerRegistryProxy extends Proxy {
  private db: Database.Database;
  private embedder: (text: string, { pooling, normalize }) => Promise<any>; // Transformers pipeline
  private serverCache: Map<string, ServerCache> = new Map();

  async initialize() {
    // Initialize SQLite
    this.db = new Database("gateway-cache.db");

    // Create tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tool_embeddings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id TEXT NOT NULL,
        tool_name TEXT NOT NULL,
        description TEXT,
        embedding BLOB NOT NULL,
        tool_data TEXT NOT NULL,
        UNIQUE(server_id, tool_name)
      );
      
      CREATE TABLE IF NOT EXISTS resource_embeddings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id TEXT NOT NULL,
        resource_uri TEXT NOT NULL,
        description TEXT,
        embedding BLOB NOT NULL,
        resource_data TEXT NOT NULL,
        UNIQUE(server_id, resource_uri)
      );
      
      CREATE TABLE IF NOT EXISTS prompt_embeddings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id TEXT NOT NULL,
        prompt_name TEXT NOT NULL,
        description TEXT,
        embedding BLOB NOT NULL,
        prompt_data TEXT NOT NULL,
        UNIQUE(server_id, prompt_name)
      );
    `);

    // Initialize local embedding model (small, fast)
    this.embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2", // ~23MB model
    );
  }

  async updateServerCache(data: never) {
    const { serverId, tools, resources, prompts, capabilities } = data;

    // Update in-memory cache
    let cache = this.serverCache.get(serverId);
    if (!cache) {
      cache = {
        serverId,
        capabilities,
        tools: [],
        resources: [],
        prompts: [],
        lastUpdated: Date.now(),
      };
      this.serverCache.set(serverId, cache);
    }

    // Update and embed tools
    if (tools) {
      cache.tools = tools;
      await this.embedTools(serverId, tools);
    }

    // Update and embed resources
    if (resources) {
      cache.resources = resources;
      await this.embedResources(serverId, resources);
    }

    // Update and embed prompts
    if (prompts) {
      cache.prompts = prompts;
      await this.embedPrompts(serverId, prompts);
    }

    cache.lastUpdated = Date.now();
  }

  private async embedTools(serverId: string, tools: Tool[]) {
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO tool_embeddings 
      (server_id, tool_name, description, embedding, tool_data)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const tool of tools) {
      const text = `${tool.name}: ${tool.description || ""}`;
      const embedding = await this.embedder(text, {
        pooling: "mean",
        normalize: true,
      });

      // Convert Float32Array to Buffer
      const embeddingBuffer = Buffer.from(embedding.data.buffer);

      insert.run(
        serverId,
        tool.name,
        tool.description,
        embeddingBuffer,
        JSON.stringify(tool),
      );
    }
  }

  private async embedResources(serverId: string, resources: Resource[]) {
    // Similar pattern for resources
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO resource_embeddings 
      (server_id, resource_uri, description, embedding, resource_data)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const resource of resources) {
      const text = `${resource.uri}: ${resource.name || ""} ${resource.description || ""}`;
      const embedding = await this.embedder(text, {
        pooling: "mean",
        normalize: true,
      });

      insert.run(
        serverId,
        resource.uri,
        resource.description,
        Buffer.from(embedding.data.buffer),
        JSON.stringify(resource),
      );
    }
  }

  private async embedPrompts(serverId: string, prompts: Prompt[]) {
    // Similar pattern for prompts
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO prompt_embeddings 
      (server_id, prompt_name, description, embedding, prompt_data)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const prompt of prompts) {
      const text = `${prompt.name}: ${prompt.description || ""}`;
      const embedding = await this.embedder(text, {
        pooling: "mean",
        normalize: true,
      });

      insert.run(
        serverId,
        prompt.name,
        prompt.description,
        Buffer.from(embedding.data.buffer),
        JSON.stringify(prompt),
      );
    }
  }

  async searchTools(
    query: string,
    limit: number = 10,
  ): Promise<SearchResult[]> {
    // Generate query embedding
    const queryEmbedding = await this.embedder(query, {
      pooling: "mean",
      normalize: true,
    });
    const queryArray = Array.from(queryEmbedding.data);

    // Get all tool embeddings
    const tools = this.db
      .prepare(
        `
      SELECT server_id, tool_name, description, embedding, tool_data
      FROM tool_embeddings
    `,
      )
      .all();

    // Calculate cosine similarity
    const results = tools.map((row: any) => {
      const embedding = new Float32Array(row.embedding.buffer);
      const similarity = this.cosineSimilarity(
        queryArray,
        Array.from(embedding),
      );

      return {
        serverId: row.server_id,
        toolName: row.tool_name,
        description: row.description,
        tool: JSON.parse(row.tool_data),
        similarity,
      };
    });

    // Sort by similarity and return top results
    return results.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  getServerTools(serverId: string): Tool[] {
    return this.serverCache.get(serverId)?.tools || [];
  }

  getServerResources(serverId: string): Resource[] {
    return this.serverCache.get(serverId)?.resources || [];
  }

  getServerPrompts(serverId: string): Prompt[] {
    return this.serverCache.get(serverId)?.prompts || [];
  }
}
