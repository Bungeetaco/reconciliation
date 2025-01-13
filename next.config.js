/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
    },
    // Since this is a single-page application
    trailingSlash: true,
  }
  
  module.exports = nextConfig