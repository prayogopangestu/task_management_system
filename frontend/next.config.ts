/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tambahkan trailingSlash config
  trailingSlash: false,
  env: {
    NEXT_PUBLIC_API_SERVICE: process.env.NEXT_PUBLIC_API_SERVICE,
  },
}

module.exports = nextConfig
