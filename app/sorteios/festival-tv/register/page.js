import { Navbar } from "@/app/components/navbar";
import { Register } from "@/app/components/register";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col items-center pt-8 pl-4 pr-4 pb-8">
      <div className="flex flex-col items-center max-w-[393px]">
        <Navbar />
        <div className="w-full">
          <h2 className="font-bold text-xl mt-8">Cadastre-se abaixo</h2>
          <Register />
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
