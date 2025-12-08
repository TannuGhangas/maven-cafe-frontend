// src/components/common/CallChefButton.jsx

import React, { useState, useEffect, useRef } from 'react';
import { FaPhone, FaUtensils, FaCheck, FaTimes, FaRunning, FaClock } from 'react-icons/fa';
import { initSocket, isSocketConnected, getSocket } from '../../api/socketService';
import { callApi } from '../../api/apiService';

const CallChefButton = ({ user }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [hasCalled, setHasCalled] = useState(false);
  const [chefResponse, setChefResponse] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [currentCallId, setCurrentCallId] = useState(null);
  const [socketReady, setSocketReady] = useState(false);
  const pollIntervalRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const setupSocket = async () => {
      const socket = await initSocket(user);
      if (socket) {
        setSocketReady(true);
        
        // Listen for chef response via socket
        socket.on('chef-response', (data) => {
          console.log('📞 Chef response received via socket:', data);
          handleChefResponse(data.response);
        });
        
        // Listen for call confirmation
        socket.on('call-sent', (data) => {
          if (data.success) {
            setHasCalled(true);
            setCurrentCallId(data.call?.id);
          }
        });
      }
    };
    
    setupSocket();
    
    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off('chef-response');
        socket.off('call-sent');
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [user]);

  // HTTP polling fallback when socket is not connected
  useEffect(() => {
    if (hasCalled && currentCallId && !isSocketConnected()) {
      console.log('Using HTTP polling for chef response (socket not connected)');
      pollIntervalRef.current = setInterval(async () => {
        try {
          const response = await callApi(
            `/chef-call-status?userId=${user.id}&userRole=${user.role}`,
            'GET',
            null,
            true
          );
          
          if (response?.success && response.call?.chefResponse) {
            handleChefResponse(response.call.chefResponse);
            clearInterval(pollIntervalRef.current);
          }
        } catch (err) {
          console.error('Error polling chef response:', err);
        }
      }, 2000);
    }
    
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [hasCalled, currentCallId]);

  const handleChefResponse = (response) => {
    setChefResponse(response);
    setShowResponseModal(true);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      setShowResponseModal(false);
      setChefResponse(null);
      setHasCalled(false);
      setIsCalling(false);
      setCurrentCallId(null);
    }, 10000);
  };



  const handleCallChef = async () => {
    if (isCalling || hasCalled) return;
    
    // Get seat number from user data or prompt user
    const seatNumber = user.seatNumber || user.location || prompt('Please enter your seat/location:') || 'Unknown';
    
    if (seatNumber === 'Unknown') {
      alert('Please provide your seat number to call the chef.');
      return;
    }
    
    setIsCalling(true);
    
    const socket = getSocket();
    console.log('📞 Attempting to call chef...');
    console.log('🔌 Socket status:', { connected: socket?.connected, id: socket?.id });
    console.log('👤 User info:', { id: user.id, name: user.name, role: user.role });
    console.log('🪑 Seat number:', seatNumber);
    
    // Try socket first, fallback to HTTP
    if (socket?.connected) {
      console.log('📡 Sending chef call via socket...');
      socket.emit('call-chef', {
        userId: user.id,
        userName: user.name,
        seatNumber: seatNumber
      });
    } else {
      console.log('📡 Socket not connected, using HTTP fallback...');
      // HTTP fallback
      try {
        const response = await callApi('/call-chef', 'POST', {
          userId: user.id,
          userRole: user.role,
          userName: user.name,
          seatNumber: seatNumber,
          timestamp: new Date().toISOString()
        });
        
        console.log('📡 HTTP response:', response);
        if (response?.success) {
          setHasCalled(true);
          setCurrentCallId(response.call?.id);
          console.log('✅ Chef call successful via HTTP');
        } else {
          alert('Failed to call chef. Please try again.');
          setIsCalling(false);
        }
      } catch (error) {
        console.error('❌ Error calling chef:', error);
        alert('Error calling chef. Please try again.');
        setIsCalling(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowResponseModal(false);
    setChefResponse(null);
    setHasCalled(false);
    setIsCalling(false);
    setCurrentCallId(null);
  };

  const buttonStyle = {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    width: '65px',
    height: '65px',
    borderRadius: '50%',
    backgroundColor: hasCalled ? '#28a745' : '#103c7f',
    color: 'white',
    border: '3px solid white',
    cursor: isCalling || hasCalled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.3s ease',
    zIndex: 9999,
    animation: isCalling && !hasCalled ? 'pulse 1.5s infinite' : hasCalled ? 'bounce 1s' : 'none',
    opacity: isCalling && !hasCalled ? 0.7 : 1
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    animation: 'fadeIn 0.3s ease-out',
  };

  const modalStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '90%',
    width: '350px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    animation: 'slideUp 0.4s ease-out',
  };

  const iconStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: chefResponse === 'coming' ? '#28a745' : chefResponse === 'coming_5min' ? '#ffc107' : '#dc3545',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    fontSize: '36px',
    color: chefResponse === 'coming_5min' ? '#333' : 'white',
  };

  const getResponseMessage = () => {
    switch (chefResponse) {
      case 'coming':
        return 'Chef is coming now! 🏃';
      case 'coming_5min':
        return 'Chef will be there in 5 minutes! ⏰';
      case 'dismiss':
        return 'Chef is currently busy. Please wait.';
      default:
        return 'Waiting for response...';
    }
  };

  const getResponseIcon = () => {
    switch (chefResponse) {
      case 'coming':
        return <FaRunning />;
      case 'coming_5min':
        return <FaClock />;
      case 'dismiss':
        return <FaTimes />;
      default:
        return <FaUtensils />;
    }
  };

  const pulseKeyframes = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
      40%, 43% { transform: translate3d(0,-10px,0); }
      70% { transform: translate3d(0,-5px,0); }
      90% { transform: translate3d(0,-2px,0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{pulseKeyframes}</style>
      <button
        style={buttonStyle}
        onClick={handleCallChef}
        title={hasCalled ? 'Chef Notified!' : 'Call Chef'}
        disabled={isCalling || hasCalled}
      >
        {isCalling && !hasCalled ? (
          <FaUtensils style={{ animation: 'spin 1s linear infinite' }} />
        ) : hasCalled ? (
          <FaCheck />
        ) : (
          <FaPhone />
        )}
      </button>

      {/* Chef Response Modal */}
      {showResponseModal && chefResponse && (
        <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={iconStyle}>
              {getResponseIcon()}
            </div>
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              color: '#333', 
              marginBottom: '15px',
              fontFamily: 'Cambria, serif'
            }}>
              Chef Response
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: '#555', 
              marginBottom: '25px',
              lineHeight: '1.5'
            }}>
              {getResponseMessage()}
            </p>
            <button
              onClick={handleCloseModal}
              style={{
                backgroundColor: '#103c7f',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CallChefButton;
