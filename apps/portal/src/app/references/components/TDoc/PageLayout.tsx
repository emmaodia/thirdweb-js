import GithubSlugger from "github-slugger";
import { FileTextIcon, FolderOpenIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import invariant from "tiny-invariant";
import type { TransformedDoc } from "typedoc-better-json";
import {
  ArticleIconCard,
  createMetadata,
  Details,
  Heading,
} from "@/components/Document";
import { Breadcrumb } from "@/components/Document/Breadcrumb";
import { DocLayout } from "@/components/Layouts/DocLayout";
import type { LinkGroup, LinkMeta } from "@/components/others/Sidebar";
import { sluggerContext } from "@/contexts/slugger";
import type { MetadataImageIcon } from "../../../../components/Document/metadata";
import { RootTDoc } from "./Root";
import { getSidebarLinkGroups } from "./utils/getSidebarLinkgroups";
import { fetchAllSlugs, getSlugToDocMap } from "./utils/slugs";
import { nameToSubgroupSlug, subgroups } from "./utils/subgroups";

type PageProps = {
  params: Promise<{ version: string; slug?: string[] }>;
};

type LayoutProps = {
  params: Promise<{ version: string }>;
  children: React.ReactNode;
};

// make sure getTDocPage() is used in .../[version]/[...slug]/page.tsx file
export function getTDocPage(options: {
  getDoc: (version: string) => Promise<TransformedDoc>;
  sdkTitle: string;
  packageSlug: string;
  getVersions: () => Promise<string[]>;
  metadataIcon: MetadataImageIcon;
}) {
  const { getDoc, sdkTitle, packageSlug, getVersions, metadataIcon } = options;

  async function Page(props: PageProps) {
    const params = await props.params;
    const version = params.version ?? "v5";
    const doc = await getDoc(version);
    const slugToDoc = getSlugToDocMap(doc);
    const docSlug = params.slug?.join("/");

    if (!version) {
      notFound();
    }

    // API page
    if (docSlug) {
      // category pages
      if (docSlug in subgroups) {
        return (
          <CategoryPage
            doc={doc}
            packageSlug={packageSlug}
            slug={docSlug as keyof typeof subgroups}
            version={version}
          />
        );
      }

      const selectedDoc =
        docSlug && (slugToDoc[docSlug] || slugToDoc[`common/${docSlug}`]);

      if (!selectedDoc) {
        notFound();
      }

      return (
        <div>
          <Breadcrumb
            crumbs={[
              {
                href: `/references/${packageSlug}/${version}`,
                name: "References",
              },
              {
                href: `/references/${packageSlug}/${version}/${selectedDoc.name}`,
                name: selectedDoc.name,
              },
            ]}
          />
          <RootTDoc doc={selectedDoc} />
        </div>
      );
    }

    // index page
    return (
      <div>
        <IndexContent
          doc={doc}
          packageSlug={packageSlug}
          sdkTitle={sdkTitle}
          version={version}
        />
      </div>
    );
  }

  // statically generate pages for latest version
  async function generateStaticParams(): Promise<
    Awaited<PageProps["params"]>[]
  > {
    const versions = await getVersions();

    const returnVal = await Promise.all(
      versions
        // only generate static pages for v5
        .filter((v) => v === "v5")
        .map(async (version) => {
          const paths = await getDoc(version)
            .then((doc) => fetchAllSlugs(doc))
            .then((slugs) => {
              return Array.from(new Set(slugs)).map((slug) => {
                return {
                  slug: slug.split("/") as string[],
                  version: version,
                };
              });
            });
          return paths;
        }),
    );

    return returnVal.flat();
  }

  async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    let docName = params.slug ? params.slug[0] : undefined;

    if (!docName) {
      return {
        title: `${sdkTitle} | thirdweb docs`,
      };
    }
    const extensionName = params.slug ? params.slug[1] : undefined;
    if (extensionName) {
      docName = `${extensionName} - ${docName}`;
    }

    return createMetadata({
      description: `${docName} API Reference - ${sdkTitle}`,
      image: {
        icon: metadataIcon,
        title: docName,
      },
      title: `${docName} - ${sdkTitle}`,
    });
  }

  return {
    default: Page,
    // force-static on dev and previews to lower the build time and vercel cost
    dynamic: (process.env.VERCEL_ENV !== "preview" &&
    process.env.VERCEL_ENV !== "development"
      ? "force-static"
      : "auto") as "force-static" | "auto",
    generateMetadata,
    generateStaticParams,
  };
}

