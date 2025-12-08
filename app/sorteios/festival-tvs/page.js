"use client";

import { RegisterCupomContainer } from "@/app/components/registerCupom";
import { Button } from "@/components/ui/button";
import { useNFStore } from "@/store/nf-store";
import { useRafflesStore } from "@/store/raffles-store";
import { IconCameraFilled, IconX } from "@tabler/icons-react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import clsx from "clsx";
import { useState } from "react";

export default function Page() {
  const devices = useDevices();

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [openScanner, setOpenScanner] = useState(false);

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

  async function createRaffle(scanResult) {
    try {
      const regex = /p=([^|]+)/;
      console.log(scanResult);
      const match = scanResult[0].rawValue.match(regex);
      let nfcNumber;

      if (match?.[1]) {
        const extractedValue = match[1];
        nfcNumber = extractedValue;
        console.log("Valor extraído:", extractedValue);
      } else {
        throw new Error("Não foi possível extrair o valor.");
      }
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

  return (
    <div className="flex flex-col align-items justify-center max-w-[363px] m-auto pt-8 pb-8 gap-4">
      <div className="bg-gray-200 w-[363px] h-[328px] rounded-sm" />
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
          "block absolute w-[363px] h-[328px] top-2": openScanner === true,
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
    </div>
  );
}
