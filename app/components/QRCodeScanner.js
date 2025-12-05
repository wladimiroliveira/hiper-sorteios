"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from 'react';

export default function QRCodeScanner() {
  const [result, setResult] = useState("Nenhum QR lido ainda");
  const qrCodeRegionId = "html5qr-code-full-region";
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

    html5QrCodeRef.current
      .start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText, decodedResult) => {
          setResult(decodedText);
        },
        (errorMessage) => {
          console.warn("Erro ao ler QR code: ", errorMessage);
        },
      )
      .catch((err) => console.error("Não foi possível iniciar o scanner", err));

    return () => {
      html5QrCodeRef.current?.stop().catch((err) => console.error(err));
    };
  }, []);

  return (
    <div>
      <div id={qrCodeRegionId} style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}></div>
      <p>Resultado: {result}</p>
    </div>
  );
}
