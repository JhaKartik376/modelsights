<p align="center">
  <img src="https://img.shields.io/badge/modelSIGHTS-LLM%20Observability-8B5CF6?style=for-the-badge&labelColor=1a1a2e" alt="modelSIGHTS" />
</p>

<h1 align="center">modelSIGHTS</h1>

<p align="center">
  <strong>Open-source LLM Observability & Evaluation Platform</strong>
</p>

<p align="center">
  Track every LLM call. Measure cost, latency, and quality. Evaluate outputs automatically. Visualize everything in real-time.
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/-Features-8B5CF6?style=flat-square" alt="Features" /></a>
  <a href="#architecture"><img src="https://img.shields.io/badge/-Architecture-8B5CF6?style=flat-square" alt="Architecture" /></a>
  <a href="#quick-start"><img src="https://img.shields.io/badge/-Quick%20Start-8B5CF6?style=flat-square" alt="Quick Start" /></a>
  <a href="#sdk-usage"><img src="https://img.shields.io/badge/-SDK-8B5CF6?style=flat-square" alt="SDK" /></a>
  <a href="#dashboard"><img src="https://img.shields.io/badge/-Dashboard-8B5CF6?style=flat-square" alt="Dashboard" /></a>
</p>

<br />

---

## What is modelSIGHTS?

modelSIGHTS is a **production-ready platform** for monitoring, evaluating, and optimizing your LLM-powered applications. Drop in the SDK, and instantly get:

- **Full request tracing** — every prompt, response, token count, and latency captured
- **Cost tracking** — real-time cost computation across models and providers
- **Quality evaluation** — automated relevance scoring, hallucination detection, and LLM-as-a-judge ratings
- **Real-time dashboard** — live analytics, log exploration, and model comparison

<br />

## Features

### SDK — One-line integration

```typescript
import { ModelSights } from "@modelsights/sdk";

const client = new ModelSights({
  apiKey: process.env.MODELSIGHTS_KEY,
  providerApiKey: process.env.OPENROUTER_API_KEY,
});

// Just use client.chat() instead of your provider's SDK
const result = await client.chat({
  model: "gpt-4",
  messages: [{ role: "user", content: "Explain quantum computing" }],
});

// That's it. Logging, metrics, and evaluation happen automatically.
console.log(result.content);
```

**Zero-latency overhead** — logging is fire-and-forget via an internal buffer. Your LLM responses are never delayed.

### Automated Evaluation

Every response is automatically scored on three dimensions:

| Signal | Method | Output |
|--------|--------|--------|
| **Relevance** | Embedding cosine similarity (prompt vs response) | 0.0 — 1.0 |
| **Hallucination** | Context grounding check + LLM fallback | 0.0 — 1.0 |
| **Quality** | LLM-as-a-Judge (accuracy, completeness, clarity) | 1 — 10 |

### Real-time Dashboard

| Page | Description |
|------|-------------|
| **Overview** | Total requests, avg latency, total cost, live feed |
| **Logs Explorer** | Filter by model, date, score. Inspect prompt-response pairs |
| **Request Detail** | Full trace with metrics, evaluation scores, token breakdown |
| **Model Comparison** | Cost vs latency vs quality charts across models |
| **Cost Analytics** | Cumulative cost, per-model breakdown, projections |

<br />

## Architecture

```
┌─────────────────┐
│   Your App      │
│                 │
│  ModelSights SDK│──── fire & forget ────┐
│  (wraps LLM)   │                       │
└────────┬────────┘                       │
         │ LLM response                  │
         ▼                               ▼
┌─────────────────┐              ┌───────────────┐
│  LLM Provider   │              │ Ingestion API │
│  (OpenRouter)   │              │   (Express)   │
└─────────────────┘              └───────┬───────┘
                                         │
                                    ┌────┴────┐
                                    │  Redis  │
                                    │  Queue  │
                                    └────┬────┘
                                    ┌────┴────┐
                              ┌─────┤ Workers ├─────┐
                              │     └─────────┘     │
                              ▼                     ▼
                     ┌──────────────┐     ┌──────────────┐
                     │   Metrics    │     │  Evaluation  │
                     │   Worker     │     │   Worker     │
                     │ (cost/speed) │     │ (quality/hal)│
                     └──────┬───────┘     └──────┬───────┘
                            │                    │
                            ▼                    ▼
                     ┌──────────────────────────────┐
                     │    PostgreSQL + pgvector      │
                     │  requests | metrics | evals   │
                     │  embeddings | api_keys        │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │    Dashboard     │
                           │    (Next.js)     │
                           │   SSE real-time  │
                           └─────────────────┘
```

<br />

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **SDK** | TypeScript, OpenAI-compatible API (OpenRouter) |
| **API** | Node.js, Express, Zod validation |
| **Queue** | Redis, BullMQ |
| **Database** | PostgreSQL 17, pgvector, Drizzle ORM |
| **Dashboard** | Next.js (App Router), shadcn/ui, Recharts |
| **Real-time** | Server-Sent Events (SSE) |
| **Build** | pnpm workspaces, Turborepo, tsup |
| **Testing** | Vitest |

<br />

## Quick Start

### Prerequisites

- **Node.js** >= 20
- **Docker** (for PostgreSQL + Redis)
- **pnpm** (`npm install -g pnpm`)