// make sure getTDocLayout() is used in .../[version]/layout.tsx file
export function getTDocLayout(options: {
  getDoc: (version: string) => Promise<TransformedDoc>;
  packageSlug: string;
  sdkTitle: string;
}) {
  const { getDoc, packageSlug, sdkTitle } = options;

  return async function Layout(props: LayoutProps) {
    const params = await props.params;
    const { version } = params;
    const doc = await getDoc(version);

    return (
      <DocLayout
        sideBar={{
          links: getSidebarLinkGroups(
            doc,
            `/references/${packageSlug}/${version}`,
          ),
          name: sdkTitle,
        }}
      >
        {props.children}
      </DocLayout>
    );
  };
}

async function IndexContent(props: {
  doc: TransformedDoc;
  packageSlug: string;
  sdkTitle: string;
  version: string;
}) {
  const linkGroups = getSidebarLinkGroups(
    props.doc,
    `/references/${props.packageSlug}/${props.version}`,
  );

  const slugger = new GithubSlugger();
  sluggerContext.set(slugger);

  return (
    <div>
      <Heading anchorId="reference" level={1}>
        {props.sdkTitle} Reference
      </Heading>

      <div className="flex flex-col gap-3">
        {linkGroups.map((linkGroup) => {
          const slug = nameToSubgroupSlug[linkGroup.name];
          return (
            <ArticleIconCard
              href={`/references/${props.packageSlug}/${props.version}/${slug}`}
              icon={FolderOpenIcon}
              key={linkGroup.name}
              title={linkGroup.name}
            />
          );
        })}
      </div>
    </div>
  );
}

function CategoryPage(props: {
  slug: keyof typeof subgroups;
  doc: TransformedDoc;
  packageSlug: string;
  version: string;
}) {
  const slugger = new GithubSlugger();
  sluggerContext.set(slugger);

  const sidebarLinkGroups = getSidebarLinkGroups(
    props.doc,
    `/references/${props.packageSlug}/${props.version}`,
  );

  const linkGroup = sidebarLinkGroups.find(
    (group) => group.name === subgroups[props.slug],
  );

  if (!linkGroup) {
    throw new Error("linkGroup not found");
  }

  return (
    <div>
      <Heading anchorId={props.slug} level={1}>
        {subgroups[props.slug]}
      </Heading>
      <RenderLinkGroup level={0} linkGroup={linkGroup} />
    </div>
  );
}

function RenderLinkGroup(props: { linkGroup: LinkGroup; level: number }) {
  const ungroupedLinks = props.linkGroup.links.filter(
    (link) => !("links" in link) && "href" in link,
  ) as LinkMeta[];

  const slugger = sluggerContext.get();
  invariant(slugger, "slugger is not defined");

  const allChildrenAreLinks =
    ungroupedLinks.length === props.linkGroup.links.length;

  // display links
  if (allChildrenAreLinks) {
    return (
      <div className="flex flex-col gap-3">
        {props.linkGroup.links.map((_link) => {
          const link = _link as LinkMeta;
          return (
            <ArticleIconCard
              className="p-3"
              href={link.href}
              icon={FileTextIcon}
              key={link.href}
              title={link.name}
            />
          );
        })}
      </div>
    );
  }

  // display links as a list
  return (
    <div className="flex flex-col gap-3">
      {props.linkGroup.links.map((link, i) => {
        if ("links" in link) {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: nothing better available
            <GroupOfLinks key={i} level={props.level + 1} linkGroup={link} />
          );
        }
      })}
      {ungroupedLinks.length > 0 && (
        <GroupOfLinks
          level={props.level + 1}
          linkGroup={{
            expanded: true,
            links: ungroupedLinks,
            name: "Others",
          }}
        />
      )}
    </div>
  );
}

function GroupOfLinks(props: { linkGroup: LinkGroup; level: number }) {
  const slugger = sluggerContext.get();
  invariant(slugger, "slugger is not defined");

  return (
    <Details
      accordionItemClassName="m-0"
      accordionTriggerClassName="rounded-lg"
      anchorId={slugger.slug(props.linkGroup.name)}
      headingClassName="py-0.5 text-lg"
      summary={props.linkGroup.name}
    >
      <RenderLinkGroup level={props.level + 1} linkGroup={props.linkGroup} />
    </Details>
  );
}
