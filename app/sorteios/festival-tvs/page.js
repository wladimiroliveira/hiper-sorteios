"use client";

import { Navbar } from "@/app/components/navbar";
import { Scanner } from "@/app/components/scanner";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRafflesStore } from "@/store/raffles-store";
import { useNFStore } from "@/store/nf-store";
import { Modal } from "@/app/components/modal";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  const [scanResult, setScanResult] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [stream, setStream] = useState(null);
  const [showPhotoOption, setShowPhotoOption] = useState(false);
  const [imageCapture, setImageCapture] = useState(null);
  const [nfcNumber, setNfcNumber] = useState("");
  const [open, setOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const [cameras, setCameras] = useState([]);
  const [currentCameraId, setCurrentCameraId] = useState(null);

  // ==========================================================
  //        🔥 SELEÇÃO MAIS PRECISA DA CÂMERA TRASEIRA
  // ==========================================================
  async function getCamera() {
    const cameras = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log(cameras);
    const mainCameraObj = cameras.find((camera) => camera.label.includes("0"));
    const mainCameraId = mainCameraObj?.deviceId;
    if (mainCameraId) return mainCameraId;
  }

  async function createRaffle() {
    try {
      const responseResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/raffles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nfc_key: nfcNumber }),
      });

      const responseValue = await responseResult.json();

      if (!responseResult.ok) {
        if (
          [
            "Valor do cupom não atingiu o valor mínimo para participar do sorteio.",
            "CPF não encontrado no cupom fiscal.",
          ].includes(responseValue?.message)
        ) {
          setModalInfo({
            title: "Erro",
            description: responseValue?.message,
          });
          setOpen(true);
        }

        if (responseValue?.message === "Cliente não encontrado no sistema") {
          const { clearNF, setNF } = useNFStore.getState();
          clearNF();
          setNF(nfcNumber);
          return router.push("festival-tvs/register");
        }
      }

      if (responseResult.ok) {
        const { clearRaffles, setRaffles } = useRafflesStore.getState();
        clearRaffles();
        setRaffles(responseValue);
        return router.push(`festival-tvs/register`);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  function handleSetOpen(bool) {
    setOpen(bool);
  }
  return (
    <div className="flex flex-col items-center pt-8 pb-8">
      <Button onClick={getCamera}>Teste</Button>
      {/* <Modal
        info={{ title: modalInfo?.title, description: modalInfo?.description }}
        onSetOpen={handleSetOpen}
        open={open}
      />

      <div className="flex flex-col items-center max-w-[363px]">
        <Navbar />
        <div className="max-w-[363px] w-[363px] h-[328px] bg-gray-200 rounded-sm mt-8 mb-8" />
        <div className="w-full">
          <h2 className="font-bold text-xl mb-4">Escaneie aqui o seu cupom</h2>
          <Scanner openScanner={openScanner} sendNfc={createRaffle} nfcNumber={nfcNumber} />
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <button className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded" onClick={closeScanner}>
            Fechar
          </button>

          <button className="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded" onClick={switchCamera}>
            🔄 Trocar câmera
          </button>

          <div id="full-screen-scanner" className="absolute inset-0 w-screen h-screen" />

          <div
            className="absolute border-4 border-green-400 rounded-xl"
            style={{ width: "260px", height: "260px", pointerEvents: "none" }}
          />

          {showPhotoOption && (
            <button
              onClick={takePhotoAndRead}
              className="absolute bottom-10 bg-white text-black px-5 py-3 rounded-full shadow-lg"
            >
              📷 Tirar Foto
            </button>
          )}
        </div>
      )} */}
    </div>
  );
}
