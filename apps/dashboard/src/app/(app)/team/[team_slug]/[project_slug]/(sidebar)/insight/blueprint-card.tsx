import {
  Code2Icon,
  DatabaseIcon,
  ExternalLinkIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BlueprintCard() {
  const features = [
    {
      description: "RESTful endpoints for any application",
      icon: Code2Icon,
      title: "Easy-to-Use API",
    },
    {
      description:
        "No need to index blockchains yourself or manage infrastructure and RPC costs.",
      icon: DatabaseIcon,
      title: "Managed Infrastructure",
    },
    {
      description: "Access any transaction, event or token API data",
      icon: ZapIcon,
      title: "Lightning-Fast Queries",
    },
  ];

  return (
    <div className="rounded-lg border bg-card">
      {/* header */}
      <div className="border-b p-4 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl tracking-tight">Blueprints</h2>

          <div className="flex items-center gap-2">
            <Button asChild className="gap-2 bg-background" variant="outline">
              <Link
                href="https://portal.thirdweb.com/insight/blueprints"
                rel="noopener noreferrer"
                target="_blank"
              >
                Docs <ExternalLinkIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        <p className="mb-2 font-semibold text-xl leading-tight tracking-tight lg:mb-1">
          Simple endpoints for querying rich blockchain data
        </p>
        <p className="text-muted-foreground text-sm">
          A blueprint is an API that provides access to on-chain data in a
          user-friendly format. <br /> No need for ABIs, decoding, RPC, or web3
          knowledge required to fetch blockchain data.
        </p>

        <div className="h-6" />

        {/* Features */}
        <div className="flex flex-col gap-6">
          {features.map((feature) => (
            <div className="flex items-start gap-3" key={feature.title}>
              <div className="rounded-full border p-2">
                <feature.icon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium">{feature.title}</h4>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Playground link */}
      <div className="border-t p-4 lg:p-6">
        <Button asChild className="w-full gap-2">
          <Link
            href="https://playground.thirdweb.com/insight"
            rel="noopener noreferrer"
            target="_blank"
          >
            Try Insight blueprints in the playground
            <ExternalLinkIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
