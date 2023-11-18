/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

module.exports = {
  images: {
    domains: ['i.imgur.com', 'joe-canchu-api.octave.vip'],
  },
  async redirects() {
    return [
      {
        source: '/user/demo',
        destination: '/user/signup',
        permanent: false,
        basePath: false,
        locale: false,
        missing: [{ type: 'cookie', key: 'access_token' }],
      },
      {
        source: '/posts/demo',
        destination: '/user/signup',
        permanent: false,
        basePath: false,
        locale: false,
        missing: [{ type: 'cookie', key: 'access_token' }],
      },
      {
        source: '/',
        destination: '/user/signup',
        permanent: false,
        basePath: false,
        locale: false,
        missing: [{ type: 'cookie', key: 'access_token' }],
      },
    ];
  },
};
