import { defineChain, getChainMetadata } from "thirdweb/chains";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { TableCell, TableRow } from "@/components/ui/table";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";

type RouteListRowProps = {
  originChainId: number;
  originTokenAddress: string;
  originTokenIconUri?: string | null;
  originTokenSymbol?: string;
  originTokenName?: string;
  destinationChainId: number;
  destinationTokenAddress: string;
  destinationTokenIconUri?: string | null;
  destinationTokenSymbol?: string;
  destinationTokenName?: string;
};

export async function RouteListRow({
  originChainId,
  originTokenAddress,
  originTokenIconUri,
  originTokenSymbol,
  destinationChainId,
  destinationTokenAddress,
  destinationTokenIconUri,
  destinationTokenSymbol,
}: RouteListRowProps) {
  const [
    originChain,
    destinationChain,
    resolvedOriginTokenIconUri,
    resolvedDestinationTokenIconUri,
  ] = await Promise.all([
    // eslint-disable-next-line no-restricted-syntax
    getChainMetadata(defineChain(originChainId)),
    // eslint-disable-next-line no-restricted-syntax
    getChainMetadata(defineChain(destinationChainId)),
    originTokenIconUri
      ? resolveSchemeWithErrorHandler({
          client: serverThirdwebClient,
          uri: originTokenIconUri,
        })
      : undefined,
    destinationTokenIconUri
      ? resolveSchemeWithErrorHandler({
          client: serverThirdwebClient,
          uri: destinationTokenIconUri,
        })
      : undefined,
  ]);

  return (
    <TableRow className="group transition-colors hover:bg-accent/50" linkBox>
      <TableCell>
        <div className="flex flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            {resolvedOriginTokenIconUri ? (
              // For now we're using a normal img tag because the domain for these images is unknown
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={originTokenAddress}
                className="size-7 rounded-full border border-border/50 shadow-sm transition-transform group-hover:scale-105"
                src={resolvedOriginTokenIconUri}
              />
            ) : (
              <div className="size-7 rounded-full bg-muted-foreground/20" />
            )}
            {originTokenSymbol && (
              <CopyTextButton
                className="relative z-10 font-medium text-base"
                copyIconPosition="right"
                textToCopy={originTokenAddress}
                textToShow={
                  originTokenSymbol === "ETH"
                    ? originChain.nativeCurrency.symbol
                    : originTokenSymbol
                }
                tooltip="Copy Token Address"
                variant="ghost"
              />
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="text-muted-foreground/90">
        <span className="font-medium">{originChain.name}</span>
      </TableCell>

      <TableCell>
        <div className="flex flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            {resolvedDestinationTokenIconUri ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={destinationTokenAddress}
                className="size-7 rounded-full border border-border/50 shadow-sm transition-transform group-hover:scale-105"
                src={resolvedDestinationTokenIconUri}
              />
            ) : (
              <div className="size-7 rounded-full bg-muted-foreground/20" />
            )}
            {destinationTokenSymbol && (
              <CopyTextButton
                className="relative z-10 font-medium text-base"
                copyIconPosition="right"
                textToCopy={destinationTokenAddress}
                textToShow={
                  destinationTokenSymbol === "ETH"
                    ? destinationChain.nativeCurrency.symbol
                    : destinationTokenSymbol
                }
                tooltip="Copy Token Address"
                variant="ghost"
              />
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="text-muted-foreground/90">
        <span className="font-medium">{destinationChain.name}</span>
      </TableCell>
    </TableRow>
  );
}
