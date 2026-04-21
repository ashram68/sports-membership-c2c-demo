import { create } from 'zustand';
import { LISTINGS, Listing } from '@/data/listings';

interface AppState {
  // Auth
  isLoggedIn: boolean;
  currentUser: {
    id: string;
    nickname: string;
    dong: string;
    mannerScore: number;
    trustRate: number;
    avatarUrl: string;
  };

  // Listings
  listings: Listing[];
  selectedCategory: string;
  likedIds: string[];

  // Actions
  login: () => void;
  logout: () => void;
  setCategory: (cat: string) => void;
  toggleLike: (id: string) => void;
  getLikedListings: () => Listing[];
}

export const useAppStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  currentUser: {
    id: 'me',
    nickname: '헬스매니아77',
    dong: '강남구 역삼동',
    mannerScore: 4.8,
    trustRate: 93,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
  },

  listings: LISTINGS,
  selectedCategory: '전체',
  likedIds: ['3', '6'],

  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),

  setCategory: (cat) => set({ selectedCategory: cat }),

  toggleLike: (id) => {
    const { likedIds } = get();
    if (likedIds.includes(id)) {
      set({ likedIds: likedIds.filter((lid) => lid !== id) });
    } else {
      set({ likedIds: [...likedIds, id] });
    }
  },

  getLikedListings: () => {
    const { listings, likedIds } = get();
    return listings.filter((l) => likedIds.includes(l.id));
  },
}));
