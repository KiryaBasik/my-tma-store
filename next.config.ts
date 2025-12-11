import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "155.212.219.98",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "155.212.219.98",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "nidium.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "nidium.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
