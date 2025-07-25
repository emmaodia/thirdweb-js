import { readFile } from "node:fs/promises";
import path from "node:path";
import FlexSearch from "flexsearch";
import type { PageData, PageTitleIndex, SectionIndex } from "../types";

type Indexes = {
  sectionIndex: SectionIndex;
  websiteData: PageData[];
  pageTitleIndex: PageTitleIndex;
};

async function createSearchIndexes(): Promise<Indexes> {
  console.debug("CREATING SEARCH INDEX...");

  const websiteDataContent = await readFile(
    path.resolve(process.cwd(), "searchIndex.json"),
    "utf-8",
  );

  const websiteData = JSON.parse(websiteDataContent) as PageData[];

  // create indexes
  const pageTitleIndex: PageTitleIndex = new FlexSearch.Document({
    cache: 100,
    document: {
      id: "id",
      index: ["title", "id"],
    },
    tokenize: "full",
  });

  const sectionIndex: SectionIndex = new FlexSearch.Document({
    cache: 100,
    document: {
      id: "id",
      index: ["title", "content"],
      store: ["title", "content", "pageId", "href", "id"],
    },
    preset: "default",
    tokenize: "full",
  });

  // add data to indexes
  let sectionId = 0;
  for (let pageId = 0; pageId < websiteData.length; pageId++) {
    const pageData = websiteData[pageId];
    if (!pageData) {
      continue;
    }

    pageTitleIndex.add({
      id: pageId,
      title: pageData.title,
    });

    if (pageData.sections) {
      for (const section of pageData.sections) {
        sectionIndex.add({
          content: section.content,
          href: section.href || "",
          id: sectionId++,
          pageId: pageId,
          title: section.title || "",
        });
      }
    }
  }

  console.debug("SEARCH INDEX CREATED");

  return {
    pageTitleIndex,
    sectionIndex,
    websiteData,
  };
}

let indexes: Indexes;
let indexesPromise: Promise<Indexes>;

export async function getSearchIndexes() {
  // if index is not yet created
  if (!indexes) {
    // if index is being created
    if (indexesPromise) {
      // wait for it to be created
      return await indexesPromise;
    }

    // create index, and save the promise so that other requests can wait for the same
    indexesPromise = createSearchIndexes();
    indexes = await indexesPromise;
    return indexes;
  }

  return indexes;
}
