import { redirect } from "next/navigation";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { AddCampaignModal } from "@/components/dashboard/add-campaign-modal";
import { Campaigns } from "@/components/dashboard/campaigns";
import { EmptyCampaignCard } from "@/components/dashboard/empty-campaign-card";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { SubscriptionModal } from "@/components/dashboard/subscription-modal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllCampaigns } from "@/app/actions/campaign";

export const metadata = {
  title: "BuzzDaddy Overview",
  description: "Manage account and website settings.",
};

export default async function OverviewPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const result = await getAllCampaigns(user.id);

  if (result.type === "error" || !result.data) {
    console.error(result.message);
    return null;
  }

  // console.log("userId", user.id);

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  // console.log("subscriptionPlan", subscriptionPlan.stripeCustomerId);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Overview"
        text="Manage your campaigns to advertise."
      >
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/media-studio"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Open Media Studio
          </Link>
          {subscriptionPlan.stripeSubscriptionId ? (
            <AddCampaignModal />
          ) : (
            <SubscriptionModal user={user} subscriptionPlan={subscriptionPlan} />
          )}
        </div>
      </DashboardHeader>

      {/* Moved activity log to it's own tab under Overview */}
      {/* <div className="border-y p-4">
        <ActivityLog />
      </div> */}

      {result.data.length === 0 ? (
        <EmptyCampaignCard>
          {subscriptionPlan.stripeSubscriptionId ? (
            <AddCampaignModal />
          ) : (
            <SubscriptionModal
              user={user}
              subscriptionPlan={subscriptionPlan}
            />
          )}
        </EmptyCampaignCard>
      ) : (
        <Campaigns campaigns={result.data} />
      )}
    </DashboardShell>
  );
}
