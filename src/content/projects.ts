/**
 * Selected work. Facts come from the April 2026 resume and, where noted,
 * from the project's public GitHub README. Metrics are only those stated there.
 *
 * Keep this file free of JSX/DOM imports: vite.config.ts imports it to build
 * the sitemap.
 */
export type Accent = 'lime' | 'violet' | 'cyan' | 'warm';

export interface Metric {
  value: string;
  label: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  index: string;
  category: string;
  year: string;
  title: string;
  subtitle: string;
  oneLiner: string;
  tech: string[];
  metrics: Metric[];
  flow: string[];
  accent: Accent;
  flagship?: boolean;
  context?: string;
  links: ProjectLink[];
  /** Shown instead of a source link when the code is not public. */
  sourceNote?: string;
  caseStudy: {
    problem: string;
    approach: { title: string; body: string }[];
    results: string[];
    resultsNote?: string;
    details: { label: string; value: string }[];
  };
}

export const projects: Project[] = [
  {
    slug: 'market-regime-detection',
    index: '01',
    category: 'Quant Research',
    year: '2025',
    title: 'Market Regime Detection Framework',
    subtitle: 'Hybrid HMM + K-Means regimes on NIFTY 50',
    oneLiner:
      'Hidden Markov Models and K-Means label the market’s regime; an XGBoost classifier predicts it; the strategy follows the regime.',
    tech: ['Python', 'HMM', 'K-Means', 'XGBoost', 'MLflow', 'Streamlit'],
    metrics: [
      { value: '3', label: 'Market regimes' },
      { value: '15y', label: 'NIFTY 50 history' },
      { value: '28', label: 'Engineered features' },
      { value: '78%', label: 'Regime prediction accuracy' },
    ],
    flow: ['NIFTY 50', 'Features', 'HMM + K-Means', 'XGBoost', 'Allocation'],
    accent: 'lime',
    links: [],
    sourceNote: 'Source private',
    caseStudy: {
      problem:
        'Markets don’t behave the same way all the time. A strategy that works in a calm, trending tape can be ruinous in a crisis — so the first question isn’t what to trade, it’s what kind of market this is.',
      approach: [
        {
          title: 'Label the regimes',
          body: 'A hybrid of Hidden Markov Models and K-Means clustering separates 15 years of NIFTY 50 history into three regimes: low-volatility, trending and crisis.',
        },
        {
          title: 'Describe the market state',
          body: '28 engineered features describe the market at each point in time — including realized volatility, VIX dynamics and return skewness.',
        },
        {
          title: 'Predict the regime',
          body: 'An XGBoost classifier learns to predict the regime, using sample weighting to handle class imbalance — crisis periods are rare by definition.',
        },
        {
          title: 'Allocate by regime',
          body: 'Each regime maps to a strategy — mean reversion, breakout or risk-off — so allocation changes as the detected regime changes.',
        },
        {
          title: 'Track and inspect',
          body: 'Experiments are tracked in MLflow and explored through a Streamlit dashboard.',
        },
      ],
      results: [
        '78% regime prediction accuracy (XGBoost with sample weighting).',
        '14.2% CAGR for the regime-driven allocation vs 10.8% for buy-and-hold.',
        'Maximum drawdown reduced from 50% to 18%.',
        'Written up as an IEEE-format research paper.',
      ],
      resultsNote: 'Backtest results as reported in the project write-up. Historical, not a forecast.',
      details: [
        { label: 'Data', value: 'NIFTY 50 · 15 years' },
        { label: 'Regimes', value: 'Low-vol · Trending · Crisis' },
        { label: 'Strategies', value: 'Mean reversion · Breakout · Risk-off' },
        { label: 'Year', value: '2025' },
      ],
    },
  },
  {
    slug: 'demandiq',
    index: '02',
    category: 'ML Platform',
    year: '2026',
    title: 'DemandIQ',
    subtitle: 'Retail Demand Forecasting & Replenishment Engine',
    oneLiner:
      'Forecasts next-week sales for every SKU in every store — then turns the forecast into a reorder quantity and a risk alert.',
    tech: ['Prophet', 'XGBoost', 'FastAPI', 'Streamlit', 'MLflow'],
    metrics: [
      { value: '6', label: 'Pipeline layers' },
      { value: '7·14·28', label: 'Day lag features' },
      { value: '95%', label: 'Service level target' },
      { value: '2', label: 'Forecast models' },
    ],
    flow: ['Data', 'Feature Engineering', 'Forecast', 'Inventory Risk', 'Alert'],
    accent: 'cyan',
    context: 'Capstone-I · IIT Patna',
    links: [{ label: 'Source', href: 'https://github.com/aditbytes/Demand_IQ' }],
    caseStudy: {
      problem:
        'A forecast is only useful if it changes what’s on the shelf. DemandIQ goes from raw sales history to a reorder quantity and a risk flag a store manager can act on.',
      approach: [
        {
          title: 'Ingest and clean',
          body: 'Raw sales, calendar and price data from the Walmart M5 dataset flow through ingestion and cleaning stages into a feature store.',
        },
        {
          title: 'Engineer features',
          body: 'Lag features at 7, 14 and 28 days, rolling statistics, price deltas and holiday flags.',
        },
        {
          title: 'Forecast with two models',
          body: 'Prophet captures seasonality; XGBoost captures the more complex patterns. Models are compared per SKU on MAE, with experiments tracked in MLflow.',
        },
        {
          title: 'Decide the reorder',
          body: 'Safety stock = Z × σ × √lead time at a 95% service level. Inventory is classified into LOW / MED / HIGH risk.',
        },
        {
          title: 'Serve and alert',
          body: 'FastAPI REST endpoints, a Streamlit dashboard, and real-time Telegram alerts for HIGH-risk inventory.',
        },
      ],
      results: [
        'XGBoost outperformed Prophet on most SKUs by MAE.',
        'A 6-layer modular pipeline, from ingestion to alerting.',
        'Led model training for the team.',
      ],
      details: [
        { label: 'Context', value: 'Capstone-I · IIT Patna' },
        { label: 'Role', value: 'Led model training' },
        { label: 'Dataset', value: 'Walmart M5' },
        { label: 'Year', value: 'Mar 2026' },
      ],
    },
  },
  {
    slug: 'indieye',
    index: '03',
    category: 'AI System',
    year: '2026 – Present',
    title: 'IndiEye',
    subtitle: 'Market Intelligence Platform',
    oneLiner:
      'Institutional-grade market sentiment for retail investors: news, social chatter and filings, read by a fine-tuned LLM and lined up against price action.',
    tech: ['Next.js', 'FastAPI', 'PostgreSQL', 'Llama 3', 'AWS'],
    metrics: [
      { value: '3', label: 'Source streams' },
      { value: 'Llama 3', label: 'Fine-tuned for sentiment' },
      { value: '2', label: 'Open-source services' },
    ],
    flow: ['News + Social + Filings', 'NLP', 'Sentiment', 'Price Action', 'Insight'],
    accent: 'violet',
    flagship: true,
    context: 'Founder · open research startup',
    links: [
      { label: 'ML service', href: 'https://github.com/aditbytes/Indieye-ml' },
      { label: 'News service', href: 'https://github.com/aditbytes/Indieye-news-sentiment' },
    ],
    caseStudy: {
      problem:
        'Institutional desks read the news, the chatter and the filings before they read the chart. Retail investors mostly don’t get that layer. IndiEye is an attempt to build it — in the open.',
      approach: [
        {
          title: 'Ingest the noise',
          body: 'A real-time pipeline aggregates financial news, social media chatter from X and Reddit, and daily SEC filings.',
        },
        {
          title: 'Read it with a domain model',
          body: 'Llama 3, fine-tuned for domain-specific sentiment extraction, turns unstructured text into sentiment signals.',
        },
        {
          title: 'Line it up with price',
          body: 'Sentiment signals are correlated with price action using time-series models.',
        },
        {
          title: 'Serve the insight',
          body: 'A predictive dashboard in Next.js, backed by FastAPI on AWS with PostgreSQL storage.',
        },
        {
          title: 'Split into services',
          body: 'The ML layer (regime classification, strategy recommendation, key levels, backtesting) and the news & LLM-briefing layer run as independent, open-source microservices.',
        },
      ],
      results: [
        'Founded and open-sourced as an ongoing research startup; actively developed.',
        'ML service exposes regime, strategy, key-level, market-radar and backtest endpoints.',
        'News service aggregates multiple providers and RSS feeds into LLM morning briefs, priority feeds and sector briefs.',
      ],
      details: [
        { label: 'Status', value: 'Ongoing · 2026 – Present' },
        { label: 'Role', value: 'Founder' },
        { label: 'Backend', value: 'FastAPI · PostgreSQL · AWS' },
        { label: 'Model', value: 'Llama 3 (fine-tuned)' },
      ],
    },
  },
  {
    slug: 'datascout',
    index: '04',
    category: 'AI System',
    year: '2026',
    title: 'DataScout',
    subtitle: 'Agentic AI Data Analyst',
    oneLiner:
      'Ask a dataset a question in plain English. An agent writes the Python, runs it in a sandbox and shows its work.',
    tech: ['Amazon Bedrock', 'AWS Lambda', 'S3', 'API Gateway', 'DynamoDB', 'Streamlit'],
    metrics: [
      { value: '4', label: 'Team — led' },
      { value: 'AES-256', label: 'Encryption at rest' },
      { value: '0', label: 'SQL required' },
    ],
    flow: ['User', 'Natural Language', 'AI Agent', 'Python Execution', 'Analysis', 'Insight'],
    accent: 'warm',
    context: 'AI for Bharat hackathon',
    links: [{ label: 'Source', href: 'https://github.com/aditbytes/Data_scout' }],
    caseStudy: {
      problem:
        'Most people with a business question can’t write the pandas to answer it — and a chatbot that predicts numbers is not the same as one that computes them.',
      approach: [
        {
          title: 'Ask in plain English',
          body: 'Upload a dataset and ask a question in natural language through a Streamlit interface — no SQL required.',
        },
        {
          title: 'An agent plans the analysis',
          body: 'An agent on Amazon Bedrock interprets the analytical intent behind the question.',
        },
        {
          title: 'Generate and execute Python',
          body: 'The agent writes Python that runs in a sandboxed environment, so results are computed rather than guessed — and the code is there to audit.',
        },
        {
          title: 'Serverless on AWS',
          body: 'S3 for datasets, Lambda and API Gateway for execution, DynamoDB for state.',
        },
        {
          title: 'Secure by design',
          body: 'IAM role isolation, AES-256 encryption, audit logging and sandboxed execution.',
        },
      ],
      results: [
        'Reached the Prototype Development Phase of the AI for Bharat national AI hackathon.',
        'Led a team of 4 through the build.',
      ],
      details: [
        { label: 'Context', value: 'AI for Bharat · Feb – Mar 2026' },
        { label: 'Role', value: 'AI Engineer (Developer) · team lead' },
        { label: 'Cloud', value: 'AWS serverless' },
        { label: 'Team', value: '4' },
      ],
    },
  },
  {
    slug: 'llm-pruning-explainability',
    index: '05',
    category: 'Research',
    year: '2026',
    title: 'LLM Pruning & Explainability',
    subtitle: 'Do explanations survive compression?',
    oneLiner:
      'Pruning makes models cheaper; explanations make them trustworthy. This study measures what pruning does to the explanations.',
    tech: ['SHAP', 'Integrated Gradients', 'DistilBERT', 'RoBERTa'],
    metrics: [
      { value: '40–80%', label: 'Sparsity range' },
      { value: '3', label: 'Pruning methods' },
      { value: '14,090', label: 'Peak Hessian vs 0.73 baseline' },
    ],
    flow: ['Model', 'Pruning', 'Sparsity', 'Explanation', 'Faithfulness'],
    accent: 'violet',
    links: [],
    caseStudy: {
      problem:
        'Compression makes models cheaper to run. Explanations make them easier to trust. When you prune a model, do its explanations still mean anything?',
      approach: [
        {
          title: 'Compress',
          body: 'Random, L1 unstructured and L1 structured pruning at 40–80% sparsity.',
        },
        {
          title: 'Explain',
          body: 'SHAP and Integrated Gradients attributions computed on the pruned models.',
        },
        {
          title: 'Measure faithfulness',
          body: 'Explanation faithfulness measured with the FCor metric.',
        },
        {
          title: 'Across models and data',
          body: 'DistilBERT and RoBERTa, evaluated on IMDb and Yelp.',
        },
        {
          title: 'Probe the geometry',
          body: 'Decision-landscape curvature, via the Hessian, to explain why some explanations break.',
        },
      ],
      results: [
        'Magnitude pruning preserves explanation faithfulness up to 80% sparsity.',
        'Random pruning creates high-curvature decision landscapes — Hessian values up to 14,090 vs a 0.73 baseline — that break SHAP’s linearity assumptions.',
      ],
      details: [
        { label: 'Models', value: 'DistilBERT · RoBERTa' },
        { label: 'Datasets', value: 'IMDb · Yelp' },
        { label: 'Metric', value: 'FCor faithfulness' },
        { label: 'Year', value: '2026' },
      ],
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
