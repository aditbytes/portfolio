import type { ComponentType } from 'react';
import { DataScoutVisual } from './DataScoutVisual';
import { DemandVisual } from './DemandVisual';
import { IndiEyeVisual } from './IndiEyeVisual';
import { PruningVisual } from './PruningVisual';
import { RegimeVisual } from './RegimeVisual';

export const projectVisuals: Record<string, ComponentType> = {
  'market-regime-detection': RegimeVisual,
  demandiq: DemandVisual,
  indieye: IndiEyeVisual,
  datascout: DataScoutVisual,
  'llm-pruning-explainability': PruningVisual,
};
