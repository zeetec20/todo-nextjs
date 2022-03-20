/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    auth: true,
    DOMAIN: 'http://127.0.0.1:3000'
  }
}

module.exports = nextConfig
