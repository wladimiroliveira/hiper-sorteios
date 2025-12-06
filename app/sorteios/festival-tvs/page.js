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

      let sortedByMP = backs.sort((a, b) => {
        const extractMP = (label) => {
          const m = label.match(/(\d+)\s*mp/i);
          return m ? parseInt(m[1]) : 0;
        };
        return extractMP(b.label) - extractMP(a.label);
      });

      return sortedByMP[0].id;
    }

    if (backs.length === 1) return backs[0].id;

    return cameras[0].id;
  }

  async function openScanner() {
    setIsOpen(true);

    const cameraId = await getBestBackCamera();

    const html5QrCode = new Html5Qrcode("full-screen-scanner");
    setScanner(html5QrCode);

    html5QrCode.start(
      cameraId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
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

      {/* ---------- FULLSCREEN OVERLAY ---------- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          {/* Botão de fechar */}
          <button className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded z-50" onClick={closeScanner}>
            Fechar
          </button>

          {/* Área onde o vídeo será mostrado */}
          <div id="full-screen-scanner" className="absolute inset-0 w-screen h-screen"></div>

          {/* Moldura centralizada */}
          <div
            className="absolute border-4 border-green-400 rounded-xl"
            style={{
              width: "260px",
              height: "260px",
              pointerEvents: "none",
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
