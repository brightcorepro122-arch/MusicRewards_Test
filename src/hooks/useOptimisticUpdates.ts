// Optimistic updates hook with rollback functionality
import { useState, useCallback } from 'react';

export interface OptimisticUpdate<T> {
  id: string;
  data: T;
  timestamp: number;
  rollback: () => void;
}

export const useOptimisticUpdates = <T>() => {
  const [pendingUpdates, setPendingUpdates] = useState<OptimisticUpdate<T>[]>([]);

  const addOptimisticUpdate = useCallback((
    id: string,
    data: T,
    rollback: () => void
  ) => {
    const update: OptimisticUpdate<T> = {
      id,
      data,
      timestamp: Date.now(),
      rollback,
    };

    setPendingUpdates(prev => [...prev, update]);
    return update;
  }, []);

  const removeOptimisticUpdate = useCallback((id: string) => {
    setPendingUpdates(prev => prev.filter(update => update.id !== id));
  }, []);

  const rollbackUpdate = useCallback((id: string) => {
    const update = pendingUpdates.find(u => u.id === id);
    if (update) {
      update.rollback();
      removeOptimisticUpdate(id);
    }
  }, [pendingUpdates, removeOptimisticUpdate]);

  const rollbackAllUpdates = useCallback(() => {
    pendingUpdates.forEach(update => update.rollback());
    setPendingUpdates([]);
  }, [pendingUpdates]);

  const clearOldUpdates = useCallback((maxAge: number = 30000) => {
    const now = Date.now();
    setPendingUpdates(prev => 
      prev.filter(update => {
        if (now - update.timestamp > maxAge) {
          update.rollback();
          return false;
        }
        return true;
      })
    );
  }, []);

  return {
    pendingUpdates,
    addOptimisticUpdate,
    removeOptimisticUpdate,
    rollbackUpdate,
    rollbackAllUpdates,
    clearOldUpdates,
  };
};



