/** Experience, research notes, stack, system map and GitHub picks. */

export interface Experience {
  period: string;
  year: string;
  org: string;
  role: string;
  location: string;
  points: string[];
  tags: string[];
}

export const experience: Experience[] = [
  {
    period: 'Sep 2026 – Present',
    year: '2026',
    org: 'Smart India Hackathon 2026',
    role: 'Core Platform Engineer (Backend) · INDRA',
    location: 'Team Sixth Sense',
    points: [
      'Build and maintain INDRA’s core platform (layers 1–3 and 5–8a): ingestion, processing, geo-analytics, event fusion, data platform and the real-time API, for problem statement SIH26069 — National Weather Big Data Analytics.',
      'Streaming intake with a transactional outbox into Redpanda, pollers for official warnings and weather observations, a dead-letter queue and an S3-compatible data lake.',
      'A deterministic seven-factor Verification Receipt over PostGIS, H3 and DBSCAN clusters, with a hash-chained audit ledger and role-based access on every write.',
      '#1 contributor — 691 commits; 1,788 tests passing in the latest recorded run.',
    ],
    tags: ['FastAPI', 'Redpanda', 'PostGIS', 'H3', 'Event fusion'],
  },
  {
    period: 'Feb 2026 – Mar 2026',
    year: '2026',
    org: 'AI for Bharat',
    role: 'AI Engineer (Developer)',
    location: 'Patna, Bihar',
    points: [
      'Built DataScout, an agentic AI data analyst for natural-language data analysis on Amazon Bedrock and AWS serverless (S3, Lambda, API Gateway, DynamoDB).',
      'Implemented LLM-generated Python execution for analytical results — more accurate and auditable than generated text; built the Streamlit interface.',
      'Designed the security model: IAM role isolation, AES-256 encryption, audit logging and sandboxed execution.',
      'Led a team of 4 into the Prototype Development Phase of a national AI hackathon.',
    ],
    tags: ['Amazon Bedrock', 'Agents', 'Serverless', 'Team lead'],
  },
  {
    period: 'Jan 2026 – Feb 2026',
    year: '2026',
    org: 'WorldQuant BRAIN',
    role: 'Alpha Research Trainee',
    location: 'Remote',
    points: [
      'Designed and simulated equity alpha signals in WorldQuant BRAIN’s Fast Expression language on the US TOP3000 universe, with market and industry neutralization.',
      'Applied decay, truncation and delay constraints to manage turnover and risk; evaluated with Sharpe ratio, turnover, drawdown and out-of-sample test periods.',
    ],
    tags: ['Alpha Research', 'US TOP3000', 'Fast Expression', 'Neutralization', 'Backtesting'],
  },
];

export interface ResearchNote {
  id: string;
  title: string;
  kind: string;
  question: string;
  fields: { label: string; value: string }[];
  finding: string;
  formula: string;
  href?: string;
}

export const researchNotes: ResearchNote[] = [
  {
    id: 'N-01',
    title: 'Market Regime Detection',
    kind: 'Quantitative finance · IEEE-format paper',
    question: 'Can an unsupervised view of market state make a supervised allocator more robust?',
    fields: [
      { label: 'Methods', value: 'Hidden Markov Models + K-Means (hybrid labelling); XGBoost with sample weighting' },
      { label: 'Data', value: '15 years of NIFTY 50 · 28 engineered features (realized vol, VIX dynamics, skew)' },
      { label: 'Regimes', value: 'Low-volatility · Trending · Crisis' },
    ],
    finding:
      '78% regime prediction accuracy. In backtest, regime-driven allocation delivered 14.2% CAGR vs 10.8% buy-and-hold, with max drawdown cut from 50% to 18%.',
    formula: 'P(sₜ | sₜ₋₁) · P(xₜ | sₜ)',
    href: '/work/market-regime-detection',
  },
  {
    id: 'N-02',
    title: 'LLM Pruning & Explainability',
    kind: 'Interpretability · Model compression',
    question: 'When a transformer is pruned, do its explanations stay faithful?',
    fields: [
      { label: 'Methods', value: 'Random, L1 unstructured, L1 structured pruning · 40–80% sparsity' },
      { label: 'Explainers', value: 'SHAP · Integrated Gradients · FCor faithfulness metric' },
      { label: 'Models / Data', value: 'DistilBERT, RoBERTa · IMDb, Yelp' },
    ],
    finding:
      'Magnitude pruning preserves faithfulness up to 80% sparsity. Random pruning produces high-curvature landscapes (Hessian up to 14,090 vs 0.73 baseline) that break SHAP’s linearity assumptions.',
    formula: 'FCor = corr(φᵢ, Δf₋ᵢ)',
    href: '/work/llm-pruning-explainability',
  },
  {
    id: 'N-03',
    title: 'Alpha Research',
    kind: 'Systematic equities · WorldQuant BRAIN',
    question: 'What survives neutralization, decay and delay — and what was just noise?',
    fields: [
      { label: 'Universe', value: 'US TOP3000 equities' },
      { label: 'Tooling', value: 'Fast Expression language · market & industry neutralization' },
      { label: 'Constraints', value: 'Decay · truncation · delay' },
    ],
    finding:
      'Signals evaluated on Sharpe ratio, turnover and drawdown, with out-of-sample test periods as the final check.',
    formula: 'αᵢ,ₜ → neutralize → decay → w',
  },
];

