/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14
  async rewrites() {
    return [
      {
        source: '/callback',
        destination: '/api/auth/callback',
      },
    ]
  },
}

module.exports = nextConfig
