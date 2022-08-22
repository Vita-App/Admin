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

export const usersTableState = atom({
  key: 'usersTableState',
  default: {
    pageSize: 10,
    page: 0,
  },
});

export const filterOptionsState = atom({
  key: 'filterOptionsState',
  default: {
    search: '',
    topMentors: false,
    signupIncomplete: false,
    unapprovedMentors: false,
    onlyMentors: false,
  },
});
