import type { ComponentType } from 'react';
import { AgentVisual } from './AgentVisual';
import { DataScoutVisual } from './DataScoutVisual';
import { DemandVisual } from './DemandVisual';
import { IndiEyeVisual } from './IndiEyeVisual';
import { IndraVisual } from './IndraVisual';
import { PruningVisual } from './PruningVisual';
import { RegimeVisual } from './RegimeVisual';
import { SanjivaniVisual } from './SanjivaniVisual';

export const projectVisuals: Record<string, ComponentType> = {
  indra: IndraVisual,
  'market-regime-detection': RegimeVisual,
  demandiq: DemandVisual,
  indieye: IndiEyeVisual,
  datascout: DataScoutVisual,
  'sanjivani-ai': SanjivaniVisual,
  'agentic-core': AgentVisual,
  'llm-pruning-explainability': PruningVisual,
};
