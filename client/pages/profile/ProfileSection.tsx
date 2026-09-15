import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getProfileMenuItem } from "@/lib/profile/menu-items";
import { typography } from "@/tokens/design-tokens";

export default function ProfileSection() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const item = sectionId ? getProfileMenuItem(sectionId) : undefined;

  if (!item) {
    return (
      <section className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-foreground" style={typography.headlineSmall}>
          Profile section not found
        </h1>
        <Button asChild variant="secondary">
          <Link to="/profile">Back to Profile</Link>
        </Button>
      </section>
    );
  }

  const Icon = item.icon;

  return (
    <section className="flex min-h-full w-full min-w-0 flex-col gap-6 px-4 py-4 tablet:px-8">
      <header className="flex flex-col gap-3">
        <Button asChild variant="ghost" className="w-fit px-0">
          <Link to="/profile">← Profile</Link>
        </Button>
        <div className="flex items-center gap-3">
          <Icon aria-hidden className="size-8 shrink-0 text-primary" strokeWidth={2} />
          <h1 className="text-foreground" style={typography.headlineSmall}>
            {item.label}
          </h1>
        </div>
      </header>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-card-foreground" style={typography.bodyMedium}>
          {item.description ??
            "This profile section will be built out in a later pass."}
        </p>
      </div>

      <p className="text-muted-foreground" style={typography.bodySmall}>
        Dummy profile data only — forms and persistence are not wired yet.
      </p>
    </section>
  );
}
