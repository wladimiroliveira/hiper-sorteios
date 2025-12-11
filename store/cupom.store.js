"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCupomStore = create(
  persist(
    (set) => ({
      cupom: null, // nome correto!

      setCupom: (cupom) => set({ cupom }),

      clearCupom: () => set({ cupom: null }),
    }),
    {
      name: "cupom-store",
      getStorage: () => (typeof window !== "undefined" ? localStorage : undefined),
      partialize: (state) => ({ cupom: state.cupom }), // persistir apenas o cupom
    },
  ),
);
