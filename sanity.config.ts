import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",

  // Fall back to "placeholder" so defineConfig never throws at build time on
  // Vercel when the env var hasn't been added to the project dashboard yet.
  // The studio itself will show an auth/project error, not a build failure.
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // ── Editorial content ──────────────────────────────────────
            S.listItem()
              .title("Articles")
              .child(
                S.documentList()
                  .title("Articles")
                  .filter('_type == "article"')
                  .defaultOrdering([{ field: "date", direction: "desc" }])
              ),
            S.divider(),
            S.listItem()
              .title("Categories")
              .child(
                S.documentList()
                  .title("Categories")
                  .filter('_type == "category"')
              ),
            S.divider(),

            // ── Site pages (singletons) ────────────────────────────────
            // Opens the About document directly — no list, just one doc.
            S.listItem()
              .title("About Page")
              .id("about-singleton")
              .child(
                S.document()
                  .documentId("about")
                  .schemaType("about")
                  .title("About Page")
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
  ],

  schema: {
    types: schemaTypes,
  },
});
