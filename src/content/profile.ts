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
  { id: '06', label: 'Tooling', items: ['Git', 'yfinance', 'Uvicorn'] },
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
    examples: ['Financial market data — NIFTY 50, VIX', 'Retail demand — Walmart M5 sales, prices, calendar', 'News, social chatter and filings', 'User-uploaded datasets'],
    projects: ['Regime Detection', 'DemandIQ', 'IndiEye', 'DataScout'],
  },
  {
    id: 'signal',
    label: 'Signal',
    caption: 'Turn raw data into something a model can use.',
    examples: ['Features — realized vol, skew, 7/14/28-day lags', 'Sentiment extracted from text', 'Market regimes as a latent state'],
    projects: ['Regime Detection', 'DemandIQ', 'IndiEye'],
  },
  {
    id: 'model',
    label: 'Model',
    caption: 'Pick the simplest model that captures the structure.',
    examples: ['XGBoost', 'Hidden Markov Models + K-Means', 'Prophet', 'Llama 3 (fine-tuned)', 'Agents on Amazon Bedrock'],
    projects: ['Regime Detection', 'DemandIQ', 'IndiEye', 'DataScout'],
  },
  {
    id: 'evaluation',
    label: 'Evaluation',
    caption: 'Measure it the way it will be used.',
    examples: ['MAE per SKU', 'Regime accuracy with class weighting', 'Sharpe, turnover, drawdown, out-of-sample', 'Explanation faithfulness (FCor)'],
    projects: ['DemandIQ', 'Regime Detection', 'Alpha Research', 'LLM Pruning'],
  },
  {
    id: 'deployment',
    label: 'Deployment',
    caption: 'Ship it behind an interface people can use.',
    examples: ['FastAPI services', 'AWS — Lambda, API Gateway, S3, DynamoDB', 'Streamlit and Next.js dashboards', 'MLflow experiment tracking'],
    projects: ['DemandIQ', 'IndiEye', 'DataScout'],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    caption: 'Close the loop.',
    examples: ['Telegram alerts for high-risk inventory', 'Audit logs of generated code', 'Dashboards that surface drift and risk', 'Back to data — retrain'],
    projects: ['DemandIQ', 'DataScout', 'IndiEye'],
  },
];

export const signalKeywords = [
  { word: 'AI / ML', note: 'Agents, fine-tuned LLMs, gradient boosting, explainability.', tag: 'DataScout · IndiEye' },
  { word: 'Quantitative Research', note: 'Regimes, alphas, backtests that respect time.', tag: 'Regimes · WorldQuant BRAIN' },
  { word: 'Data Systems', note: 'Pipelines from raw CSVs to features to decisions.', tag: 'DemandIQ' },
  { word: 'Cloud Infrastructure', note: 'Serverless AWS — Lambda, S3, API Gateway, DynamoDB.', tag: 'DataScout' },
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
  { name: 'Indieye-news-sentiment', description: 'IndiEye news aggregation and LLM-powered sentiment & briefing service.', language: 'TypeScript' },
  { name: 'CNN_candleStick', description: 'OHLC → candlestick images → 2D CNN pattern classifier, with live inference over WebSocket.', language: 'Python' },
];
