"use client";

import Image from "next/image";
import { RegisterCupomContainer } from "@/app/components/registerCupom";
import { SearchNumbers } from "@/app/components/searchNumbers";
import { Navbar } from "@/app/components/navbar";
import { ScannerModel } from "@/app/components/models/scanner.model";
import { useState } from "react";
import clsx from "clsx";
import LoadingThreeDotsJumping from "@/app/components/animations/jumpingDots.animations";

export default function Page() {
  const [openScanner, setOpenScanner] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleOpenScanner(bool) {
    setOpenScanner(bool);
  }

  function handleStartLoading(bool) {
    setLoading(bool);
  }

  return (
    <div>
      <div
        className={clsx("flex fixed h-full w-full bg-gray-400/50 backdrop-blur-sm left-0 top-0 transition-all", {
          "opacity-0 pointer-events-none": !loading,
          "opacity-100 pointer-events-auto": loading,
        })}
      >
        <LoadingThreeDotsJumping />
      </div>
      <Navbar />
      <Image
        className={clsx("w-[363px] h-[328px] rounded-sm", {
          hidden: openScanner,
        })}
        src="/art-image.jpg"
        width={619}
        height={560}
        alt="Art festival tvs"
      />
      <h1 className="text-xl font-bold">Escaneie aqui o seu cupom</h1>
      <div className="flex flex-col gap-4">
        <div>
          <ScannerModel openScanner={openScanner} onOpenScanner={handleOpenScanner} onLoading={handleStartLoading} />
        </div>
        <span className="italic text-gray-400">ou</span>
        <div>
          <RegisterCupomContainer onLoading={handleStartLoading} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-bold">Contulte seus números da sorte</h2>
        <SearchNumbers />
      </div>
    </div>
  );
}
