# CampusLink Architecture Documentation

## System Architecture Overview

```
                      +---------------------------------------+
                      |       Client (React 18 + Vite)        |
                      |  Tailwind CSS, TanStack Query, Axios  |
                      +-------------------+-------------------+
                                          |
                                    HTTP / JSON
                              (Bearer JWT Auth Token)
                                          |
                                          v
                      +---------------------------------------+
                      |         Server (Node 20 + Express)    |
                      |  Helmet, CORS, RateLimiter, Pino      |
                      +-----+---------------------------+-----+
                            |                           |
                 Zod Validated Controllers        Piscina Worker Pool
                 & Feature Services               - PDF Parsing (pdf-parse)
                            |                     - TF-IDF Baseline (natural)
                            |                     - Embeddings (all-MiniLM-L6-v2)
                            |                           |
                            v                           v
              +---------------------------+    +-----------------------+
              | MongoDB Atlas (Mongoose)  |    | Groq LLM API          |
              | - Relational Documents    |    | (JSON Mode, Sanitized |
              | - GridFS Resumes (PDFs)   |    |  Structured Prompts)  |
              | - Precomputed Embeddings  |    +-----------------------+
              +---------------------------+
```

## Key Invariants
1. **Explainable AI Matching**: No black-box decisions. Final match score is a transparent weighted formula:
   $$\text{Score} = (\text{Skill Coverage} \times 0.50 + \text{Doc Semantic Similarity} \times 0.30 + \text{Project Relevance} \times 0.20) \times 100$$
2. **Untrusted Resume Input**: Resume text is strictly sanitized to strip emails and phone numbers before interacting with any external LLM, and prompts instruct the LLM to ignore embedded instructions.
3. **No Heavy Computation on Main Event Loop**: Piscina worker pools isolate CPU-bound tasks (PDF parsing, embeddings, TF-IDF calculation).
4. **Resilient AI**: Every AI feature has an environment switch (`AI_ENABLED`, `EMBEDDINGS_ENABLED`) and a classical fallback (regex + synonym dictionary + TF-IDF) with `fallbackUsed: true` transparency flag.

