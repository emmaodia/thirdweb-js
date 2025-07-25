"use client";

import { Card } from "chakra/card";
import { Heading } from "chakra/heading";
import { Text } from "chakra/text";
import { ChartAreaIcon, InfoIcon } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import {
  type EngineInstance,
  useEngineQueueMetrics,
  useEngineSystemMetrics,
} from "@/hooks/useEngine";
import { ErrorRate } from "./ErrorRate";
import { Healthcheck } from "./Healthcheck";
import { StatusCodes } from "./StatusCodes";

interface EngineStatusProps {
  instance: EngineInstance;
  teamSlug: string;
  projectSlug: string;
  authToken: string;
}

export const EngineSystemMetrics: React.FC<EngineStatusProps> = ({
  instance,
  teamSlug,
  projectSlug,
  authToken,
}) => {
  const systemMetricsQuery = useEngineSystemMetrics(
    instance.id,
    teamSlug,
    projectSlug,
  );
  const queueMetricsQuery = useEngineQueueMetrics({
    authToken,
    instanceUrl: instance.url,
    pollInterval: 10_000,
  });

  let systemMetricsPanel = <Spinner className="h-4 w-4" />;
  if (!systemMetricsQuery.data || systemMetricsQuery.isError) {
    systemMetricsPanel = (
      <Card p={8}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-2">
            <InfoIcon className="size-4" />
            <Heading size="title.xs">
              System metrics are unavailable for self-hosted Engine.
            </Heading>
          </div>
          <Text>
            Upgrade to a{" "}
            <UnderlineLink
              color="blue.500"
              href={`/team/${teamSlug}/${projectSlug}/engine/dedicated/create`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Engine instance managed by thirdweb
            </UnderlineLink>{" "}
            to view these metrics.
          </Text>
        </div>
      </Card>
    );
  } else {
    systemMetricsPanel = (
      <Card p={16}>
        <div className="flex flex-col gap-4">
          <div className="-mb-2 flex flex-row items-center gap-2">
            <ChartAreaIcon className="size-4" />
            <Heading size="title.md">System Metrics</Heading>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Healthcheck instance={instance} />
          </div>
          <StatusCodes
            datapoints={systemMetricsQuery.data.result.statusCodes}
          />
          <ErrorRate datapoints={systemMetricsQuery.data.result.errorRate} />
        </div>
      </Card>
    );
  }

  let queueMetricsPanel = (
    <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-border">
      <Spinner className="size-6" />
    </div>
  );

  if (
    !queueMetricsQuery.isPending &&
    (!queueMetricsQuery.data || queueMetricsQuery.isError)
  ) {
    queueMetricsPanel = (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-border">
        No Data Available
      </div>
    );
  } else if (queueMetricsQuery.data) {
    const numQueued = queueMetricsQuery.data.result.queued;
    const numPending = queueMetricsQuery.data.result.pending;
    const msToSend = queueMetricsQuery.data.result.latency?.msToSend;
    const msToMine = queueMetricsQuery.data.result.latency?.msToMine;

    queueMetricsPanel = (
      <Card p={8}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-row items-center gap-2">
            <Heading size="title.md">Queue Metrics</Heading>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            <div className="flex-col gap-y-4">
              <h2 className="font-semibold"> Queued</h2>
              <p className="text-muted-foreground">{numQueued}</p>
            </div>
            <div className="flex-col gap-y-4">
              <h2 className="font-semibold">Pending</h2>
              <p className="text-muted-foreground">{numPending}</p>
            </div>

            {msToSend && (
              <div className="flex-col gap-y-4">
                <h2 className="font-semibold">Time to send</h2>
                <p className="text-muted-foreground">
                  p50 {(msToSend.p50 / 1000).toFixed(2)}s, p90{" "}
                  {(msToSend.p90 / 1000).toFixed(2)}s
                </p>
              </div>
            )}
            {msToMine && (
              <div className="flex-col gap-y-4">
                <h2 className="font-semibold">Time to mine</h2>
                <p className="text-muted-foreground">
                  p50 {(msToMine.p50 / 1000).toFixed(2)}s, p90{" "}
                  {(msToMine.p90 / 1000).toFixed(2)}s
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {systemMetricsPanel}
      {queueMetricsPanel}
    </div>
  );
};
