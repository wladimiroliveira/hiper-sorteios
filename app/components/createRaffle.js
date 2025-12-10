"use client";

import { useNFStore } from "@/store/nf.store";
import { useRafflesStore } from "@/store/raffles.store";
import { useRouter } from "next/navigation";

export async function createRaffle(nfcNumber) {
  try {
    const responseResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/raffles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nfc_key: nfcNumber,
      }),
    });
    const responseValue = await responseResult.json();
    const router = useRouter();
    if (!responseResult.ok) {
      if (responseValue?.message === "Valor do cupom não atingiu o valor mínimo para participar do sorteio.") {
        console.log("Valor do cupom não atingiu o valor mínimo para participar do sorteio.");
      }
      if (responseValue?.message === "CPF não encontrado no cupom fiscal.") {
        console.log("CPF não encontrado no cupom fiscal.");
      }
      if (responseValue?.message === "Cliente não encontrado no sistema") {
        const { clearNF, setNF } = useNFStore.getState();
        clearNF();
        setNF(nfcNumber);
        return router.push("festival-tvs/register");
      }
    }
    if (responseResult.ok) {
      const { clearRaffles, setRaffles } = useRafflesStore.json();
      clearRaffles();
      setRaffles(responseValue);
      return router.push(`festival-tvs/success`);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
