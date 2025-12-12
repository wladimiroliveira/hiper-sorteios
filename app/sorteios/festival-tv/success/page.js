"use client";

import { Navbar } from "@/app/components/navbar";
import { TimelineContainer } from "@/app/components/timeline";
import { useRafflesStore } from "@/store/raffles.store";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const { raffles } = useRafflesStore();
  const [numsGerados, setNumsGerados] = useState([]);

  useEffect(() => {
    if (Array.isArray(raffles)) {
      setNumsGerados(raffles.numbers);
    }
  }, [raffles]);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col gap-8 w-full">
        <h2 className="font-bold text-xl text-center mt-8">Parabéns!</h2>

        <p className="text-center">
          O seu cupom gerou <strong>{raffles?.length}</strong> números da sorte! Não se esqueça de seguir o instagram do{" "}
          <strong>
            <Link href="https://www.instagram.com/hipersenna?igsh=Y2ViOGJ0MGZmbGNv" target="_blank">
              @hipersenna
            </Link>
          </strong>
          , e ficar atento aos ganhadores.
        </p>

        <TimelineContainer dates={["13/12", "20/12", "27/12", "03/01"]} />
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <h2 className="font-bold text-xl text-center">Números gerados</h2>

        <div className="flex flex-col items-center">
          {Array.isArray(raffles) ? (
            raffles.map((num) => <p key={num.id}>{num.raffle_number}</p>)
          ) : (
            <p>Carregando...</p>
          )}
        </div>
      </div>
    </div>
  );
}
