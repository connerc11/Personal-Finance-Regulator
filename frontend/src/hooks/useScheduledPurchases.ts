import { useState, useEffect } from 'react';
import { ScheduledPurchase } from '../types';
import { scheduledPurchaseAPI } from '../services/apiService';

// Types for past purchases
interface PastPurchase {
  id: number;
  originalScheduleId: number;
  name: string;
  amount: number;
  category: string;
  executedDate: string;
  scheduledDate: string;
  userId: number;
}

// localStorage keys
const SCHEDULED_PURCHASES_KEY = 'personal_finance_scheduled_purchases';
const PAST_PURCHASES_KEY = 'personal_finance_past_purchases';

export const useScheduledPurchases = (userId?: number) => {
  const [scheduledPurchases, setScheduledPurchases] = useState<ScheduledPurchase[]>([]);
  const [pastPurchases, setPastPurchases] = useState<PastPurchase[]>([]);
  const [upcomingPurchases, setUpcomingPurchases] = useState<ScheduledPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = () => {
    setLoading(true);
    try {
      // Load scheduled purchases
      const storedScheduled = localStorage.getItem(`${SCHEDULED_PURCHASES_KEY}_${userId}`);
      const scheduled = storedScheduled ? JSON.parse(storedScheduled) : [];
      setScheduledPurchases(scheduled);

      // Load past purchases
      const storedPast = localStorage.getItem(`${PAST_PURCHASES_KEY}_${userId}`);
      const past = storedPast ? JSON.parse(storedPast) : [];
      setPastPurchases(past);

      // Calculate upcoming purchases
      calculateUpcomingPurchases(scheduled);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setError('Failed to load scheduled purchases');
    } finally {
      setLoading(false);
    }
  };

  const saveScheduledPurchases = (purchases: ScheduledPurchase[]) => {
    if (userId) {
      localStorage.setItem(`${SCHEDULED_PURCHASES_KEY}_${userId}`, JSON.stringify(purchases));
      setScheduledPurchases(purchases);
      calculateUpcomingPurchases(purchases);
    }
  };

  const savePastPurchases = (past: PastPurchase[]) => {
    if (userId) {
      localStorage.setItem(`${PAST_PURCHASES_KEY}_${userId}`, JSON.stringify(past));
      setPastPurchases(past);
    }
  };

  const calculateUpcomingPurchases = (purchases: ScheduledPurchase[], days: number = 7) => {
    const upcoming = purchases.filter(p => {
      const dueDate = new Date(p.nextDue);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days && diffDays >= 0 && p.isActive;
    });
    setUpcomingPurchases(upcoming);
  };

  const refreshData = () => {
    if (userId) {
      loadUserData();
    }
  };

  const createScheduledPurchase = async (purchaseData: Omit<ScheduledPurchase, 'id'>) => {
    if (!userId) return;

    try {
      // Try API first
      const response = await scheduledPurchaseAPI.create(purchaseData);
      if (response.success && response.data) {
        const updatedPurchases = [...scheduledPurchases, response.data];
        saveScheduledPurchases(updatedPurchases);
        return response.data;
      }
    } catch (error) {
      console.warn('API failed, saving locally:', error);
    }

    // Fallback to local storage
    const newPurchase: ScheduledPurchase = {
      ...purchaseData,
      id: Date.now(), // Simple ID generation
      userId: userId,
    };
    
    const updatedPurchases = [...scheduledPurchases, newPurchase];
    saveScheduledPurchases(updatedPurchases);
    return newPurchase;
  };

  const updateScheduledPurchase = async (id: number, updates: Partial<ScheduledPurchase>) => {
    if (!userId) return;

    try {
      const response = await scheduledPurchaseAPI.update(id, updates);
      if (response.success && response.data) {
        const updatedPurchases = scheduledPurchases.map(p => p.id === id ? response.data : p);
        saveScheduledPurchases(updatedPurchases);
        return response.data;
      }
    } catch (error) {
      console.warn('API failed, updating locally:', error);
    }

    // Fallback to local storage
    const updatedPurchases = scheduledPurchases.map(p => p.id === id ? { ...p, ...updates } : p);
    saveScheduledPurchases(updatedPurchases);
  };

  const deleteScheduledPurchase = async (id: number) => {
    if (!userId) return;

    try {
      await scheduledPurchaseAPI.delete(id);
    } catch (error) {
      console.warn('API failed, deleting locally:', error);
    }

    const updatedPurchases = scheduledPurchases.filter(p => p.id !== id);
    saveScheduledPurchases(updatedPurchases);
  };

  const toggleActive = async (id: number) => {
    if (!userId) return;

    const purchase = scheduledPurchases.find(p => p.id === id);
    if (!purchase) return;

    try {
      const response = await scheduledPurchaseAPI.toggleActive(id);
      if (response.success && response.data) {
        const updatedPurchases = scheduledPurchases.map(p => p.id === id ? response.data : p);
        saveScheduledPurchases(updatedPurchases);
        return response.data;
      }
    } catch (error) {
      console.warn('API failed, toggling locally:', error);
    }

    // Fallback to local storage
    const updatedPurchases = scheduledPurchases.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    saveScheduledPurchases(updatedPurchases);
  };

  const executeNow = async (id: number) => {
    if (!userId) return;

    const purchase = scheduledPurchases.find(p => p.id === id);
    if (!purchase) return;

    try {
      const response = await scheduledPurchaseAPI.executeNow(id);
      if (response.success && response.data) {
        // Purchase executed successfully, add to past purchases
        const pastPurchase: PastPurchase = {
          id: Date.now(),
          originalScheduleId: id,
          name: purchase.name,
          amount: purchase.amount,
          category: purchase.category,
          executedDate: new Date().toISOString().split('T')[0],
          scheduledDate: purchase.nextDue,
          userId: userId,
        };

        const updatedPast = [...pastPurchases, pastPurchase];
        savePastPurchases(updatedPast);

        // Update next due date
        const updatedPurchases = updateNextDueDate(id);
        saveScheduledPurchases(updatedPurchases);
        
        return response.data;
      }
    } catch (error) {
      console.warn('API failed, executing locally:', error);
    }

    // Fallback: execute locally
    const pastPurchase: PastPurchase = {
      id: Date.now(),
      originalScheduleId: id,
      name: purchase.name,
      amount: purchase.amount,
      category: purchase.category,
      executedDate: new Date().toISOString().split('T')[0],
      scheduledDate: purchase.nextDue,
      userId: userId,
    };

    const updatedPast = [...pastPurchases, pastPurchase];
    savePastPurchases(updatedPast);

    // Update next due date
    const updatedPurchases = updateNextDueDate(id);
    saveScheduledPurchases(updatedPurchases);
  };

  const updateNextDueDate = (id: number): ScheduledPurchase[] => {
    return scheduledPurchases.map(p => {
      if (p.id === id) {
        const nextDue = new Date(p.nextDue);
        switch (p.frequency) {
          case 'daily':
            nextDue.setDate(nextDue.getDate() + 1);
            break;
          case 'weekly':
            nextDue.setDate(nextDue.getDate() + 7);
            break;
          case 'monthly':
            nextDue.setMonth(nextDue.getMonth() + 1);
            break;
          case 'yearly':
            nextDue.setFullYear(nextDue.getFullYear() + 1);
            break;
        }
        return { ...p, nextDue: nextDue.toISOString().split('T')[0] };
      }
      return p;
    });
  };

  const getTotalMonthlyAmount = () => {
    return scheduledPurchases
      .filter(p => p.isActive)
      .reduce((total, p) => {
        switch (p.frequency) {
          case 'daily': return total + (p.amount * 30);
          case 'weekly': return total + (p.amount * 4.33);
          case 'monthly': return total + p.amount;
          case 'yearly': return total + (p.amount / 12);
          default: return total;
        }
      }, 0);
  };

  return {
    scheduledPurchases,
    pastPurchases,
    upcomingPurchases,
    loading,
    error,
    createScheduledPurchase,
    updateScheduledPurchase,
    deleteScheduledPurchase,
    toggleActive,
    executeNow,
    getTotalMonthlyAmount,
    refreshData,
  };
};

// Export the PastPurchase type for use in components
export type { PastPurchase };
