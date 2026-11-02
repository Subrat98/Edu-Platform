import { useEffect, useState } from "react";

const CHART_VARS = ["--color-chart-1", "--color-chart-2", "--color-chart-3", "--color-chart-4", "--color-chart-5"];

function readChartColors(): string[] {
  const styles = getComputedStyle(document.documentElement);
  return CHART_VARS.map((v) => styles.getPropertyValue(v).trim() || "#64748b");
}

/**
 * Recharts' <Pie>/<Sector> does not reliably resolve CSS custom
 * properties passed directly as a `fill` value (unlike <Bar>, which
 * renders a plain <rect> and resolves var() fine) — the computed fill
 * comes back empty and the slice is invisible. Resolving the brand chart
 * tokens to real hex strings here sidesteps that, and re-resolves
 * whenever the institution (and therefore the brand palette) changes.
 */
export function useChartColors(institutionId: string): string[] {
  const [colors, setColors] = useState<string[]>(() => ["#1f3a5f", "#0e8f8f", "#e0a100", "#6366f1", "#64748b"]);

  useEffect(() => {
    setColors(readChartColors());
  }, [institutionId]);

  return colors;
}
