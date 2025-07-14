import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SessionStatusProps {
  showInHeader?: boolean;
  className?: string;
}

const SessionStatus: React.FC<SessionStatusProps> = ({ 
  showInHeader = false, 
  className = '' 
}) => {
  const { user } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!user) {
      setTimeRemaining('');
      return;
    }

    const updateTimer = () => {
      const expiryTime = localStorage.getItem('personalfinance_session_expiry');
      if (!expiryTime) {
        setTimeRemaining('');
        return;
      }

      const expiry = new Date(expiryTime);
      const now = new Date();
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Session expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [user]);

  if (!user || !timeRemaining) {
    return null;
  }

  if (showInHeader) {
    return (
      <div className={`text-sm text-gray-600 ${className}`}>
        <span className="hidden md:inline">Session expires in: </span>
        <span className="font-medium">{timeRemaining}</span>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-center">
        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm text-blue-800">
          Session expires in: <span className="font-medium">{timeRemaining}</span>
        </span>
      </div>
    </div>
  );
};

export default SessionStatus;
