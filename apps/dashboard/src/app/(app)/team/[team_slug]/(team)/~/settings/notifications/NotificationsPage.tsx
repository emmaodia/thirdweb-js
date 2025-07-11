import { Notifications } from "@app/team/[team_slug]/(team)/~/settings/notifications/Notifications";
import { Separator } from "@/components/ui/separator";
import type { Account } from "@/hooks/useApi";

export const SettingsNotificationsPage = (props: { account: Account }) => {
  return (
    <div>
      <h1 className="mb-0.5 font-semibold text-2xl tracking-tight">
        Notification Settings
      </h1>

      <p className="mb-7 text-muted-foreground">
        Configure your email notification preferences
      </p>

      <Separator />
      <Notifications account={props.account} />
    </div>
  );
};
