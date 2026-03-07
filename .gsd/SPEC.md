# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision

CodeSplain is a web application that helps developers understand unfamiliar code instantly. Users paste code into a Monaco-powered editor, select a language and difficulty level, and receive structured AI-generated explanations covering summaries, line-by-line breakdowns, key concepts, improvements, simplified versions, and example I/O. The platform supports multiple AI providers (Gemini, Claude, GPT) through a Bring Your Own Key model with a limited free tier, making it the "ChatGPT for understanding code."

## Goals

1. **Primary**: Build a polished, production-quality code explanation tool with a premium dark-themed UI
2. **Secondary**: Implement multi-provider AI gateway with BYOK + free tier (10 explanations)
3. **Tertiary**: Enable shareable explanation links and interactive syntax visualization (hover-to-highlight)
4. **Portfolio**: Deliver portfolio-level quality that demonstrates real-world full-stack engineering

## Non-Goals (Out of Scope)

- User authentication / accounts (v1 uses localStorage only)
- Code execution / running pasted code
- Collaborative editing or real-time features
- Mobile-first responsive design (desktop-first)
- Full relational database (v1 uses minimal KV store for free tier tracking only)
- Paid subscription tiers or payment processing
- IDE extensions or CLI tools

## Users

### Primary
- **Beginner developers** learning to code — need plain-English explanations
- **Students** studying programming — need concept breakdowns and simplified versions
- **GitHub explorers** — need quick understanding of unfamiliar code

### Secondary
- **Developers reviewing unfamiliar codebases** — need efficient line-by-line analysis
- **Interview preparation** — need to understand algorithmic patterns

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Code Editor | Monaco Editor (@monaco-editor/react) |
| Animations | Framer Motion |
| Backend | Next.js API Routes |
| AI Providers | Google Gemini, Anthropic Claude, OpenAI GPT |
| Client Storage | localStorage (API keys, cached explanations) |
| Server Storage | Vercel KV / Upstash Redis (free tier IP tracking only) |
| Deployment | Vercel |

## Design System

| Token | Value |
|-------|-------|
| Background | `#0D1117` |
| Card | `#161B22` |
| Border | `#30363D` |
| Muted Text | `#8B949E` |
| Body Text | `#C9D1D9` |
| Link/Accent | `#58A6FF` |
| Success | `#238636` |
| Primary Button | `#2F81F7` |
| Font Sans | Inter |
| Font Mono | JetBrains Mono |

## Constraints

- **API Keys**: Platform must provide a Gemini API key for free tier; users bring their own keys beyond that
- **BYOK Security**: Keys stored only in encrypted localStorage; sent client → API gateway per-request; never stored/logged server-side
- **Free Tier Limit**: 10 explanations per IP (tracked via server-side database counter)
- **No auth**: v1 has no user accounts — BYOK state is client-side, free tier is server-side
- **Streaming Order**: AI sections stream in fixed order: summary → line_by_line → concepts → improvements → simplified_code → examples
- **Supported Languages**: JavaScript, Python, TypeScript, Java, C++, HTML/CSS
- **Response Format**: AI must return structured JSON for consistent rendering
- **Security**: Must sanitize code input, prevent prompt injection, encrypt stored keys

## Success Criteria

- [ ] User can paste code, select language/difficulty, and receive a structured AI explanation
- [ ] All 6 explanation sections render correctly (summary, line-by-line, concepts, improvements, simplified, examples)
- [ ] Free tier counter works and blocks after 10 uses
- [ ] BYOK settings modal allows connecting Gemini/Claude/OpenAI keys
- [ ] AI gateway routes requests to the correct provider based on selection
- [ ] Code lines highlight when hovering explanation references
- [ ] Complexity meter displays estimated code complexity
- [ ] Shareable links preserve code + explanation
- [ ] UI matches the reference designs (dark theme, two-panel layout)
- [ ] Streaming AI responses display progressively
