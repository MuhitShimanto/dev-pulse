import dotenv from 'dotenv';

dotenv.config();

if(!process.env.DB_URL) {
    throw new Error('Database URL is not defined in environment variables');
}


const config = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DB_URL,
}

export default config;