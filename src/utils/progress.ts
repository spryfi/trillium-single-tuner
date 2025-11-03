export type ProgressRecord = {
  ewma: Record<string, number>;
  streak: number;
  lastSeen: Record<string, number>;
};

const KEY = "labs_progress_v1";

export function loadProgress(): ProgressRecord | null {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
export function saveProgress(p: ProgressRecord) {
  localStorage.setItem(KEY, JSON.stringify(p));
}
export function updateEwma(prev:number, x:number, alpha=0.3) {
  return +(alpha*x + (1-alpha)*prev).toFixed(4);
}
