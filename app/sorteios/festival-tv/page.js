"use client";

import LoadingThreeDotsJumping from "@/app/components/animations/jumpingDots.animations";
import { CheckCpf } from "@/app/components/cpfCheck";
import { Navbar } from "@/app/components/navbar";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  function handleStartLoading(bool) {
    setLoading(bool);
  }
  return (
    <div className="flex flex-col gap-2">
      <div
        className={clsx("flex fixed h-full w-full bg-gray-400/50 backdrop-blur-sm left-0 top-0 transition-all", {
          "opacity-0 pointer-events-none": !loading,
          "opacity-100 pointer-events-auto": loading,
        })}
      >
        <LoadingThreeDotsJumping />
      </div>
      <div className="flex items-center justify-center w-full">
        <Image src="/logo-senna.svg" alt="" height={21.08} width={31} />
      </div>
      <h1 className="text-lg font-bold">Insira seu CPF</h1>
      <CheckCpf onLoading={handleStartLoading} />
    </div>
  );
}
