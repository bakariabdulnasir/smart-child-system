import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { childAPI } from '../services/api';

const ChildrenContext = createContext();

export const useChildren = () => useContext(ChildrenContext);

export const ChildrenProvider = ({ children: childrenProp }) => {
  const [childrenList, setChildrenList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChildren = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await childAPI.getAll();
      if (res.ok) {
        const response = await res.json();
        if (response.data && response.data.children) {
          setChildrenList(response.data.children);
        } else if (Array.isArray(response)) {
          setChildrenList(response);
        } else {
          setChildrenList([]);
        }
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to load children');
      }
    } catch (err) {
      setError('Network error - is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

// Initialize children on mount only
  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  // NOTE: Removed visibilitychange and focus event listeners
  // These were causing dashboard stats to reset when modals open/close
  // because opening a modal makes document.hidden=true, and closing it
  // triggers a visibility change that auto-refetches, resetting the parent state.
  // Data should only refresh on explicit user actions (addChild, updateChild, removeChild)

const addChild = useCallback(async (newChild) => {
    // Optimistically add to local state
    setChildrenList(prev => [...prev, newChild]);
    // Then fetch fresh data from backend to ensure consistency
    await fetchChildren();
  }, [fetchChildren]);

  const updateChild = useCallback(async (updatedChild) => {
    // Optimistically update local state
    setChildrenList(prev => prev.map(c => 
      c.id === updatedChild.id ? updatedChild : c
    ));
    // Then fetch fresh data from backend to ensure consistency
    await fetchChildren();
  }, [fetchChildren]);

  const removeChild = useCallback(async (childId) => {
    // Optimistically remove from local state
    setChildrenList(prev => prev.filter(c => c.id !== childId));
    // Then fetch fresh data from backend to ensure consistency
    await fetchChildren();
  }, [fetchChildren]);

  const value = {
    children: childrenList,
    loading,
    error,
    fetchChildren,
    addChild,
    updateChild,
    removeChild
  };

  return (
    <ChildrenContext.Provider value={value}>
      {childrenProp}
    </ChildrenContext.Provider>
  );
};

export default ChildrenContext;
