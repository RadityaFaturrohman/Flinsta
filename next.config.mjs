/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'id.pinterest.com/',
        // hostname: 'i.pinimg.com',
        // port: '',
        // pathname: '/pin/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pximg.net',
      },
      {
        protocol: 'https',
        hostname: 'www.pixiv.net/',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'files.edgestore.dev',
      },
    ],
    // domains: ['i.pinimg.com']
  },
}

export default nextConfig;
