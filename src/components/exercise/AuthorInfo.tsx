import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface Props {
  addedBy: string | undefined;
}

export function AuthorInfo({ addedBy }: Props) {
  const profiles = useQuery(api.profiles.list);
  
  if (!addedBy || !profiles) return null;
  
  const profile = profiles.find(p => p.name === addedBy);
  
  if (!profile) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400">Added by</span>
        <div className="w-4 h-4 rounded-full bg-gray-200" />
        <span className="text-xs text-gray-500">{addedBy}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-400">Added by</span>
      <img
        src={profile.avatarUrl}
        alt={profile.name}
        className="w-4 h-4 rounded-full object-cover"
      />
      <span className="text-xs text-gray-500">{profile.name}</span>
    </div>
  );
} 