
import React, { useState } from 'react';
import { AppState, UserProfile } from './types';
import ProfileHeader from './components/ProfileHeader';
import MessageInput from './components/MessageInput';
import SentSuccess from './components/SentSuccess';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [profile] = useState<UserProfile>({
    username: 'tokuchi',
    avatarUrl: 'https://picsum.photos/seed/tokuchi/200/200',
    bio: 'send me anonymous messages!',
  });

  const handleSend = async (message: string) => {
    setAppState(AppState.SENDING);
    // Simulate API call to send message
    await new Promise(resolve => setTimeout(resolve, 1200));
    setAppState(AppState.SUCCESS);
  };

  const handleReset = () => {
    setAppState(AppState.INPUT);
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-12 pb-12 px-4">
      <div className="w-full max-w-[360px] bg-white rounded-[32px] ngl-card-shadow overflow-hidden flex flex-col transition-all duration-300">
        <div className="p-6 pt-10">
          <ProfileHeader profile={profile} />
          
          {appState === AppState.INPUT && (
            <MessageInput onSend={handleSend} username={profile.username} />
          )}

          {appState === AppState.SENDING && (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
              <p className="text-gray-400 font-bold text-sm tracking-tight">SENDING...</p>
            </div>
          )}

          {appState === AppState.SUCCESS && (
            <SentSuccess onReset={handleReset} />
          )}
        </div>
      </div>
      
      <footer className="mt-10 flex flex-col items-center gap-4 text-white">
        <div className="bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
          <p className="text-xs font-bold tracking-widest uppercase opacity-90">AMA • 100% Anonymous</p>
        </div>
        <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">Terms • Privacy • Safety</p>
      </footer>
    </div>
  );
};

export default App;
