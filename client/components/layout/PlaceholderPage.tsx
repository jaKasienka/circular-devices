import { typography } from "@/tokens/design-tokens";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center tablet:px-10">
      <h1 className="text-foreground" style={typography.headlineSmall}>
        {title}
      </h1>
      <p
        className="max-w-sm text-muted-foreground"
        style={typography.bodyMedium}
      >
        {description ??
          "This page hasn't been built yet. Keep prompting to fill in this section of the app."}
      </p>
    </div>
  );
}
