"use client";

import { Navbar } from "@/app/components/navbar";
import { Scanner } from "@/app/components/scanner";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRafflesStore } from "@/store/raffles-store";
import { useNFStore } from "@/store/nf-store";
import { Modal } from "@/app/components/modal";

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

  async function getBestBackCamera() {
    const cameras = await Html5Qrcode.getCameras();
    if (!cameras || cameras.length === 0) return null;

    const norm = (str) => str.toLowerCase();

    let wide = cameras.find((cam) => norm(cam.label).includes("wide") || norm(cam.label).includes("main"));
    if (wide) return wide.id;

    let backs = cameras.filter(
      (cam) =>
        norm(cam.label).includes("back") || norm(cam.label).includes("rear") || norm(cam.label).includes("traseira"),
    );

    if (backs.length > 1) {
      let mainBack = backs.find((cam) => norm(cam.label).includes("main") || norm(cam.label).includes("wide"));
      if (mainBack) return mainBack.id;
    }

    if (backs.length === 1) return backs[0].id;

    return cameras[0].id;
  }

  // --------------------------
  //   ABRIR SCANNER + STREAM
  // --------------------------
  async function openScanner() {
    setIsOpen(true);
    setShowPhotoOption(false);

    const cameraId = await getBestBackCamera();

    const html5QrCode = new Html5Qrcode("full-screen-scanner");
    setScanner(html5QrCode);

    // Iniciar stream manualmente para permitir IMAGECAPTURE
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: cameraId },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        focusMode: "continuous",
      },
    });

    setStream(videoStream);

    // Criar ImageCapture com foco contínuo
    const track = videoStream.getVideoTracks()[0];
    const imgCap = new ImageCapture(track);
    setImageCapture(imgCap);

    try {
      const capabilities = await imgCap.getPhotoCapabilities();
      if (capabilities.focusMode.includes("continuous")) {
        await track.applyConstraints({ advanced: [{ focusMode: "continuous" }] });
      }
    } catch (err) {
      console.warn("Foco automático não suportado.", err);
    }

    // Iniciar scanner usando o stream manual
    html5QrCode.start(
      { deviceId: { exact: cameraId } },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        closeScanner();
        setScanResult(decodedText);
      },
      () => {},
    );

    // Após 20 segundos, mostrar opção de tirar foto
    setTimeout(() => {
      setShowPhotoOption(true);
    }, 20000);
  }

  // --------------------------
  //      FECHAR SCANNER
  // --------------------------
  function closeScanner() {
    if (scanner) scanner.stop().catch(() => {});
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setIsOpen(false);
  }

  // --------------------------
  //     TIRAR FOTO COM FOCO
  // --------------------------
  async function takePhotoAndRead() {
    if (!imageCapture) return alert("Erro: ImageCapture não disponível.");

    try {
      const blob = await imageCapture.takePhoto();

      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(bitmap, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");

      // Ler QR usando método interno
      const result = await Html5Qrcode.scanImage(dataUrl, false);

      closeScanner();
      setScanResult(result);
    } catch (err) {
      alert("Não foi possível ler o QR code da foto.");
      setModalInfo({
        title: "Erro",
        description: "Não foi possível ler o QR code da foto.",
      });
      setOpen(true);
    }
  }

  // =====================================================
  //         6) EXTRAIR VALOR DO CÓDIGO
  // =====================================================
  useEffect(() => {
    if (!scanResult) return;

    const regex = /p=([^|]+)/;
    const match = scanResult.match(regex);

    if (match?.[1]) {
      const extractedValue = match[1];
      setNfcNumber(extractedValue);
      console.log("Valor extraído:", extractedValue);
    } else {
      console.log("Não foi possível extrair o valor.");
    }
  }, [scanResult]);

  async function createRaffle() {
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
      if (!responseResult.ok) {
        if (responseValue?.message === "Valor do cupom não atingiu o valor mínimo para participar do sorteio.") {
          console.log("Valor do cupom não atingiu o valor mínimo para participar do sorteio.");
          setModalInfo({
            title: "Erro",
            description: responseValue?.message,
          });
          setOpen(true);
        }
        if (responseValue?.message === "CPF não encontrado no cupom fiscal.") {
          console.log("CPF não encontrado no cupom fiscal.");
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
        const { clearRaffles, setRaffles } = useRafflesStore.json();
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

  // =====================================================
  //                   7) RENDER
  // =====================================================
  return (
    <div className="flex flex-col items-center pt-8 pb-8">
      <Modal
        info={{
          title: modalInfo?.title,
          description: modalInfo?.description,
        }}
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

      {/* OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <button className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded" onClick={closeScanner}>
            Fechar
          </button>

          {/* container usado pelo html5-qrcode */}
          <div id="full-screen-scanner" className="absolute inset-0 w-screen h-screen"></div>

          <div
            className="absolute border-4 border-green-400 rounded-xl"
            style={{
              width: "260px",
              height: "260px",
              pointerEvents: "none",
            }}
          ></div>

          {showPhotoOption && (
            <button
              onClick={takePhotoAndRead}
              className="absolute bottom-10 bg-white text-black px-5 py-3 rounded-full shadow-lg flex flex-col items-center gap-1"
            >
              📷 Tirar Foto
            </button>
          )}
        </div>
      )}
    </div>
  );
}
