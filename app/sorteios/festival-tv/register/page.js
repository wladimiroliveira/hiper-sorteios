"use client";

import LoadingThreeDotsJumping from "@/app/components/animations/jumpingDots.animations";
import { Navbar } from "@/app/components/navbar";
import { Register } from "@/app/components/register";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);

  function handleStartLoading(bool) {
    setLoading(bool);
  }

  return (
    <div className="flex flex-col items-center pt-8 pl-4 pr-4 pb-8">
      <div className="flex flex-col items-center max-w-[393px]">
        <Navbar />
        <div
          className={clsx("flex fixed h-full w-full bg-gray-400/50 backdrop-blur-sm left-0 top-0 transition-all", {
            "opacity-0 pointer-events-none": !loading,
            "opacity-100 pointer-events-auto": loading,
          })}
        >
          <LoadingThreeDotsJumping />
        </div>
        <div className="w-full">
          <h2 className="font-bold text-xl mt-8">Cadastre-se abaixo</h2>
          <Register onLoading={handleStartLoading} />
        </div>
        <Image
          className="bg-gray-200 w-[363px] h-[328px] mt-8 rounded-sm"
          src="/art-image.jpg"
          width={619}
          height={560}
          alt="Art festival tvs"
        />
      </div>
    </div>
  );
}
