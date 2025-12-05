import { Navbar } from "@/app/components/navbar";
import { TimelineContainer } from "@/app/components/timeline";
import Link from "next/link";

export default async function Page() {
  const numsGerados = [
    "fdsajfslj",
    "fdsajfslj",
    "fdsajfslj",
    "fdsajfslj",
    "fdsajfslj",
    "fdsajfslj",
    "fdsajfslj",
    "fdsajfslj",
  ];
  return (
    <div className="flex flex-col items-center pt-8 pb-8">
      <div className="flex flex-col items-center max-w-[393px]">
        <Navbar />
        <div className="flex flex-col gap-8 w-full">
          <h2 className="font-bold text-xl text-center mt-8">Parabéns!</h2>
          <p className="text-center">
            O seu cupom gerou <strong>{numsGerados ? numsGerados.length : "x"}</strong> números da sorte! Não se esqueça
            de seguir o instagram do{" "}
            <strong>
              <Link href="https://www.instagram.com/hipersenna?igsh=Y2ViOGJ0MGZmbGNv" target="_blank">
                @hipersenna
              </Link>
            </strong>
            , e ficar a tento aos ganhadores, que serão divilgados nas datas abaixo.
          </p>
          <div>
            <TimelineContainer dates={["13/12", "20/12", "27/12", "03/01"]} />
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <h2 className="font-bold text-xl text-center">Números gerados</h2>
          <div className="flex flex-col items-center">
            {numsGerados ? (
              numsGerados.map((num) => {
                return <p>{num}</p>;
              })
            ) : (
              <p>...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
