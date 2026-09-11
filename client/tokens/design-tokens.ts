import type { CSSProperties } from "react";

import darkPrimitiveTokens from "@/tokens/brandcyan.dark.primitive.tokens.json";
import darkSemanticTokens from "@/tokens/brandcyan.dark.semantic.tokens.json";
import typographyTokens from "@/tokens/brandcyan.typography.styles.tokens.json";

type Dimension = {
  value: number;
  unit: "px";
};

type ColorValue = {
  hex: string;
};

type DtcgToken<T> = {
  $type: string;
  $value: T;
};

type TypographyValue = {
  fontFamily: string;
  fontWeight: string;
  fontSize: Dimension;
  lineHeight: number;
  letterSpacing: Dimension;
};

type PrimitiveTokenGroups = Record<
  string,
  Record<string, DtcgToken<ColorValue>>
>;
type SemanticTokens = Record<string, DtcgToken<string | ColorValue | number>>;
type TypographyTokens = Record<string, DtcgToken<TypographyValue>>;

const primitiveGroups =
  darkPrimitiveTokens as unknown as PrimitiveTokenGroups;
const semanticTokens = darkSemanticTokens as unknown as SemanticTokens;
const textTokens = typographyTokens as unknown as TypographyTokens;

function resolveColorReference(reference: string): string {
  const [groupName, tokenName] = reference.slice(1, -1).split(".");
  const color = primitiveGroups[groupName]?.[tokenName]?.$value.hex;

  if (!color) {
    throw new Error(`Unresolved DTCG color reference: ${reference}`);
  }

  return color;
}

function resolveSemanticColor(tokenName: string): string {
  const value = semanticTokens[tokenName]?.$value;

  if (typeof value === "string") {
    return resolveColorReference(value);
  }

  if (typeof value === "object" && "hex" in value) {
    return value.hex;
  }

  throw new Error(`Expected a color token for: ${tokenName}`);
}

function resolveNumber(tokenName: string): number {
  const value = semanticTokens[tokenName]?.$value;

  if (typeof value !== "number") {
    throw new Error(`Expected a number token for: ${tokenName}`);
  }

  return value;
}

const fontWeights: Record<string, CSSProperties["fontWeight"]> = {
  Regular: 300,
  Medium: 400,
  SemiBold: 500,
  Bold: 600,
};

function resolveTypography(tokenName: string): CSSProperties {
  const value = textTokens[tokenName]?.$value;

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
  subtitle: resolveTypography("brandcyan-title-medium"),
  bodyLarge: resolveTypography("brandcyan-body-large"),
  bodySmall: resolveTypography("brandcyan-body-small"),
  button: resolveTypography("brandcyan-title-medium"),
  navigation: resolveTypography("brandcyan-label-small"),
  status: resolveTypography("brandcyan-title-small"),
} as const;

export const radii = {
  medium: resolveNumber("radius-m"),
  full: resolveNumber("radius-full"),
} as const;

export const darkThemeStyle = {
  "--color-background": resolveSemanticColor("background"),
  "--color-foreground": resolveSemanticColor("device-elements"),
  "--color-card": resolveSemanticColor("container-background"),
  "--color-card-foreground": resolveSemanticColor("container-text"),
  "--color-popover": resolveSemanticColor("container-background"),
  "--color-popover-foreground": resolveSemanticColor("container-text"),
  "--color-primary": resolveSemanticColor("primary-button"),
  "--color-primary-foreground": resolveSemanticColor("primary-button-text"),
  "--color-primary-foreground-pressed": resolveSemanticColor(
    "primary-button-text-pressed",
  ),
  "--color-secondary": resolveSemanticColor("secondary-button"),
  "--color-secondary-foreground": resolveSemanticColor(
    "secondary-button-text",
  ),
  "--color-muted": resolveSemanticColor("secondary-button"),
  "--color-muted-foreground": resolveSemanticColor("text"),
  "--color-accent": resolveSemanticColor("subtitle"),
  "--color-accent-foreground": resolveSemanticColor("background"),
  "--color-brand-name": resolveSemanticColor("brand-name-color"),
  "--color-secondary-button-stroke": resolveSemanticColor(
    "secondary-button-stroke",
  ),
  "--color-destructive": resolveSemanticColor("error message"),
  "--color-destructive-foreground": resolveSemanticColor("device-elements"),
  "--color-border": resolveSemanticColor("container-stroke"),
  "--color-input": resolveSemanticColor("container-stroke"),
  "--color-ring": resolveSemanticColor("primary-button"),
  "--color-bottom-bar": resolveSemanticColor("bottom-bar"),
  "--color-bottom-bar-selected": resolveSemanticColor("bottom-bar-selected"),
  "--radius-medium": `${radii.medium}px`,
  "--radius-full": `${radii.full}px`,
} as CSSProperties & Record<`--${string}`, string>;
