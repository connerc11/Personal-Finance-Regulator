import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useIdleTimer from '../hooks/useIdleTimer';

interface IdleWarningModalProps {
  isOpen: boolean;
  remainingTime: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

const IdleWarningModal: React.FC<IdleWarningModalProps> = ({
  isOpen,
  remainingTime,
  onStayLoggedIn,
  onLogout
}) => {
  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 rounded-full p-2 mr-3">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Session Expiring Soon</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          You've been inactive for a while. For your security, you'll be logged out in:
        </p>
        
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-red-600">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          <p className="text-sm text-gray-500">minutes remaining</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onStayLoggedIn}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Stay Logged In
          </button>
          <button
            onClick={onLogout}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

const SessionManager: React.FC = () => {
  const { user, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);

  // 1 hour = 3,600,000 milliseconds
  const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
  const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before timeout

  const handleIdle = () => {
    if (user) {
      logout();
      setShowWarning(false);
    }
  };

  const { getRemainingTime, resetTimer } = useIdleTimer({
    timeout: SESSION_TIMEOUT,
    onIdle: handleIdle,
    events: ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'wheel']
  });

  // Check remaining time and show warning if needed
  useEffect(() => {
    if (!user) {
      setShowWarning(false);
      if (warningTimer) {
        clearInterval(warningTimer);
        setWarningTimer(null);
      }
      return;
    }

    const checkTime = () => {
      const remaining = getRemainingTime();
      
      if (remaining <= WARNING_TIME && remaining > 0) {
        setShowWarning(true);
      } else if (remaining <= 0) {
        setShowWarning(false);
        handleIdle();
      }
    };

    // Check every second when warning should be shown
    const timer = setInterval(checkTime, 1000);
    setWarningTimer(timer);

    return () => {
      clearInterval(timer);
    };
  }, [user, getRemainingTime, WARNING_TIME]);

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    resetTimer();
  };

  const handleLogoutNow = () => {
    setShowWarning(false);
    logout();
  };

  // Don't render anything if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <IdleWarningModal
      isOpen={showWarning}
      remainingTime={getRemainingTime()}
      onStayLoggedIn={handleStayLoggedIn}
      onLogout={handleLogoutNow}
    />
  );
};

export default SessionManager;
