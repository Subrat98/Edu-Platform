export interface ColorTokens {
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  highlight: string;
  highlightForeground: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface TypographyTokens {
  headingFont: string;
  bodyFont: string;
}

export interface ThemeTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  radius: string;
  logoUrl: string;
}

export type ThemeMode = "light" | "dark";
