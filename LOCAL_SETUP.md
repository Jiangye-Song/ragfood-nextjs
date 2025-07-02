# Local Setup Instructions for Food RAG System

This guide will help you set up the Food RAG (Retrieval-Augmented Generation) system locally on your Windows machine.

## Prerequisites

### Required Software
1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
2. **Git** - Download from [git-scm.com](https://git-scm.com/)
3. **Ollama** (for local AI) - Download from [ollama.ai](https://ollama.ai/)

### Optional Software
4. **VS Code** - Recommended IDE with TypeScript support

## Setup Steps

### 1. Clone and Install Dependencies

```powershell
# Navigate to your projects directory
cd C:\Users\{YourUsername}\Documents\code\ai\

# Clone the repository (if not already done)
git clone <your-repo-url> rag-food-nextjs
cd rag-food-nextjs

# Install dependencies
npm install

# Verify installation
npm run lint
```

### 2. Install Ollama Models

Open PowerShell as Administrator and run:

```powershell
# Download and install required models (this may take several minutes)
ollama pull mxbai-embed-large
ollama pull llama3.2

# Verify models are installed
ollama list

# Test Ollama is working
ollama run llama3.2 "Hello, say 'Ollama is working!'"
```

Expected output should show both models and a response from llama3.2.

### 3. Environment Configuration

Choose one of the following configurations based on your needs:

## Configuration Options

### Option 1: Simple Vector Database (Recommended for Quick Start)

Create or update `.env.local`:

```bash
# Simple embedded vector database (no external dependencies)
VECTOR_DB_TYPE=simple
EMBEDDING_PROVIDER=ollama
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
EMBED_MODEL=mxbai-embed-large
LLM_MODEL=llama3.2

# Optional: Customize simple DB file location
# SIMPLE_DB_PATH=./simple_vector_db.json
```

**Pros:**
- ✅ No additional setup required
- ✅ Works immediately
- ✅ Good for development and testing

**Cons:**
- ❌ Limited to cosine similarity search

### Option 3: Cloud Providers (For Production)

For cloud deployment, update `.env.local`:

```bash
# Cloud configuration
VECTOR_DB_TYPE=upstash
EMBEDDING_PROVIDER=clarifai
LLM_PROVIDER=groq

# Upstash Vector Database
UPSTASH_VECTOR_URL=https://your-vector-db-url.upstash.io
UPSTASH_VECTOR_TOKEN=your-upstash-token

# Clarifai for embeddings
CLARIFAI_PAT=your-clarifai-personal-access-token
CLARIFAI_MODEL_URL=https://clarifai.com/mixedbread-ai/embed/models/mxbai-embed-large-v1

# Groq for LLM
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.2-3b-preview
```

**Setup Requirements:**
1. Create [Upstash](https://upstash.com/) account and vector database
2. Get [Clarifai](https://clarifai.com/) API key
3. Get [Groq](https://groq.com/) API key

## Starting the Application

### 1. Check for Existing Development Server

```powershell
# Check if any Node processes are running
Get-Process -Name "node" -ErrorAction SilentlyContinue

# If servers are running on ports 3000/3001, check them
netstat -an | findstr ":3000"
netstat -an | findstr ":3001"
```

### 2. Start Development Server

```powershell
# Start the development server
npm run dev

# If port 3000 is occupied, it will automatically use 3001
# Look for output like:
# - Local:        http://localhost:3000
# - Network:      http://192.168.x.x:3000
```

### 3. Verify Setup

Open your browser and navigate to the URL shown (usually `http://localhost:3000` or `http://localhost:3001`).

You should see:
1. **Embedding Section** - Shows food data loading status
2. **Question Section** - Input field for questions
3. **Response Section** - Will show results after asking questions

## Testing the System

### 1. Load Food Data

1. Click "Embed New Items" button in the Embedding Section
2. Wait for the embedding process to complete
3. You should see "✅ All items embedded successfully"

### 2. Test RAG Queries

Try these example questions:
- "What fruits are yellow and sweet?"
- "Tell me about spicy foods"
- "What foods are popular in tropical regions?"
- "Which foods are red in color?"

Expected flow:
1. **Question appears immediately** in "Your Question" section
2. **RAG Search Results** appear first (left column)
3. **AI Response** appears after (right column)

## Troubleshooting

### Common Issues

#### 1. Ollama Not Working

```powershell
# Check if Ollama is running
ollama list

# Restart Ollama service
# Close Ollama from system tray and restart

# Test connection
curl http://localhost:11434/api/tags
```

#### 2. Port Already in Use

```powershell
# Kill existing Node processes
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Start fresh
npm run dev
```

#### 3. TypeScript Errors

```powershell
# Check for type errors
npx tsc --noEmit

# Check for lint errors
npm run lint

# Fix and restart
npm run dev
```

#### 4. Embedding Fails

Check the browser console and terminal for errors:
- Ensure Ollama is running
- Verify model names in `.env.local`
- Check `foods.json` exists in project root

### Environment Verification

Create a test script to verify your setup:

```powershell
# Test Ollama connection
curl -X POST http://localhost:11434/api/embeddings -H "Content-Type: application/json" -d '{\"model\": \"mxbai-embed-large\", \"prompt\": \"test\"}'

# Test LLM
curl -X POST http://localhost:11434/api/generate -H "Content-Type: application/json" -d '{\"model\": \"llama3.2\", \"prompt\": \"Say hello\", \"stream\": false}'
```

## Development Workflow

### 1. Server Management
- **Always check** if dev server is running before starting
- **Reuse existing** servers when possible
- **Kill and restart** only when necessary for major changes

### 2. Code Quality Checks
After making changes, always run:

```powershell
# Type checking
npx tsc --noEmit

# Lint checking
npm run lint

# Ensure hot reload picked up changes
# Check browser console for errors
```

### 3. Monitoring
Keep these terminals open:
1. **Development server** - Shows compilation and runtime errors
2. **Browser console** - Shows client-side errors
3. **Ollama logs** - Monitor AI service responses

## Performance Tips

### 1. Embedding Optimization
- Load embeddings once and reuse
- Use incremental embedding for new data
- Consider batch processing for large datasets

### 2. Query Optimization
- Cache frequent queries
- Limit result count to 3-5 documents
- Use appropriate similarity thresholds

### 3. Development Speed
- Use hot reload for instant feedback
- Keep TypeScript strict mode enabled
- Monitor bundle size with `npm run build`

## Next Steps

1. **Test all functionality** with sample questions
2. **Add your own food data** to `foods.json`
3. **Experiment with different models** in Ollama
4. **Try cloud providers** for production deployment
5. **Customize UI components** with Shadcn modifications

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check terminal outputs for specific error messages
4. Ensure environment variables are set correctly

The system is designed to work out-of-the-box with the Simple Vector Database configuration for immediate testing and development.
