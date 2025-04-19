"use client";

import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default', duration = 3000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts(prevToasts => [
      ...prevToasts, 
      { id, title, description, variant, duration }
    ]);
    
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(t => t.id !== id));
    }, duration);
    
    return id;
  }, []);

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(({ id, title, description, variant }) => (
        <div
          key={id}
          className={`px-4 py-2 rounded shadow-lg max-w-xs animate-slide-in ${
            variant === 'destructive' ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}
        >
          {title && <div className="font-pixel text-sm font-bold">{title}</div>}
          {description && <div className="font-pixel text-xs mt-1">{description}</div>}
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
};

export default useToast;