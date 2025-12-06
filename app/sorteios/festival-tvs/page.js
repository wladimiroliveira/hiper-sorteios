"use client";

import { Navbar } from "@/app/components/navbar";
import { Html5Qrcode } from "html5-qrcode";
import { useState, useEffect } from "react";

export default function Home() {
  const [scanResult, setScanResult] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [showPhotoOption, setShowPhotoOption] = useState(false);

  // --------------------------
  // SELECIONA A MELHOR CÂMERA
  // --------------------------
  async function getBestBackCamera() {
    const cameras = await Html5Qrcode.getCameras();
    if (!cameras || cameras.length === 0) return null;

    const norm = (str) => str.toLowerCase();

    // Preferência: wide ou main
    let wide = cameras.find((cam) => norm(cam.label).includes("wide") || norm(cam.label).includes("main"));
    if (wide) return wide.id;

    // Filtrar câmeras traseiras
    let backs = cameras.filter(
      (cam) =>
        norm(cam.label).includes("back") || norm(cam.label).includes("rear") || norm(cam.label).includes("traseira"),
    );

    // Se houver múltiplas, tente identificar a melhor
    if (backs.length > 1) {
      let mainBack = backs.find((cam) => norm(cam.label).includes("main") || norm(cam.label).includes("wide"));
      if (mainBack) return mainBack.id;

      // Ordenar por megapixels quando possível
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

    // Fallback
    return cameras[0].id;
  }

  // --------------------------
  //      ABRIR SCANNER
  // --------------------------
  async function openScanner() {
    setIsOpen(true);
    setShowPhotoOption(false);

    const cameraId = await getBestBackCamera();

    const html5QrCode = new Html5Qrcode("full-screen-scanner");
    setScanner(html5QrCode);

    // Timeout de 20s para mostrar opção de tirar foto
    setTimeout(() => {
      setShowPhotoOption(true);
    }, 20000);

    html5QrCode.start(
      cameraId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        html5QrCode.stop();
        setScanResult(decodedText);
        setIsOpen(false);
      },
      () => {},
    );
  }

  // --------------------------
  //      FECHAR SCANNER
  // --------------------------
  function closeScanner() {
    if (scanner) {
      scanner.stop().catch(() => {});
    }
    setIsOpen(false);
  }

  // --------------------------
  // LER QR DE UMA FOTO TIRADA
  // --------------------------
  async function handlePhotoUpload(e) {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    try {
      const result = await Html5Qrcode.scanFile(file, true);
      setScanResult(result);
      setIsOpen(false);
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

      {/* INPUT PARA TIRAR FOTO */}
      <input
        id="camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* ----------- OVERLAY FULLSCREEN ----------- */}
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
          <div id="full-screen-scanner" className="absolute inset-0 w-screen h-screen"></div>

          {/* Moldura */}
          <div
            className="absolute border-4 border-green-400 rounded-xl"
            style={{
              width: "260px",
              height: "260px",
              pointerEvents: "none",
            }}
          ></div>

          {/* Botão de tirar foto após 20s */}
          {showPhotoOption && (
            <button
              onClick={() => document.getElementById("camera-input").click()}
              className="absolute bottom-10 bg-white text-black px-5 py-3 rounded-full shadow-lg flex flex-col items-center gap-1 z-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.5 2a1 1 0 0 1 .8.4l.9 1.2H14a1 1 0 0 1 1 1V13a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4.6a1 1 0 0 1 1-1h1.8l.9-1.2A1 1 0 0 1 6.5 2h4zM8 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
              </svg>
              <span className="text-sm font-semibold">Tirar Foto</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
