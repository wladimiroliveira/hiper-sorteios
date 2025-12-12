"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCpfStore = create(
  persist(
    (set) => ({
      cpf: null,

      setCpf: (data) => set({ cpf: data }),

      clearCpf: () => set({ cpf: null }),
    }),
    {
      name: "cpf-info",
      getStorage: () => (typeof window !== "undefined" ? localStorage : undefined),
      partialize: (state) => ({ cpf: state.cpf }),
    },
  ),
);