### 1. Clone and install

```bash
git clone https://github.com/JhaKartik376/modelsights.git
cd modelsights
pnpm install
```

### 2. Start infrastructure

```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

This starts:
- **PostgreSQL 17** with pgvector on port `5432`
- **Redis 7** on port `6379`

### 3. Set up environment

```bash
cp .env.example .env
# Edit .env and add your API keys
```

### 4. Run migrations

```bash
pnpm db:migrate
```

### 5. Start development

```bash
pnpm dev
```

<br />

## Project Structure

```
modelsights/
│
├── apps/
│   ├── api/                 # Express ingestion API server
│   └── dashboard/           # Next.js analytics dashboard
│
├── packages/
│   ├── sdk/                 # ModelSights SDK (LLM wrapper)
│   ├── evaluation/          # Evaluation engine (relevance, hallucination, quality)
│   └── utils/               # Shared utilities (schemas, helpers)
│
├── workers/
│   ├── metrics-worker/      # Cost & latency processing
│   └── eval-worker/         # Evaluation job processing
│
├── infra/
│   ├── docker/              # Docker Compose configuration
│   └── db/                  # Drizzle schema & migrations
│       ├── schema/          # TypeScript table definitions
│       └── migrations/      # Generated SQL migrations
│
├── turbo.json               # Turborepo pipeline config
├── pnpm-workspace.yaml      # Workspace definitions
└── drizzle.config.ts        # Database config
```

<br />

## SDK Usage

### Basic usage

```typescript
import { ModelSights } from "@modelsights/sdk";

const client = new ModelSights({
  apiKey: "ms_live_...",           // Your modelSIGHTS API key
  providerApiKey: "sk-or-...",     // Your OpenRouter API key
});

const response = await client.chat({
  model: "gpt-4o",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "What is machine learning?" },
  ],
  temperature: 0.7,
});

console.log(response.content);
console.log(response.usage); // { inputTokens, outputTokens, totalTokens }
```

### What gets captured automatically

| Field | Description |
|-------|-------------|
| `requestId` | Unique UUIDv7 for every call |
| `model` | Model name (e.g., `gpt-4o`) |
| `prompt` | Full message history |
| `response` | Complete model output |
| `latencyMs` | End-to-end response time |
| `inputTokens` | Prompt token count |
| `outputTokens` | Completion token count |
| `timestamp` | When the call was made |

<br />

## Database Schema

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   requests   │────►│   metrics    │     │   api_keys   │
│              │     │              │     │              │
│ id           │     │ request_id   │     │ key_hash     │
│ request_id   │     │ cost_usd     │     │ name         │
│ model        │     │ latency_ms   │     │ last_used_at │
│ prompt       │     │ tokens/sec   │     └──────────────┘
│ response     │     └──────────────┘
│ latency_ms   │
│ tokens       │     ┌──────────────┐
│              │────►│ evaluations  │
│              │     │              │
│              │     │ relevance    │
│              │     │ hallucination│
│              │     │ quality      │
│              │     └──────────────┘
│              │
│              │     ┌──────────────┐
│              │────►│  embeddings  │
│              │     │              │
│              │     │ vector(1536) │
│              │     │ content_type │
└──────────────┘     └──────────────┘
```

<br />

## Development

### Available commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all services in development mode |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm typecheck` | Type-check all packages |
| `pnpm db:generate` | Generate new migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |

### Docker commands

```bash
# Start infrastructure
docker compose -f infra/docker/docker-compose.yml up -d

# Stop infrastructure
docker compose -f infra/docker/docker-compose.yml down

# Reset database (destroys data)
docker compose -f infra/docker/docker-compose.yml down -v
```

<br />

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `OPENROUTER_API_KEY` | OpenRouter API key for LLM calls | Yes |
| `OPENAI_API_KEY` | OpenAI key for embeddings & judge model | For evaluation |
| `EMBEDDING_MODEL` | Embedding model name | Default: `text-embedding-3-small` |
| `JUDGE_MODEL` | LLM judge model name | Default: `gpt-4o-mini` |
| `MODELSIGHTS_API_URL` | Ingestion API URL | Default: `http://localhost:3001` |

<br />

## Roadmap

- [x] Monorepo setup (pnpm + Turborepo)
- [x] Database schema with pgvector
- [x] Docker infrastructure
- [ ] SDK with OpenRouter integration
- [ ] Ingestion API
- [ ] Metrics worker (cost & latency)
- [ ] Evaluation engine (relevance, hallucination, quality)
- [ ] Real-time dashboard
- [ ] SSE live updates
- [ ] Model comparison analytics
- [ ] Full Docker deployment
- [ ] Prompt versioning
- [ ] Cost anomaly alerts

<br />

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

<br />

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/JhaKartik376">
        <img src="https://avatars.githubusercontent.com/u/195823465?v=4" width="100px;" alt="Kartik Jha" style="border-radius: 50%;" /><br />
        <sub><b>Kartik Jha</b></sub>
      </a>
      <br />
      <sub>Creator & Maintainer</sub>
    </td>
  </tr>
</table>

<br />

## License

MIT

---

<p align="center">
  Built with focus on developer experience and production readiness.
</p>
