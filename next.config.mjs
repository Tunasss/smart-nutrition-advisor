/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ["*.ngrok-free.app", "localhost:3000"]
        }
    },
    allowedDevOrigins: ['1ef7-113-23-110-96.ngrok-free.app']
};
export default nextConfig;