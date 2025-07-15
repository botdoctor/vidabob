import { createClient } from 'redis';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function clearCache() {
  const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  try {
    await client.connect();
    console.log('Connected to Redis');
    
    // Flush all cache
    await client.flushAll();
    console.log('✅ Cache cleared successfully');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.disconnect();
    console.log('Disconnected from Redis');
  }
}

// Run the script
clearCache();