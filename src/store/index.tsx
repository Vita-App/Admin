import { atom } from 'recoil';
import { AdminType } from 'types';

interface AuthState {
  isLoggedIn: boolean;
  user?: AdminType | null;
}

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    user: null,
    isLoggedIn: false,
  },
});
