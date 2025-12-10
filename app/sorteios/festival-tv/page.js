"use client";

import { Modal } from "@/app/components/modal";
import { RegisterCupomContainer } from "@/app/components/registerCupom";
import { Button } from "@/components/ui/button";
import { IconCameraFilled, IconX } from "@tabler/icons-react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { SearchNumbers } from "@/app/components/searchNumbers";
import { Navbar } from "@/app/components/navbar";

export default function Page() {
  const devices = useDevices();

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [openScanner, setOpenScanner] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  function handleOpenScanner() {
    if (openScanner === true) {
      setOpenScanner(false);
      return;
    }
    setOpenScanner(true);
  }

  const handleScan = (detectedCodes) => {
    console.log("Detected codes:", detectedCodes);
    // detectedCodes is an array of IDetectedBarcode objects
    detectedCodes.forEach((code) => {
      console.log(`Format: ${code.format}, Value: ${code.rawValue}`);
    });
  };

  const highlightCodeOnCanvas = (detectedCodes, ctx) => {
    detectedCodes.forEach((detectedCode) => {
      const { boundingBox, cornerPoints } = detectedCode;

      // Draw bounding box
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 4;
      ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);

      // Draw corner points
      ctx.fillStyle = "#FF0000";
      cornerPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };

  function handleSetOpen(bool) {
    setOpen(bool);
  }

  return (
    <div className="flex flex-col align-items justify-center max-w-[363px] m-auto pb-8 pl-4 pr-4 gap-8">
      <Modal
        info={{
          title: modalInfo?.title,
          description: modalInfo?.description,
        }}
        onSetOpen={handleSetOpen}
        open={open}
      />
      <Navbar />
      <Image
        className="bg-gray-200 w-[363px] h-[328px] rounded-sm"
        src="/art-image.jpg"
        width={619}
        height={560}
        alt="Art festival tvs"
      />
      <h1 className="text-xl font-bold">Escaneie aqui o seu cupom</h1>
      <div className="flex flex-col gap-4">
        <div>
          <p className="font-bold">Escaneie o QR code do cupom</p>
          <Button className="flex w-full bg-primaria hover:bg-hover-primaria" onClick={handleOpenScanner}>
            {openScanner ? (
              <>
                <IconX />
                Fechar scanner
              </>
            ) : (
              <>
                <IconCameraFilled /> Abrir scanner
              </>
            )}
          </Button>
        </div>
        <span className="italic text-gray-400">ou</span>
        <div>
          <RegisterCupomContainer />
        </div>
      </div>
      <div
        className={clsx({
          "block absolute w-[363px] h-[328px] top-6": openScanner === true,
          hidden: openScanner === false,
        })}
      >
        <select onChange={(e) => setSelectedDevice(e.target.value)}>
          <option value="">Select a camera</option>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
        <Scanner
          onScan={(result) => createRaffle(result)}
          constraints={{
            deviceId: selectedDevice,
          }}
          components={{
            audio: true, // Play beep sound on scan
            onOff: true, // Show camera on/off button
            torch: true, // Show torch/flashlight button (if supported)
            zoom: true, // Show zoom control (if supported)
            finder: true, // Show finder overlay
            tracker: highlightCodeOnCanvas,
            facingMode: "environment", // Use rear camera
            aspectRatio: 1, // Square aspect ratio
            // Advanced constraints
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          }}
        />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-bold">Contulte seus números da sorte</h2>
        <SearchNumbers />
      </div>
    </div>
  );
}
