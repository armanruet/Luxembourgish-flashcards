// Remove the socket.io-client import and use mock implementation
// import { io } from "socket.io-client";

import { UserProgress, DailyActivity, StudySession } from '@/types';

// Mock Socket type for now - we'll implement real WebSocket later
type Socket = any;

// Real-time event types
export type RealTimeEvent = 
  | 'progress_updated'
  | 'session_started'
  | 'session_ended'
  | 'achievement_unlocked'
  | 'goal_completed'
  | 'streak_updated'
  | 'device_connected'
  | 'device_disconnected'
  | 'presence_update'
  | 'live_stats_update';

export interface RealTimeEventData {
  type: RealTimeEvent;
  userId: string;
  data: any;
  timestamp: number;
  deviceId: string;
}

export interface DeviceInfo {
  id: string;
  type: 'mobile' | 'tablet' | 'desktop';
  userAgent: string;
  lastSeen: Date;
  isOnline: boolean;
}

export interface LiveStats {
  cardsDue: number;
  newCards: number;
  streak: number;
  accuracy: number;
  sessionTime: number;
  weeklyProgress: number;
  goalProgress: number;
  activeDevices: number;
  isOnline: boolean;
}

class RealTimeService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private deviceId: string;
  private reconnectAttempts = 0;
  // private maxReconnectAttempts = 5; // Not used in current implementation
  private eventListeners: Map<RealTimeEvent, ((data: RealTimeEventData) => void)[]> = new Map();
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.deviceId = this.generateDeviceId();
    this.setupConnectionHandlers();
  }

  private generateDeviceId(): string {
    const stored = localStorage.getItem('deviceId');
    if (stored) return stored;
    
    const newId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('deviceId', newId);
    return newId;
  }

  private setupConnectionHandlers() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
      window.addEventListener('beforeunload', () => this.handleBeforeUnload());
    }
  }

  private handleOnline() {
    if (this.userId) {
      this.connect(this.userId);
    }
  }

  private handleOffline() {
    this.isConnected = false;
    this.emitLocalEvent('presence_update', { isOnline: false });
  }

  private handleBeforeUnload() {
    this.disconnect();
  }

  async connect(userId: string): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.performConnection(userId);
    return this.connectionPromise;
  }

  private async performConnection(userId: string): Promise<void> {
    try {
      this.userId = userId;
      
      // Initialize socket connection (mock for now)
      // TODO: Implement real WebSocket connection
      this.socket = null;
      console.log('Real-time service initialized (mock mode)');

      this.setupSocketEventHandlers();
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.socket!.on('connect', () => {
          clearTimeout(timeout);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emitLocalEvent('device_connected', { deviceId: this.deviceId });
          resolve();
        });

        this.socket!.on('connect_error', (error: any) => {
          clearTimeout(timeout);
          this.isConnected = false;
          reject(error);
        });
      });
    } catch (error) {
      console.error('Real-time connection failed:', error);
      this.isConnected = false;
      throw error;
    } finally {
      this.connectionPromise = null;
    }
  }

  private setupSocketEventHandlers() {
    if (!this.socket) {
      // Mock mode - simulate connection
      this.isConnected = true;
      console.log('Real-time service in mock mode');
      return;
    }

    // TODO: Implement real socket event handlers
  }

  private handleIncomingEvent(eventData: RealTimeEventData) {
    // Don't process events from the same device
    if (eventData.deviceId === this.deviceId) return;

    const listeners = this.eventListeners.get(eventData.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(eventData);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  private emitLocalEvent(type: RealTimeEvent, data: any) {
    const eventData: RealTimeEventData = {
      type,
      userId: this.userId!,
      data,
      timestamp: Date.now(),
      deviceId: this.deviceId
    };

    this.handleIncomingEvent(eventData);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.userId = null;
  }

  // Event listener management
  addEventListener(type: RealTimeEvent, listener: (data: RealTimeEventData) => void): () => void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    
    this.eventListeners.get(type)!.push(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(type);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  // Emit events to other devices
  emitEvent(type: RealTimeEvent, data: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit('real_time_event', {
        type,
        userId: this.userId,
        data,
        timestamp: Date.now(),
        deviceId: this.deviceId
      });
    }

    // Also emit locally for immediate feedback
    this.emitLocalEvent(type, data);
  }

  // Update user progress in real-time
  updateProgress(progress: Partial<UserProgress>) {
    this.emitEvent('progress_updated', progress);
  }

  // Start/end study sessions
  startSession(session: StudySession) {
    this.emitEvent('session_started', session);
  }

  endSession(sessionId: string, results: any) {
    this.emitEvent('session_ended', { sessionId, results });
  }

  // Update daily activity
  updateDailyActivity(activity: DailyActivity) {
    this.emitEvent('progress_updated', { dailyActivity: activity });
  }

  // Unlock achievements
  unlockAchievement(achievement: any) {
    this.emitEvent('achievement_unlocked', achievement);
  }

  // Complete goals
  completeGoal(goal: any) {
    this.emitEvent('goal_completed', goal);
  }

  // Update streak
  updateStreak(streak: number) {
    this.emitEvent('streak_updated', { streak });
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      deviceId: this.deviceId,
      deviceType: this.getDeviceType(),
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // Get device type
  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Ping server to check connection
  async ping(): Promise<number> {
    if (!this.socket || !this.isConnected) {
      throw new Error('Not connected');
    }

    const start = Date.now();
    return new Promise((resolve, reject) => {
      this.socket!.emit('ping', () => {
        const latency = Date.now() - start;
        resolve(latency);
      });

      setTimeout(() => reject(new Error('Ping timeout')), 5000);
    });
  }

  // Get active devices for user
  async getActiveDevices(): Promise<DeviceInfo[]> {
    if (!this.socket || !this.isConnected) {
      return [];
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('get_active_devices', (devices: DeviceInfo[]) => {
        resolve(devices);
      });

      setTimeout(() => reject(new Error('Get devices timeout')), 5000);
    });
  }

  // Subscribe to live stats updates
  subscribeToLiveStats(callback: (stats: LiveStats) => void): () => void {
    return this.addEventListener('live_stats_update', (eventData) => {
      callback(eventData.data);
    });
  }

  // Subscribe to presence updates
  subscribeToPresence(callback: (data: { userId: string; isOnline: boolean; deviceId: string }) => void): () => void {
    return this.addEventListener('presence_update', (eventData) => {
      callback(eventData.data);
    });
  }
}

// Create singleton instance
export const realTimeService = new RealTimeService();

// Export for use in components
export default realTimeService; 