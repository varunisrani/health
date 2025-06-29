// WebRTC Service for handling peer connections and signaling
// This service provides a simplified WebRTC implementation for demo purposes
// In production, you would integrate with a service like Daily.co, Agora, or build your own signaling server

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join-room' | 'leave-room' | 'user-joined' | 'user-left';
  payload?: any;
  roomId?: string;
  userId?: string;
}

class WebRTCService {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private signalingSocket: WebSocket | null = null;
  private currentRoomId: string | null = null;
  private userId: string;
  
  // STUN/TURN servers configuration
  private readonly iceServers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    // In production, add TURN servers for NAT traversal
    // { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
  ];

  constructor() {
    this.userId = this.generateUserId();
  }

  private generateUserId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create a new peer connection
  createPeerConnection(): RTCPeerConnection {
    const peerConnection = new RTCPeerConnection({
      iceServers: this.iceServers
    });

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.signalingSocket) {
        this.sendSignalingMessage({
          type: 'ice-candidate',
          payload: event.candidate.toJSON(),
          roomId: this.currentRoomId!
        });
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
    };

    // Handle ICE connection state changes
    peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', peerConnection.iceConnectionState);
    };

    return peerConnection;
  }

  // Connect to a room (simplified signaling)
  async connectToRoom(roomId: string, peerConnection: RTCPeerConnection): Promise<void> {
    this.currentRoomId = roomId;
    
    // In a real implementation, you would connect to your signaling server
    // For this demo, we'll simulate the signaling process
    this.simulateSignaling(roomId, peerConnection);
  }

  // Simplified signaling simulation for demo purposes
  private simulateSignaling(roomId: string, peerConnection: RTCPeerConnection): void {
    // In production, replace this with actual WebSocket signaling server
    console.log(`Connecting to room: ${roomId}`);
    
    // Simulate creating an offer for the demo
    setTimeout(async () => {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        // In real implementation, send offer to signaling server
        console.log('Offer created and set as local description');
        
        // Simulate receiving an answer (in real app, this comes from signaling server)
        this.simulateAnswer(peerConnection);
      } catch (error) {
        console.error('Error creating offer:', error);
      }
    }, 1000);
  }

  // Simulate receiving an answer (for demo purposes)
  private async simulateAnswer(peerConnection: RTCPeerConnection): Promise<void> {
    // In production, this would be an actual answer from another peer
    // For demo, we'll create a mock answer
    setTimeout(async () => {
      try {
        // This is just for demo - in real app, you receive actual SDP from other peer
        const mockAnswer: RTCSessionDescriptionInit = {
          type: 'answer',
          sdp: 'mock-sdp-answer' // This would be real SDP in production
        };
        
        // Note: This won't actually work for real connections, 
        // but demonstrates the flow for development
        console.log('Simulated answer received (demo mode)');
      } catch (error) {
        console.error('Error handling simulated answer:', error);
      }
    }, 1500);
  }

  // Send signaling message (placeholder for real implementation)
  private sendSignalingMessage(message: SignalingMessage): void {
    // In production, send via WebSocket to signaling server
    console.log('Sending signaling message (demo mode):', message);
    
    // For demo purposes, we'll just log the message
    // In real implementation:
    // if (this.signalingSocket && this.signalingSocket.readyState === WebSocket.OPEN) {
    //   this.signalingSocket.send(JSON.stringify(message));
    // }
  }

  // Initialize signaling connection (placeholder)
  private initializeSignaling(): Promise<void> {
    return new Promise((resolve, reject) => {
      // In production, connect to your signaling server
      // Example WebSocket connection:
      /*
      try {
        this.signalingSocket = new WebSocket('wss://your-signaling-server.com');
        
        this.signalingSocket.onopen = () => {
          console.log('Connected to signaling server');
          resolve();
        };
        
        this.signalingSocket.onmessage = (event) => {
          const message: SignalingMessage = JSON.parse(event.data);
          this.handleSignalingMessage(message);
        };
        
        this.signalingSocket.onerror = (error) => {
          console.error('Signaling error:', error);
          reject(error);
        };
        
        this.signalingSocket.onclose = () => {
          console.log('Signaling connection closed');
          this.signalingSocket = null;
        };
      } catch (error) {
        reject(error);
      }
      */
      
      // For demo, immediately resolve
      setTimeout(resolve, 100);
    });
  }

  // Handle incoming signaling messages (placeholder)
  private async handleSignalingMessage(message: SignalingMessage): Promise<void> {
    console.log('Received signaling message:', message);
    
    switch (message.type) {
      case 'offer':
        await this.handleOffer(message);
        break;
      case 'answer':
        await this.handleAnswer(message);
        break;
      case 'ice-candidate':
        await this.handleIceCandidate(message);
        break;
      case 'user-joined':
        console.log('User joined room:', message.userId);
        break;
      case 'user-left':
        console.log('User left room:', message.userId);
        break;
      default:
        console.warn('Unknown signaling message type:', message.type);
    }
  }

  // Handle incoming offer
  private async handleOffer(message: SignalingMessage): Promise<void> {
    const { payload } = message;
    const peerConnection = this.createPeerConnection();
    
    try {
      await peerConnection.setRemoteDescription(payload);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      this.sendSignalingMessage({
        type: 'answer',
        payload: answer,
        roomId: this.currentRoomId!
      });
      
      this.peerConnections.set(message.userId!, peerConnection);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  // Handle incoming answer
  private async handleAnswer(message: SignalingMessage): Promise<void> {
    const { payload, userId } = message;
    const peerConnection = this.peerConnections.get(userId!);
    
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(payload);
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  }

  // Handle incoming ICE candidate
  private async handleIceCandidate(message: SignalingMessage): Promise<void> {
    const { payload, userId } = message;
    const peerConnection = this.peerConnections.get(userId!);
    
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(payload));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }

  // Join a room
  async joinRoom(roomId: string): Promise<void> {
    try {
      await this.initializeSignaling();
      this.currentRoomId = roomId;
      
      this.sendSignalingMessage({
        type: 'join-room',
        roomId,
        userId: this.userId
      });
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  // Leave current room
  leaveRoom(): void {
    if (this.currentRoomId) {
      this.sendSignalingMessage({
        type: 'leave-room',
        roomId: this.currentRoomId,
        userId: this.userId
      });
      
      // Close all peer connections
      this.peerConnections.forEach(pc => pc.close());
      this.peerConnections.clear();
      
      this.currentRoomId = null;
    }
  }

  // Disconnect from signaling server
  disconnect(): void {
    this.leaveRoom();
    
    if (this.signalingSocket) {
      this.signalingSocket.close();
      this.signalingSocket = null;
    }
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  // Get user media with error handling
  async getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localStream = stream;
      return stream;
    } catch (error) {
      console.error('Error getting user media:', error);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Camera and microphone access denied. Please allow access and try again.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No camera or microphone found. Please check your devices.');
        } else if (error.name === 'NotReadableError') {
          throw new Error('Camera or microphone is already in use by another application.');
        }
      }
      
      throw new Error('Failed to access camera or microphone. Please check your permissions.');
    }
  }

  // Get display media for screen sharing
  async getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getDisplayMedia(constraints);
    } catch (error) {
      console.error('Error getting display media:', error);
      throw new Error('Failed to start screen sharing. Please try again.');
    }
  }

  // Check if WebRTC is supported
  static isSupported(): boolean {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.RTCPeerConnection
    );
  }

  // Get available devices
  async getDevices(): Promise<MediaDeviceInfo[]> {
    try {
      return await navigator.mediaDevices.enumerateDevices();
    } catch (error) {
      console.error('Error enumerating devices:', error);
      return [];
    }
  }

  // Test network connectivity
  async testConnectivity(): Promise<boolean> {
    try {
      const pc = new RTCPeerConnection({ iceServers: this.iceServers });
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          pc.close();
          resolve(false);
        }, 5000);
        
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            clearTimeout(timeout);
            pc.close();
            resolve(true);
          }
        };
        
        // Create a dummy data channel to trigger ICE gathering
        pc.createDataChannel('test');
        pc.createOffer().then(offer => pc.setLocalDescription(offer));
      });
    } catch (error) {
      console.error('Error testing connectivity:', error);
      return false;
    }
  }
}

// Export singleton instance
export const webrtcService = new WebRTCService();

// Export class for testing or multiple instances
export { WebRTCService };