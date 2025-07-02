import { z } from 'zod'

// Food item interface
export interface FoodItem {
  id: string
  text: string
  region?: string
  type?: string
}

// Embedding result interface
export interface EmbeddingResult {
  success: boolean
  message: string
  count?: number
  error?: string
}

// Food item metadata interface
export interface FoodMetadata {
  region?: string
  type?: string
  [key: string]: string | number | boolean | undefined
}

// RAG query result interface
export interface RagResult {
  documents: string[]
  ids: string[]
  distances?: number[]
  metadatas?: (FoodMetadata | null)[]
}

// LLM response interface
export interface LlmResponse {
  response: string
  processingTime?: number
}

// RAG details interface (extracted for reuse)
export interface RagDetails {
  documents: string[]
  ids: string[]
  similarities?: number[]
  processingTime: number
  resultCount: number
}

// Complete RAG query response
export interface RagQueryResponse {
  success: boolean
  llmResponse?: string
  ragDetails?: RagDetails
  error?: string
}

// Provider types
export type VectorDbType = 'simple' | 'upstash'
export type EmbeddingProvider = 'ollama' | 'clarifai'
export type LlmProvider = 'ollama' | 'groq'

// Zod schemas for validation
export const FoodItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  region: z.string().optional(),
  type: z.string().optional(),
})

export const QuerySchema = z.object({
  question: z.string().min(1, 'Question cannot be empty'),
})

export const EmbedRequestSchema = z.object({
  force: z.boolean().optional().default(false),
})

export type FoodItemType = z.infer<typeof FoodItemSchema>
export type QueryType = z.infer<typeof QuerySchema>
export type EmbedRequestType = z.infer<typeof EmbedRequestSchema>
