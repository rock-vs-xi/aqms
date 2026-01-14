
import React, { useState } from 'react';
import { getCreativePrompt } from '../services/geminiService';

interface MessageInputProps {
  onSend: (message: string) => void;
  username: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, username }) => {
  const [message, setMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
    }
  };

  const handleAiSuggest = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    const suggestion = await getCreativePrompt(username);
    setMessage(suggestion);
    setIsAiLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="bg-gray-50 rounded-2xl p-5 relative min-h-[180px] border border-gray-100 shadow-inner">
        <div className="flex items-center gap-2 mb-2 opacity-40">
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>
           <span className="text-[10px] font-black uppercase tracking-tighter">Anonymous Message</span>
        </div>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="send me anonymous messages!"
          className="w-full bg-transparent outline-none resize-none text-black font-bold text-lg leading-tight placeholder:text-gray-300"
          maxLength={300}
          rows={4}
        />
        
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={isAiLoading}
            className={`p-2 rounded-full bg-white shadow-sm border border-gray-100 active:scale-90 transition-all ${isAiLoading ? 'animate-pulse' : ''}`}
            title="Get a creative suggestion"
          >
            <span className="text-xl">🎲</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={!message.trim()}
          className="w-full py-5 bg-black text-white rounded-full font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-20 disabled:hover:scale-100"
        >
          Send!
        </button>
        <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-tight py-2">
          By sending, you agree to our terms and safety policy.
        </p>
      </div>
    </form>
  );
};

export default MessageInput;
