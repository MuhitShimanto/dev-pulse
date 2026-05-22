import dotenv from 'dotenv';

dotenv.config();

if(!process.env.DB_URL) {
    throw new Error('Database URL is not defined in environment variables');
}

if(!process.env.JWT_SECRET) {
    throw new Error('JWT secret is not defined in environment variables');
}

const config = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DB_URL,
    jwtSecret: process.env.JWT_SECRET
}

export default config;