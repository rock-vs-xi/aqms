
import React from 'react';
import { UserProfile } from '../types';

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="mb-4">
        <img 
          src={profile.avatarUrl} 
          alt={profile.username}
          className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
        />
      </div>
      <h1 className="text-xl font-extrabold text-black mb-1">@{profile.username}</h1>
      <div className="bg-gray-100 px-3 py-1 rounded-full">
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-wide">
          {profile.bio}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
