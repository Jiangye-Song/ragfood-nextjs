# GitHub Copilot Instructions

## Core Commands

### Development
- `npm run dev` - Start development server with Turbopack (default port 3000, fallback 3001)
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
- `npx tsc --noEmit` - TypeScript type checking without compilation

### Testing & Validation
- Check development server: `Get-Process -Name "node" -ErrorAction SilentlyContinue`
- Kill existing server: `Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue`
- Automated setup: `.\setup.ps1` (Windows PowerShell)

### Environment Management
- Copy `.env.simple.example` to `.env.local` for quick start

- Use `.env.cloud.example` for production deployment

## Architecture

### Tech Stack
- **Framework**: Next.js 15.3.4 with App Router and Turbopack
- **Language**: TypeScript 5+ with strict mode
- **UI**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS 4 with class-variance-authority
- **Validation**: Zod schemas for runtime type checking
- **Icons**: Lucide React

### Core Services
- **Vector Databases**: Simple in-memory DB (default), Upstash Vector (cloud)
- **Embeddings**: Ollama (`mxbai-embed-large`) or Clarifai
- **LLM**: Ollama (`llama3.2`) or Groq cloud
- **Data Storage**: JSON file (`foods.json`) + vector embeddings

### Project Structure
```
app/
├── actions/           # Server Actions (no API routes)
│   ├── data-actions.ts       # Food data loading
│   ├── embedding-actions.ts  # Vector embedding operations
│   └── query-actions.ts      # RAG search & LLM queries
├── layout.tsx
└── page.tsx          # Main RAG interface

lib/
├── providers/        # Service abstractions with factory pattern
│   ├── database.ts   # Vector DB abstraction (Simple/Upstash)
│   ├── embeddings.ts # Embedding service abstraction
│   └── llm.ts       # LLM service abstraction
├── config.ts        # Environment validation with Zod
├── types.ts         # TypeScript interfaces & Zod schemas
└── utils.ts         # Utility functions

components/
├── ui/              # Shadcn components
├── EmbeddingSection.tsx     # Data loading interface
├── QuestionSection.tsx      # Query input form
└── ProgressiveResponseSection.tsx # Results display (RAG-first UI)
```

### Data Flow
1. **Embedding Phase**: Load `foods.json` → Generate embeddings → Store in vector DB
2. **Query Phase**: User question → Embed question → Vector search → LLM generation
3. **Progressive UI**: Question display → RAG results → AI response

## Code Standards

### TypeScript Rules
- **Strict typing**: No `any` types, explicit interfaces required
- **Zod validation**: All Server Action inputs/outputs must use Zod schemas
- **Error handling**: Proper TypeScript error types, comprehensive try/catch
- **Imports**: Use `@/*` path aliases, organize by external/internal/relative

### Naming Conventions
- **Files**: kebab-case (`embedding-actions.ts`)
- **Components**: PascalCase (`ProgressiveResponseSection`)
- **Functions**: camelCase (`getRagSearchResults`)
- **Types**: PascalCase interfaces (`RagDetails`), descriptive names

### Server Actions Pattern
- Only Server Actions for backend logic (no `/api` routes)
- All actions in `app/actions/` directory
- Zod schema validation for inputs: `QuerySchema.parse(request)`
- Consistent return types: `{ success: boolean, data?: T, error?: string }`
- Singleton pattern for service initialization

### Environment Configuration
```typescript
// Use factory pattern for provider switching
const envSchema = z.object({
  VECTOR_DB_TYPE: z.enum(['simple', 'chroma', 'upstash']).default('simple'),
  EMBEDDING_PROVIDER: z.enum(['ollama', 'clarifai']).default('ollama'),
  LLM_PROVIDER: z.enum(['ollama', 'groq']).default('ollama'),
  // ... other config
})
```

## Development Workflow

### Server Management
1. **Always check** for existing dev server before starting
2. **Reuse existing** servers when possible (ports 3000/3001)
3. **Monitor logs** for compilation errors, runtime issues
4. **Verify hot reload** picks up changes
5. **Kill and restart** only for major structural changes

### Code Quality Checks
After each change:
1. TypeScript compilation: `npx tsc --noEmit`
2. Lint checking: `npm run lint`
3. Browser console check for runtime errors
4. Hot reload verification

### Testing RAG System
1. Start development server
2. Click "Embed New Items" to load food data
3. Test with sample questions:
   - "What fruits are yellow and sweet?"
   - "Tell me about spicy foods"
   - "What foods are popular in tropical regions?"
4. Verify progressive UI: Question → RAG Results → AI Response

## Provider Architecture

### Database Providers
- **Simple**: In-memory vector DB with cosine similarity (default)
- **Upstash**: Cloud vector database for production

### AI Providers
- **Ollama**: Local models (`mxbai-embed-large`, `llama3.2`)
- **Clarifai**: Cloud embeddings (`mxbai-embed-large-v1`)
- **Groq**: Cloud LLM (`llama-3.2-3b-preview`)

### Configuration Switching
Environment variables control provider selection via factory functions in `lib/providers/`

## Key Features

### Progressive UI/UX
- **Question display**: Shows immediately upon submission
- **RAG results first**: Search results appear before AI response
- **Visual indicators**: Loading states, completion badges, error handling
- **Two-column layout**: RAG details (left) + AI response (right)

### Type Safety
- Zod schemas for runtime validation
- Strong TypeScript interfaces throughout
- Custom types for metadata, embeddings, responses
- No `any` types in custom code

### Error Handling
- Graceful failures with user-friendly messages
- Console logging for developers
- Retry mechanisms for rate limits
- Fallback states for service unavailability

## External Dependencies

### Required for Local Development
- **Ollama**: Download models with `ollama pull mxbai-embed-large` and `ollama pull llama3.2`
- **Node.js 18+**: Required for Next.js 15
- **PowerShell**: Default CLI for Windows development

### Optional for Advanced Features

- **Cloud API Keys**: Upstash, Clarifai, Groq for production deployment

## Common Issues

### Development Server
- Port conflicts: Automatically falls back from 3000 to 3001
- Hot reload issues: Restart server for major structural changes
- TypeScript errors: Run `npx tsc --noEmit` to identify issues

### AI Services
- Ollama connection: Ensure service is running on `localhost:11434`
- Model availability: Check `ollama list` for required models
- Rate limiting: Cloud providers have free tier limits

### Vector Database
- Simple DB: Stores in `simple_vector_db.json` in project root
- ChromaDB: Requires separate server process
- Upstash: Needs valid API credentials for cloud deployment
