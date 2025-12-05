"use client";

import QRCodeScanner from "@/app/components/QRCodeScanner";
import { Navbar } from "@/app/components/navbar";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function Home() {
  // const [scanResult, setScanResult] = useState(null);

  // useEffect(() => {
  //   const scanner = new Html5QrcodeScanner("reader", {
  //     qrbox: {
  //       width: 250,
  //       height: 250,
  //     },
  //     fps: 5,
  //   });
  //   scanner.render(success, error);
  //   function success(result) {
  //     scanner.clear();
  //     setScanResult(result);
  //   }
  //   function error(error) {
  //     console.warn(error);
  //   }
  // }, []);

  return (
    <div className="flex flex-col items-center pt-8 pb-8">
      <div className="flex flex-col items-center max-w-[393px]">
        <Navbar />
        <div className="max-w-[363px] w-[363px] h-[328px] bg-gray-200 rounded-sm mt-8 mb-8" />
        <div className="w-full">
          <h1>Leitor de QR Code</h1>
          <QRCodeScanner />
        </div>
      </div>
    </div>
  );
}
