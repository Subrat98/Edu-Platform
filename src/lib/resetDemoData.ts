import { clearAllDemoStorage } from "./storage";

export function resetDemoData(): void {
  clearAllDemoStorage();
  window.location.href = "/";
}
