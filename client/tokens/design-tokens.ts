import type { CSSProperties } from "react";

import {
  generatedThemes,
  generatedTypographyTokens,
} from "./generated-design-tokens";

type Dimension = {
  value: number;
  unit: "px";
};

type TypographyValue = {
  fontFamily: string;
  fontWeight: string;
  fontSize: Dimension;
  lineHeight: number;
  letterSpacing: Dimension;
};

type TypographyTokens = Record<string, TypographyValue>;

const textTokens =
  generatedTypographyTokens as unknown as TypographyTokens;

const fontWeights: Record<string, CSSProperties["fontWeight"]> = {
  Regular: 300,
  Medium: 400,
  SemiBold: 500,
  Bold: 600,
};

function resolveTypography(tokenName: string): CSSProperties {
  const value = textTokens[tokenName];

  if (!value) {
    throw new Error(`Unresolved DTCG typography token: ${tokenName}`);
  }

  return {
    fontFamily: value.fontFamily,
    fontWeight: fontWeights[value.fontWeight] ?? value.fontWeight,
    fontSize: `${value.fontSize.value}${value.fontSize.unit}`,
    lineHeight: `${value.lineHeight}px`,
    letterSpacing: `${value.letterSpacing.value}${value.letterSpacing.unit}`,
  };
}

export const typography = {
  brandName: resolveTypography("brandcyan-brand-name-text"),
  displaySmall: resolveTypography("brandcyan-display-small"),
  headlineSmall: resolveTypography("brandcyan-headline-small"),
  subtitle: resolveTypography("brandcyan-title-medium"),
  bodyLarge: resolveTypography("brandcyan-body-large"),
  bodyMedium: resolveTypography("brandcyan-body-medium"),
  bodySmall: resolveTypography("brandcyan-body-small"),
  button: resolveTypography("brandcyan-title-medium"),
  navigation: resolveTypography("brandcyan-label-small"),
  status: resolveTypography("brandcyan-title-small"),
} as const;

type GeneratedTheme = Record<string, string | number>;
type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

function getColor(tokens: GeneratedTheme, tokenName: string): string {
  const value = tokens[tokenName];

  if (typeof value !== "string") {
    throw new Error(`Expected a generated color token for: ${tokenName}`);
  }

  return value;
}

function getNumber(tokens: GeneratedTheme, tokenName: string): number {
  const value = tokens[tokenName];

  if (typeof value !== "number") {
    throw new Error(`Expected a generated number token for: ${tokenName}`);
  }

  return value;
}

const darkTokens = generatedThemes.dark as GeneratedTheme;
const lightTokens = generatedThemes.light as GeneratedTheme;

export const radii = {
  medium: getNumber(darkTokens, "radius-m"),
  full: getNumber(darkTokens, "radius-full"),
} as const;

function createThemeStyle(tokens: GeneratedTheme): ThemeStyle {
  return {
    "--color-background": getColor(tokens, "background"),
    "--color-foreground": getColor(tokens, "device-elements"),
    "--color-card": getColor(tokens, "container-background"),
    "--color-card-foreground": getColor(tokens, "container-text"),
    "--color-card-icon": getColor(tokens, "container-icon"),
    "--color-popover": getColor(tokens, "container-background"),
    "--color-popover-foreground": getColor(tokens, "container-text"),
    "--color-primary": getColor(tokens, "primary-button"),
    "--color-primary-foreground": getColor(tokens, "primary-button-text"),
    "--color-primary-foreground-pressed": getColor(
      tokens,
      "primary-button-text-pressed",
    ),
    "--color-secondary": getColor(tokens, "secondary-button"),
    "--color-secondary-foreground": getColor(
      tokens,
      "secondary-button-text",
    ),
    "--color-muted": getColor(tokens, "secondary-button"),
    "--color-muted-foreground": getColor(tokens, "text"),
    "--color-accent": getColor(tokens, "subtitle"),
    "--color-accent-foreground": getColor(tokens, "background"),
    "--color-brand-name": getColor(tokens, "brand-name-color"),
    "--color-secondary-button-stroke": getColor(
      tokens,
      "secondary-button-stroke",
    ),
    "--color-destructive": getColor(tokens, "error message"),
    "--color-destructive-foreground": getColor(tokens, "device-elements"),
    "--color-border": getColor(tokens, "container-stroke"),
    "--color-input": getColor(tokens, "container-stroke"),
    "--color-ring": getColor(tokens, "primary-button"),
    "--color-bottom-bar": getColor(tokens, "bottom-bar"),
    "--color-bottom-bar-selected": getColor(tokens, "bottom-bar-selected"),
    "--radius-medium": `${radii.medium}px`,
    "--radius-full": `${radii.full}px`,
  } as ThemeStyle;
}

export const darkThemeStyle = createThemeStyle(darkTokens);
export const lightThemeStyle = createThemeStyle(lightTokens);
