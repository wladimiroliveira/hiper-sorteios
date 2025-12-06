"use client";

import { Navbar } from "@/app/components/navbar";
import { Html5Qrcode } from "html5-qrcode";
import { useState } from "react";

export default function Home() {
  const [scanResult, setScanResult] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [stream, setStream] = useState(null);
  const [showPhotoOption, setShowPhotoOption] = useState(false);
  const [imageCapture, setImageCapture] = useState(null);

  // --------------------------
  // SELECIONA A MELHOR CÂMERA
  // --------------------------
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
    }
  }

  return (
    <div className="flex flex-col items-center pt-8 pb-8">
      <div className="flex flex-col items-center max-w-[393px]">
        <Navbar />

        <div className="max-w-[363px] w-[363px] h-[328px] bg-gray-200 rounded-sm mt-8 mb-8" />

        <div className="w-full">
          <h2 className="font-bold text-xl mb-4">Escaneie aqui o seu cupom</h2>

          {scanResult && <div className="p-4 bg-green-200 rounded">Resultado: {scanResult}</div>}

          {!scanResult && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={openScanner}>
              Abrir Scanner
            </button>
          )}
        </div>
      </div>

      {/* ----------- FULLSCREEN OVERLAY ----------- */}
      {isOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <button className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded" onClick={closeScanner}>
            Fechar
          </button>

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
              📷 Tirar Foto (alta nitidez)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
