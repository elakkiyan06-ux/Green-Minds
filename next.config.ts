import type { NextConfig } from "next";

const isGithubPages = process.env.DEPLOY_TARGET === 'gh-pages';

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : undefined,
  basePath: isGithubPages ? '/Green-Minds' : '',
  assetPrefix: isGithubPages ? '/Green-Minds/' : undefined,
  trailingSlash: isGithubPages ? true : false,
  typescript: {
    ignoreBuildErrors: isGithubPages ? true : false,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
