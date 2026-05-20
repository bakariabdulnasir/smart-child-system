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

  // Initialize children on mount
  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  // Refresh children when page becomes visible (fixes disappearing children issue)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh children data
        fetchChildren();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh on window focus
    const handleFocus = () => {
      fetchChildren();
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchChildren]);

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
