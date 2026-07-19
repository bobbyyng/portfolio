import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    localPatterns: [
      {
        pathname: "/projects/covers/**",
      },
      {
        pathname: "/blog/**",
      },
      {
        pathname: "/profile.jpg",
      },
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
