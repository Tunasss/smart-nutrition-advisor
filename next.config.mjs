/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ["*.ngrok-free.app", "localhost:3000"]
        }
    },
    allowedDevOrigins: ['1dc3-42-116-121-243.ngrok-free.app']
};
export default nextConfig;