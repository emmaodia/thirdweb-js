import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type { ChainMetadataWithServices } from "@/types/chain";
import { SectionTitle } from "./SectionTitle";

export function ExplorersSection(props: {
  explorers: NonNullable<ChainMetadataWithServices["explorers"]>;
}) {
  return (
    <section>
      <SectionTitle title="Explorers" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {props.explorers.map((explorer) => {
          return (
            <div
              className="relative rounded-xl border bg-card p-4 transition-colors hover:border-active-border"
              key={explorer.url}
            >
              <ExternalLinkIcon className="absolute top-4 right-4 size-4 text-muted-foreground" />
              <h3 className="mb-1 font-semibold text-base capitalize">
                {explorer.name}
              </h3>
              <Link
                className="flex items-center gap-1.5 text-muted-foreground text-sm before:absolute before:inset-0 before:z-0"
                href={explorer.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {explorer.url.endsWith("/")
                  ? explorer.url.slice(0, -1)
                  : explorer.url}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
