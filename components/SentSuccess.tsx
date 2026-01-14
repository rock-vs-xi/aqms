
import React from 'react';

interface SentSuccessProps {
  onReset: () => void;
}

const SentSuccess: React.FC<SentSuccessProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <svg 
          className="w-10 h-10 text-green-500" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth={4}
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </div>
      
      <h2 className="text-3xl font-black text-black mb-2">Sent!</h2>
      <p className="text-gray-400 font-bold text-sm mb-10 px-4">
        Your message has been delivered anonymously.
      </p>

      <button
        onClick={onReset}
        className="w-full py-5 bg-black text-white rounded-full font-black text-lg hover:scale-[1.02] active:scale-95 transition-all"
      >
        Send another message
      </button>
      
      <div className="mt-8 pt-8 border-t border-gray-50 w-full">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Want to see responses?</p>
        <button className="w-full py-4 px-6 border-2 border-gray-100 text-black rounded-full font-black text-sm hover:bg-gray-50 transition-all uppercase tracking-tight">
          Download App
        </button>
      </div>
    </div>
  );
};

export default SentSuccess;
