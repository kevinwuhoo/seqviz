const isProd = process.env.NODE_ENV === "production";

// const withTM = require("next-transpile-modules")(["seqviz", "../seqviz"]); // pass the modules you would like to see transpiled

module.exports = {
  // Use the CDN in production and localhost for development.
  // https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
  assetPrefix: isProd ? "https://tools.latticeautomation.com/seqviz" : undefined,
  // https://github.com/vercel/next.js/issues/33488#issuecomment-1063677133
  images: isProd
    ? {
        domains: ["https://tools.latticeautomation.com/seqviz"],
        path: "https://tools.latticeautomation.com/seqviz",
      }
    : undefined,
  experimental: {
    externalDir: true,
  },
};
