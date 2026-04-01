/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent firebase-admin from being bundled in the client-side bundle
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
