/** Decoupled open/close signal for the lazily-loaded command palette. */
export const PALETTE_EVENT = 'palette:open';
export const openPalette = () => window.dispatchEvent(new Event(PALETTE_EVENT));