export interface StackGroup {
  id: string;
  label: string;
  items: string[];
  /** Set for areas I'm actively learning — shown as a label. */
  status?: string;
}

export const stack: StackGroup[] = [
  { id: '01', label: 'Languages', items: ['Python', 'C++', 'SQL', 'JavaScript', 'Rust'] },
  {
    id: '02',
    label: 'ML & Quant',
    items: ['XGBoost', 'Prophet', 'HMM', 'K-Means', 'SHAP', 'Llama 3', 'MLflow', 'Backtesting'],
  },
  { id: '03', label: 'Data', items: ['PostgreSQL', 'DynamoDB', 'Pandas', 'NumPy', 'Scikit-learn'] },
  { id: '04', label: 'Web', items: ['FastAPI', 'Streamlit', 'Plotly', 'Next.js', 'React'] },
  {
    id: '05',
    label: 'Cloud',
    items: ['AWS', 'S3', 'Lambda', 'API Gateway', 'DynamoDB', 'Bedrock', 'IAM'],
  },
  { id: '06', label: 'Tooling', items: ['Git', 'Docker', 'pytest', 'Alembic', 'yfinance', 'Uvicorn'] },
  {
    id: '07',
    label: 'Streaming & Geo',
    items: ['Redpanda (Kafka)', 'PostGIS', 'H3', 'DBSCAN', 'Redis', 'SQLAlchemy (async)'],
  },
  {
    id: '08',
    label: 'MLOps',
    status: 'Learning + building',
    items: ['MLflow tracking & registry', 'Docker Compose', 'GitHub Actions', 'DVC', 'ONNX', 'Model serving (FastAPI)', 'Prometheus', 'Grafana'],
  },
  {
    id: '09',
    label: 'Inference',
    status: 'Learning',
    items: ['Ollama', 'llama.cpp', 'GGUF quantization', 'vLLM', 'KV cache & batching', 'LoRA / QLoRA (PEFT)', 'Hugging Face Transformers', 'ONNX Runtime'],
  },
];

export interface SystemNode {
  id: string;
  label: string;
  caption: string;
  examples: string[];
  projects: string[];
}

export const systemNodes: SystemNode[] = [
  {
    id: 'data',
    label: 'Data',
    caption: 'Start where the mess is.',
    examples: ['Citizen reports, official warnings, METAR observations', 'Financial market data — NIFTY 50, VIX', 'Retail demand — Walmart M5 sales, prices, calendar', 'News, social chatter and filings'],
    projects: ['INDRA', 'Regime Detection', 'DemandIQ', 'IndiEye', 'DataScout'],
  },
  {
    id: 'signal',
    label: 'Signal',
    caption: 'Turn raw data into something a model can use.',
    examples: ['Hazard tags, geocodes and H3 cells from raw text', 'Features — realized vol, skew, 7/14/28-day lags', 'Sentiment extracted from text', 'Market regimes as a latent state'],
    projects: ['INDRA', 'Regime Detection', 'DemandIQ', 'IndiEye'],
  },
  {
    id: 'model',
    label: 'Model',
    caption: 'Pick the simplest model that captures the structure.',
    examples: ['DBSCAN clusters and a weighted evidence model', 'XGBoost, Hidden Markov Models + K-Means, Prophet', 'Llama 3 (fine-tuned)', 'Agents on Amazon Bedrock'],
    projects: ['INDRA', 'Regime Detection', 'DemandIQ', 'IndiEye', 'DataScout'],
  },
  {
    id: 'evaluation',
    label: 'Evaluation',
    caption: 'Measure it the way it will be used.',
    examples: ['A verification receipt with published factor coverage', 'MAE per SKU; regime accuracy with class weighting', 'Sharpe, turnover, drawdown, out-of-sample', 'Explanation faithfulness (FCor)'],
    projects: ['INDRA', 'DemandIQ', 'Regime Detection', 'Alpha Research', 'LLM Pruning'],
  },
  {
    id: 'deployment',
    label: 'Deployment',
    caption: 'Ship it behind an interface people can use.',
    examples: ['FastAPI + WebSocket services on Redpanda, PostGIS, Redis', 'AWS — Lambda, API Gateway, S3, DynamoDB', 'Streamlit and Next.js dashboards', 'MLflow experiment tracking'],
    projects: ['INDRA', 'DemandIQ', 'IndiEye', 'DataScout'],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    caption: 'Close the loop.',
    examples: ['Human review queue and a hash-chained audit ledger', 'Telegram alerts for high-risk inventory', 'Late evidence that re-scores open events', 'Back to data — retrain'],
    projects: ['INDRA', 'DemandIQ', 'DataScout'],
  },
];

