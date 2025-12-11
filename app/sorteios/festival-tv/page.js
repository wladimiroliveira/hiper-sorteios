"use client";

import { RegisterCupomContainer } from "@/app/components/registerCupom";
import Image from "next/image";
import { SearchNumbers } from "@/app/components/searchNumbers";
import { Navbar } from "@/app/components/navbar";
import { ScannerModel } from "@/app/components/models/scanner.model";

export default function Page() {
  return (
    <div className="flex flex-col align-items justify-center max-w-[363px] m-auto pt-8 pb-8 pl-4 pr-4 gap-8">
      <Navbar />
      <Image
        className="w-[363px] h-[328px] rounded-sm"
        src="/art-image.jpg"
        width={619}
        height={560}
        alt="Art festival tvs"
      />
      <h1 className="text-xl font-bold">Escaneie aqui o seu cupom</h1>
      <div className="flex flex-col gap-4">
        <div>
          <ScannerModel />
        </div>
        <span className="italic text-gray-400">ou</span>
        <div>
          <RegisterCupomContainer />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-bold">Contulte seus números da sorte</h2>
        <SearchNumbers />
      </div>
    </div>
  );
}
