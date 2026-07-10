import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ultimate-multimodal/muapi-client",
    "@ultimate-multimodal/shared",
    "@ultimate-multimodal/workflow-engine",
  ],
};

export default nextConfig;
