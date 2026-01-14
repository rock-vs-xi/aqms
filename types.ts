
export interface UserProfile {
  username: string;
  avatarUrl: string;
  bio: string;
}

export enum AppState {
  INPUT = 'INPUT',
  SENDING = 'SENDING',
  SUCCESS = 'SUCCESS',
}
