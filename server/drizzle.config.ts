import {defineConfig} from 'drizzle-kit';
import * as dotenv  from 'dotenv';


dotenv.config();

// const isTest = process.env.NODE_ENV === 'test';

export default defineConfig({
    out:'./src/migrations',
     schema: './src/config/schema/**/*.ts',
     dialect:"postgresql",
     dbCredentials:{
          url:process.env.DATABASE_URL!,
     }
})