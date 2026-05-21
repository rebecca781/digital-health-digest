/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  // Prevent @sanity/client (and related packages that use Node.js built-ins
  // like node:crypto and node:https) from being bundled into client-side
  // chunks by webpack. Without this, the App Router emits a client-side JS
  // chunk for server-component routes that imports the Sanity module graph,
  // which then fails to execute in the browser → ChunkLoadError.
  experimental: {
    // Tell webpack NOT to bundle these packages into client-side chunks.
    // @sanity/client and @sanity/pkg-utils use Node.js built-ins (node:crypto,
    // node:https) that cannot run in a browser. next-sanity is a thin adapter
    // that does NOT use Node.js built-ins and must NOT be listed here — doing
    // so breaks subpath imports (next-sanity/studio/metadata, /viewport) at
    // runtime on Vercel's serverless environment.
    serverComponentsExternalPackages: ["@sanity/client", "@sanity/pkg-utils"],
  },
};

export default nextConfig;