export const signalKeywords = [
  { word: 'AI / ML', note: 'Agents, fine-tuned LLMs, gradient boosting, explainability.', tag: 'DataScout · IndiEye' },
  { word: 'Quantitative Research', note: 'Regimes, alphas, backtests that respect time.', tag: 'Regimes · WorldQuant BRAIN' },
  { word: 'Data Systems', note: 'Streaming pipelines from raw reports to verified decisions.', tag: 'INDRA · DemandIQ' },
  { word: 'Cloud Infrastructure', note: 'Serverless AWS — Lambda, S3, API Gateway, DynamoDB.', tag: 'DataScout' },
  { word: 'MLOps & Inference', note: 'Shipping, serving and running models efficiently — learning now.', tag: 'Now' },
  { word: 'Developer Tools', note: 'APIs, dashboards and interfaces that make models usable.', tag: 'FastAPI · Streamlit' },
];

/**
 * Repositories shown in the Code section, in this order. Descriptions are
 * taken from each repo's README. Live stars / language / last push are merged
 * in from the GitHub API when it is reachable.
 */
export const featuredRepos = [
  { name: 'Demand_IQ', description: 'Retail demand forecasting & replenishment engine — Prophet + XGBoost, FastAPI, Streamlit.', language: 'Python' },
  { name: 'Data_scout', description: 'Agentic AI data analyst on Amazon Bedrock — natural-language questions, sandboxed Python answers.', language: 'Python' },
  { name: 'Indieye-ml', description: 'IndiEye ML service — regime classification, strategy, key levels and backtest APIs.', language: 'Python' },
  { name: 'sanjivani-ai', description: 'Multimodal crisis intelligence for Bihar floods — post triage, flood segmentation and resource forecasts behind one FastAPI.', language: 'Python' },
  { name: 'Indieye-news-sentiment', description: 'IndiEye news aggregation and LLM-powered sentiment & briefing service.', language: 'TypeScript' },
  { name: 'CNN_candleStick', description: 'OHLC → candlestick images → 2D CNN pattern classifier, with live inference over WebSocket.', language: 'Python' },
];

/** Smaller public builds, listed under Selected Work. Descriptions from each README. */
export const moreBuilds = [
  {
    name: 'CNN Candlestick Recognizer',
    description:
      '20-candle OHLC windows rendered as 64×64 chart images, labelled with TA-Lib patterns and classified by a 2D CNN — chronological splits, class weights, and live inference over the Dhan WebSocket API.',
    tags: ['TensorFlow', 'TA-Lib', 'mplfinance', 'WebSocket'],
    href: 'https://github.com/aditbytes/CNN_candleStick',
  },
  {
    name: 'Terminal Portfolio',
    description: 'A command-driven portfolio in React — who, skills, projects — with utilities and games (snake, tetris, 2048) behind the prompt.',
    tags: ['React', 'React Router'],
    href: 'https://github.com/aditbytes/Resume',
  },
  {
    name: 'The Neural Leaf',
    description: 'Web platform for an AI holding company: one design system with product pages for AI, data science, IoT and disaster intelligence.',
    tags: ['React', 'Tailwind', 'Framer Motion', 'Recharts'],
    href: 'https://github.com/aditbytes/the_neural_leaf',
  },
  {
    name: 'NITE',
    description: 'Landing page for a real-time nightlife-intelligence concept: a Three.js city grid with pulsing venue nodes and GSAP scroll choreography.',
    tags: ['Three.js', 'GSAP', 'Vanilla JS'],
    href: 'https://github.com/aditbytes/NiiTE',
  },
];

export interface NowTrack {
  status: string;
  title: string;
  body: string;
  items: string[];
  href?: string;
}

/** What I'm working on right now. Learning tracks describe topics, not shipped results. */
export const nowTracks: NowTrack[] = [
  {
    status: 'Building',
    title: 'INDRA backend',
    body: 'The core platform for a national weather-event verification system, for Smart India Hackathon 2026.',
    items: ['Streaming ingestion with an outbox, DLQ and data lake', 'Geo-clustering with PostGIS, H3 and DBSCAN', 'An explainable verification receipt and audit ledger'],
    href: '/work/indra',
  },
  {
    status: 'Learning',
    title: 'Inference engineering',
    body: 'How models actually run — memory, latency and cost — and how to make them cheaper and faster.',
    items: ['Running local LLMs with Ollama and llama.cpp', 'Quantization (GGUF, 4/8-bit) and its accuracy trade-offs', 'Serving with vLLM: continuous batching and the KV cache', 'Measuring tokens/s, time-to-first-token and memory'],
  },
  {
    status: 'Learning + building',
    title: 'MLOps',
    body: 'Making models reproducible, versioned and shippable — not just trained.',
    items: ['Experiment tracking and a model registry with MLflow', 'Containerised model services with Docker and FastAPI', 'CI for ML code with GitHub Actions and pytest', 'Data and model versioning with DVC; monitoring with Prometheus and Grafana'],
  },
  {
    status: 'Practising',
    title: 'Fine-tuning',
    body: 'Adapting open models to narrow domains without retraining them from scratch.',
    items: ['Llama 3 fine-tuned for financial sentiment (IndiEye)', 'Parameter-efficient fine-tuning: LoRA and QLoRA with PEFT', 'Building instruction datasets and evaluating adapters'],
  },
];
