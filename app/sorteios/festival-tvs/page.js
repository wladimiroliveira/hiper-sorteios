"use client";

import { Navbar } from "@/app/components/navbar";
import { Html5Qrcode } from "html5-qrcode";
import { useState } from "react";

export default function Home() {
  const [scanResult, setScanResult] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scanner, setScanner] = useState(null);

  async function getBestBackCamera() {
    const cameras = await Html5Qrcode.getCameras();

    if (!cameras || cameras.length === 0) return null;

    // Normaliza labels para evitar case-problems
    const norm = (str) => str.toLowerCase();

    // 1. Preferir câmeras com "wide" (principal)
    let wide = cameras.find((cam) => norm(cam.label).includes("wide") || norm(cam.label).includes("main"));
    if (wide) return wide.id;

    // 2. Procurar as que são traseiras
    let backs = cameras.filter(
      (cam) =>
        norm(cam.label).includes("back") || norm(cam.label).includes("rear") || norm(cam.label).includes("traseira"),
    );

    // Se houver múltiplas traseiras, escolher uma "melhor"
    if (backs.length > 1) {
      // tentar buscar por "main"
      let mainBack = backs.find((cam) => norm(cam.label).includes("main") || norm(cam.label).includes("wide"));
      if (mainBack) return mainBack.id;

      // Buscar megapixels no label (android às vezes informa)
      let sortedByMP = backs.sort((a, b) => {
        const extractMP = (label) => {
          const m = label.match(/(\d+)\s*mp/i);
          return m ? parseInt(m[1]) : 0;
        };
        return extractMP(b.label) - extractMP(a.label);
      });

      return sortedByMP[0].id;
    }

    // 3. Se só tem uma traseira, retorna ela
    if (backs.length === 1) return backs[0].id;

    // 4. fallback: qualquer câmera (a primeira normalmente é a melhor wide)
    return cameras[0].id;
  }

  async function openScanner() {
    setIsOpen(true);

    const cameras = await Html5Qrcode.getCameras();

    const cameraId = await getBestBackCamera();

    const html5QrCode = new Html5Qrcode("full-screen-scanner");
    setScanner(html5QrCode);

    html5QrCode.start(
      cameraId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }, // área de leitura (combina com a moldura)
      },
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
        <div
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
          style={{ width: "100vw", height: "100vh" }}
        >
          {/* Botão de fechar */}
          <button className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded z-50" onClick={closeScanner}>
            Fechar
          </button>

          {/* Scanner container */}
          <div id="full-screen-scanner" className="w-full h-full absolute top-0 left-0"></div>

          {/* ----------- MOLDURA (FRAME) ----------- */}
          <div
            className="
              absolute
              border-4 border-green-400
              rounded-xl
            "
            style={{
              width: "260px",
              height: "260px",
              pointerEvents: "none", // evita interferir no scanner
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
