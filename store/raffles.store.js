"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useRafflesStore = create(
  persist(
    (set) => ({
      raffles: null,

      setRaffles: (data) => set({ raffles: data }),

      clearRaffles: () => set({ raffles: null }),
    }),
    {
      name: "raffles-info",
      getStorage: () => (typeof window !== "undefined" ? localStorage : undefined),
      partialize: (state) => ({ raffles: state.raffles }),
    },
  ),
);
