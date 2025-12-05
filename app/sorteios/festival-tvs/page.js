"use client";

import { Navbar } from "@/app/components/navbar";
import { Html5Qrcode } from "html5-qrcode";
import { useState } from "react";

export default function Home() {
  const [scanResult, setScanResult] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scanner, setScanner] = useState(null);

  async function openScanner() {
    setIsOpen(true);

    const cameras = await Html5Qrcode.getCameras();

    const backCamera = cameras.find(
      (cam) =>
        cam.label.toLowerCase().includes("back") ||
        cam.label.toLowerCase().includes("rear") ||
        cam.label.toLowerCase().includes("traseira"),
    );

    const cameraId = backCamera?.id || cameras[0].id;

    const html5QrCode = new Html5Qrcode("full-screen-scanner");
    setScanner(html5QrCode);

    html5QrCode.start(
      cameraId,
      { fps: 10, qrbox: false }, // ocupa a tela inteira
      (decodedText) => {
        html5QrCode.stop();
        setScanResult(decodedText);
        setIsOpen(false);
      },
      () => {},
    );
  }

  function closeScanner() {
    if (scanner) {
      scanner.stop().catch(() => {});
    }
    setIsOpen(false);
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

      {/* ---------- FULLSCREEN OVERLAY ----------- */}
      {isOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col" style={{ width: "100vw", height: "100vh" }}>
          {/* Botão de fechar */}
          <button className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded" onClick={closeScanner}>
            Fechar
          </button>

          {/* Área do scanner */}
          <div id="full-screen-scanner" className="w-full h-full"></div>
        </div>
      )}
    </div>
  );
}
