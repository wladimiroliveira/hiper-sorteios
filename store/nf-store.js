"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNFStore = create(
  persist(
    (set) => ({
      nf: null,

      setNF: (nf) => set({ nf }),

      clearNF: () => set({ nf: null }),
    }),
    {
      name: "nf-store",
      getStorage: () => (typeof window !== "undefined" ? localStorage : undefined),
      partialize: (state) => ({ nf: state.nf }),
    },
  ),
);
