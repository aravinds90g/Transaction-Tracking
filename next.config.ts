import type { NextConfig } from "next";

module.exports = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
