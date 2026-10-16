'use client';

const DEFAULT_POINTS = 1240;
const STORAGE_KEY = 'greenmind_student_points';

export function getStudentPoints(): number {
  if (typeof window === 'undefined') return DEFAULT_POINTS;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (!val) {
      localStorage.setItem(STORAGE_KEY, String(DEFAULT_POINTS));
      return DEFAULT_POINTS;
    }
    const num = parseInt(val, 10);
    return isNaN(num) ? DEFAULT_POINTS : num;
  } catch {
    return DEFAULT_POINTS;
  }
}

export function addStudentPoints(pointsToAdd: number): number {
  if (typeof window === 'undefined') return DEFAULT_POINTS;
  try {
    const current = getStudentPoints();
    const newTotal = current + pointsToAdd;
    localStorage.setItem(STORAGE_KEY, String(newTotal));
    window.dispatchEvent(new CustomEvent('eco_points_updated', { detail: { points: newTotal, added: pointsToAdd } }));
    return newTotal;
  } catch {
    return DEFAULT_POINTS;
  }
}

export function setStudentPoints(points: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, String(points));
    window.dispatchEvent(new CustomEvent('eco_points_updated', { detail: { points } }));
  } catch {
    // Handled silently
  }
}
