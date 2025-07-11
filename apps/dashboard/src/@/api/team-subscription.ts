import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { ProductSKU } from "@/types/billing";

type InvoiceLine = {
  // amount for this line item
  amount: number;
  // statement descriptor
  description: string | null;
  // the thirdweb product sku or null if it is not recognized
  thirdwebSku: ProductSKU | null;
};

type Invoice = {
  // total amount excluding tax
  amount: number | null;
  // the ISO currency code (e.g. USD)
  currency: string;
  // the line items on the invoice
  lines: InvoiceLine[];
};

export type TeamSubscription = {
  id: string;
  type: "PLAN" | "USAGE" | "PLAN_ADD_ON" | "PRODUCT";
  status:
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "paused";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart: string | null;
  trialEnd: string | null;
  upcomingInvoice: Invoice;
};

export async function getTeamSubscriptions(slug: string) {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  const teamRes = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${slug}/subscriptions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (teamRes.ok) {
    return (await teamRes.json())?.result as TeamSubscription[];
  }
  return null;
}
