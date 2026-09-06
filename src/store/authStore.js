import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const authStore = create()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      setAccessToken: (token) =>
        set({ accessToken: token }),

      setUser: (user) =>
        set({ user }),

      login: (accessToken, user) =>
        set({
          accessToken,
          user,
        }),

      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
