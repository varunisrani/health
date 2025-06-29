import { useState, useEffect, useRef, useCallback } from 'react';
import { webrtcService } from '@/lib/webrtcService';

export interface WebRTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isConnected: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  connectionState: RTCPeerConnectionState;
  error: string | null;
}

export interface WebRTCControls {
  initializeConnection: (roomId: string) => Promise<void>;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => Promise<void>;
  endCall: () => void;
  sendMessage: (message: any) => void;
}

export const useWebRTC = (
  onRemoteStream?: (stream: MediaStream) => void,
  onMessage?: (message: any) => void,
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void
): [WebRTCState, WebRTCControls] => {
  const [state, setState] = useState<WebRTCState>({
    localStream: null,
    remoteStream: null,
    isConnected: false,
    isConnecting: false,
    isMuted: false,
    isVideoEnabled: true,
    isScreenSharing: false,
    connectionState: 'new',
    error: null
  });

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  // Initialize WebRTC connection
  const initializeConnection = useCallback(async (roomId: string) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;
      setState(prev => ({
        ...prev,
        localStream: stream,
        isVideoEnabled: true,
        isMuted: false
      }));

      // Create peer connection
      const peerConnection = webrtcService.createPeerConnection();
      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        const remoteStream = event.streams[0];
        setState(prev => ({ ...prev, remoteStream }));
        onRemoteStream?.(remoteStream);
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        const connectionState = peerConnection.connectionState;
        setState(prev => ({
          ...prev,
          connectionState,
          isConnected: connectionState === 'connected',
          isConnecting: connectionState === 'connecting'
        }));
        onConnectionStateChange?.(connectionState);
      };

      // Handle ICE connection state changes
      peerConnection.oniceconnectionstatechange = () => {
        const iceState = peerConnection.iceConnectionState;
        if (iceState === 'failed' || iceState === 'disconnected') {
          setState(prev => ({
            ...prev,
            error: 'Connection lost. Attempting to reconnect...'
          }));
        }
      };

      // Create data channel for messaging
      const dataChannel = peerConnection.createDataChannel('messages', {
        ordered: true
      });
      
      dataChannelRef.current = dataChannel;
      
      dataChannel.onopen = () => {
        console.log('Data channel opened');
      };
      
      dataChannel.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error('Error parsing data channel message:', error);
        }
      };

      // Handle incoming data channels
      peerConnection.ondatachannel = (event) => {
        const channel = event.channel;
        channel.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            onMessage?.(message);
          } catch (error) {
            console.error('Error parsing incoming data channel message:', error);
          }
        };
      };

      // Connect to signaling server
      await webrtcService.connectToRoom(roomId, peerConnection);

      setState(prev => ({ ...prev, isConnecting: false }));

    } catch (error) {
      console.error('Error initializing WebRTC connection:', error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to initialize connection'
      }));
    }
  }, [onRemoteStream, onMessage, onConnectionStateChange]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setState(prev => ({ ...prev, isMuted: !audioTrack.enabled }));
      }
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setState(prev => ({ ...prev, isVideoEnabled: videoTrack.enabled }));
      }
    }
  }, []);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    if (!peerConnectionRef.current || !localStreamRef.current) return;

    try {
      if (state.isScreenSharing) {
        // Stop screen sharing, return to camera
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = videoStream.getVideoTracks()[0];
        
        const sender = peerConnectionRef.current.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
        
        // Replace track in local stream
        const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
        localStreamRef.current.removeTrack(oldVideoTrack);
        localStreamRef.current.addTrack(videoTrack);
        oldVideoTrack.stop();
        
        setState(prev => ({ 
          ...prev, 
          isScreenSharing: false,
          localStream: localStreamRef.current
        }));
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: true 
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        
        const sender = peerConnectionRef.current.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(screenTrack);
        }
        
        // Replace track in local stream
        const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
        localStreamRef.current.removeTrack(oldVideoTrack);
        localStreamRef.current.addTrack(screenTrack);
        oldVideoTrack.stop();
        
        // Handle screen share ending
        screenTrack.onended = () => {
          toggleScreenShare(); // This will switch back to camera
        };
        
        setState(prev => ({ 
          ...prev, 
          isScreenSharing: true,
          localStream: localStreamRef.current
        }));
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to toggle screen sharing'
      }));
    }
  }, [state.isScreenSharing]);

  // Send message through data channel
  const sendMessage = useCallback((message: any) => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      try {
        dataChannelRef.current.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }, []);

  // End call
  const endCall = useCallback(() => {
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    // Close data channel
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    
    // Disconnect from signaling server
    webrtcService.disconnect();
    
    setState({
      localStream: null,
      remoteStream: null,
      isConnected: false,
      isConnecting: false,
      isMuted: false,
      isVideoEnabled: true,
      isScreenSharing: false,
      connectionState: 'new',
      error: null
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  // Handle connection errors and reconnection
  useEffect(() => {
    if (state.connectionState === 'failed' || state.connectionState === 'disconnected') {
      // Attempt reconnection after a delay
      const reconnectTimeout = setTimeout(() => {
        if (peerConnectionRef.current) {
          // Try to restart ICE
          peerConnectionRef.current.restartIce();
        }
      }, 3000);

      return () => clearTimeout(reconnectTimeout);
    }
  }, [state.connectionState]);

  const controls: WebRTCControls = {
    initializeConnection,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    endCall,
    sendMessage
  };

  return [state, controls];
};