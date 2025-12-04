import { Navbar } from "@/app/components/navbar";
import { Register } from "@/app/components/register";

export default function Page() {
  return (
    <div className="flex flex-col items-center pt-8 pb-8">
      <div className="flex flex-col items-center max-w-[393px]">
        <Navbar />
        <div className="w-full">
          <h2 className="font-bold text-xl mt-8">Cadastre-se abaixo</h2>
          <Register />
        </div>
        <div className="max-w-[363px] w-[363px] h-[328px] bg-gray-200 rounded-sm mt-8 mb-8" />
      </div>
    </div>
  );
}
