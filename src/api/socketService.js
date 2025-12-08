// src/api/socketService.js

let socket = null;
let io = null;
let socketInitialized = false;

// Lazy load socket.io-client
const loadSocketIO = async () => {
  if (io) return io;
  try {
    const module = await import('socket.io-client');
    io = module.io;
    return io;
  } catch (e) {
    console.log('Socket.IO client not available, using HTTP fallback');
    return null;
  }
};

// Get the base URL from environment variable
const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  // Remove /api suffix and trailing slash if present to avoid double /api/api/ issues
  return apiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
};

export const initSocket = async (user) => {
  if (socket?.connected) return socket;
  
  const ioClient = await loadSocketIO();
  if (!ioClient) {
    console.log('Socket.IO not available');
    return null;
  }
  
  const SOCKET_URL = getSocketUrl();
  console.log('🔌 Initializing socket with URL:', SOCKET_URL);
  console.log('👤 User info:', { id: user.id, role: user.role });
  
  try {
    socket = ioClient(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });
    
    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
      console.log('🏠 Socket URL:', SOCKET_URL);
      socket.emit('join', { role: user.role, userId: user.id });
    });
    
    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });
    
    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      console.error('🔍 Error details:', error);
      console.log('🔧 Trying to reconnect...');
    });
    
    socketInitialized = true;
    return socket;
  } catch (error) {
    console.error('Failed to initialize socket:', error);
    return null;
  }
};

export const getSocket = () => socket;

export const isSocketConnected = () => socket?.connected || false;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default { initSocket, getSocket, disconnectSocket, isSocketConnected };
