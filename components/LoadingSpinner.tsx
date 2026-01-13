import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Criando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative">
        <Sparkles className="w-16 h-16 text-yellow-400 animate-spin" />
        <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
      </div>
      <p className="text-xl font-bold text-yellow-200 animate-bounce-slow text-center">
        {message}
      </p>
    </div>
  );
};
