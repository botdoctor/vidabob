import { createClient, RedisClientType } from 'redis';

class CacheService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('ready', () => {
      console.log('Redis Client Connected');
      this.isConnected = true;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected && !this.client.isOpen) {
      try {
        await this.client.connect();
        this.isConnected = true;
      } catch (error) {
        console.error('Failed to connect to Redis:', error);
        // Continue without Redis if it's not available
        console.log('Continuing without Redis cache...');
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected && this.client.isOpen) {
      try {
        await this.client.disconnect();
        this.isConnected = false;
      } catch (error) {
        console.error('Error disconnecting from Redis:', error);
      }
    }
  }

  // Generic cache methods
  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) return null;
    
    try {
      const cached = await this.client.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, expireInSeconds: number = 3600): Promise<void> {
    if (!this.isConnected || !this.client) return;
    
    try {
      await this.client.setEx(key, expireInSeconds, JSON.stringify(value));
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected) return;
    
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.isConnected) return;
    
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      console.error(`Cache invalidate pattern error for ${pattern}:`, error);
    }
  }

  // Vehicle-specific cache methods
  async cacheVehicles(): Promise<void> {
    try {
      // Import Vehicle model here to avoid circular dependencies
      const Vehicle = (await import('../models/VehicleNew')).default;
      const vehicles = await Vehicle.find({ available: true }).lean();
      await this.set('vehicles:all', vehicles, 1800); // Cache for 30 minutes
      console.log(`Cached ${vehicles.length} vehicles`);
    } catch (error) {
      console.error('Error caching vehicles:', error);
    }
  }

  async getCachedVehicles(): Promise<any[] | null> {
    return this.get<any[]>('vehicles:all');
  }

  async cacheVehicle(vehicleId: string, vehicle: any): Promise<void> {
    await this.set(`vehicle:${vehicleId}`, vehicle, 3600); // Cache for 1 hour
  }

  async getCachedVehicle(vehicleId: string): Promise<any | null> {
    return this.get<any>(`vehicle:${vehicleId}`);
  }

  async invalidateVehicleCache(vehicleId?: string): Promise<void> {
    if (vehicleId) {
      await this.del(`vehicle:${vehicleId}`);
    }
    await this.del('vehicles:all');
    console.log('Vehicle cache invalidated');
  }

  // Session cache methods
  async setUserSession(userId: string, sessionData: any): Promise<void> {
    await this.set(`session:${userId}`, sessionData, 86400); // 24 hours
  }

  async getUserSession(userId: string): Promise<any | null> {
    return this.get<any>(`session:${userId}`);
  }

  async deleteUserSession(userId: string): Promise<void> {
    await this.del(`session:${userId}`);
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Export the instance and specific methods
export default cacheService;

// Properly bind methods to maintain 'this' context
export const connectCache = cacheService.connect.bind(cacheService);
export const disconnectCache = cacheService.disconnect.bind(cacheService);
export const cacheVehicles = cacheService.cacheVehicles.bind(cacheService);
export const getCachedVehicles = cacheService.getCachedVehicles.bind(cacheService);
export const cacheVehicle = cacheService.cacheVehicle.bind(cacheService);
export const getCachedVehicle = cacheService.getCachedVehicle.bind(cacheService);
export const invalidateVehicleCache = cacheService.invalidateVehicleCache.bind(cacheService);
export const setUserSession = cacheService.setUserSession.bind(cacheService);
export const getUserSession = cacheService.getUserSession.bind(cacheService);
export const deleteUserSession = cacheService.deleteUserSession.bind(cacheService);