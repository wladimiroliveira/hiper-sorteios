"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useClientRafflesStore = create(
  persist(
    (set) => ({
      clientRaffles: null,

      setClientRaffles: (data) => set({ raffles: data }),

      clearClientRaffles: () => set({ raffles: null }),
    }),
    {
      name: "clientRaffles-info",
      getStorage: () => (typeof window !== "undefined" ? localStorage : undefined),
      partialize: (state) => ({ clientRaffles: state.clientRaffles }),
    },
  ),
);
