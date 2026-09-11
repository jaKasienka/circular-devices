interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-3xl text-foreground">{title}</h1>
      <p className="max-w-sm font-sans text-sm text-muted-foreground">
        {description ??
          "This page hasn't been built yet. Keep prompting to fill in this section of the app."}
      </p>
    </div>
  );
}
