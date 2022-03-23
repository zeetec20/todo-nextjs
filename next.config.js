/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    auth: true,
    DOMAIN: 'http://localhost:3000'
  }
}

module.exports = nextConfig
