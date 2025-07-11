import { DeployUpsellCard } from "@app/(dashboard)/explore/components/upsells/deploy-your-own";
import { getCategory } from "@app/(dashboard)/explore/data";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ContractCard,
  ContractCardSkeleton,
} from "@/components/contracts/contract-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type ExploreCategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata(
  props: ExploreCategoryPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const category = getCategory(params.category);
  if (!category) {
    notFound();
  }
  return {
    description: `${category.description} Deploy with one click to Ethereum, Polygon, Optimism, and other EVM blockchains with thirdweb.`,
    title: `${category.name} Smart Contracts | Explore`,
  };
}

export default async function ExploreCategoryPage(
  props: ExploreCategoryPageProps,
) {
  const params = await props.params;
  const category = getCategory(params.category);
  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <Breadcrumb className="border-border border-b px-6 py-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/explore">Explore</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {category.displayName || category.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container flex flex-col gap-4 py-8">
        <h1 className="mb-3 font-bold text-3xl tracking-tighter lg:text-5xl">
          {category.displayName || category.name}
        </h1>
        <p className="max-w-screen-md text-base text-muted-foreground lg:text-lg">
          {category.description}{" "}
          {category.learnMore && (
            <Link href={category.learnMore}>Learn more</Link>
          )}
        </p>
        <div className="h-10" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {category.contracts.map((publishedContractId) => {
            const publisher: string | undefined = Array.isArray(
              publishedContractId,
            )
              ? publishedContractId[0].split("/")[0]
              : publishedContractId.split("/")[0];
            const contractId: string | undefined = Array.isArray(
              publishedContractId,
            )
              ? publishedContractId[0].split("/")[1]
              : publishedContractId.split("/")[1];
            const modules = Array.isArray(publishedContractId)
              ? publishedContractId[1]
              : undefined;
            const overrides = Array.isArray(publishedContractId)
              ? publishedContractId[2]
              : undefined;

            if (!publisher || !contractId) {
              return null;
            }

            return (
              <Suspense
                fallback={<ContractCardSkeleton />}
                key={publisher + contractId + overrides?.title}
              >
                <ContractCard
                  contractId={contractId}
                  descriptionOverride={overrides?.description}
                  isBeta={category.isBeta}
                  modules={
                    modules?.length
                      ? modules.map((m) => ({
                          moduleId: m.split("/")[1] || "",
                          publisher: m.split("/")[0] || "",
                        }))
                      : undefined
                  }
                  publisher={publisher}
                  titleOverride={overrides?.title}
                />
              </Suspense>
            );
          })}
        </div>

        <div className="h-16" />
        <DeployUpsellCard />
      </div>
    </div>
  );
}
