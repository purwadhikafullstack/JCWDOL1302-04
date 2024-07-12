/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'jcwdol130204-api.purwadhikabootcamp.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
