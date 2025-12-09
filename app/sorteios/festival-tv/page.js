"use client";

import { Modal } from "@/app/components/modal";
import { RegisterCupomContainer } from "@/app/components/registerCupom";
import { Button } from "@/components/ui/button";
import { useNFStore } from "@/store/nf-store";
import { useRafflesStore } from "@/store/raffles-store";
import { IconCameraFilled, IconX } from "@tabler/icons-react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import clsx from "clsx";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

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

  async function createRaffle(scanResult) {
    try {
      console.log(process.env.NODE_ENV);
      console.log(process.env.NEXT_PUBLIC_API_URL);
      console.log(process.env.API_URL);
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
      const responseResult = await fetch(`https://api.hipersenna.com/raffles`, {
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
          setModalInfo({
            title: "Atenção",
            description: responseValue?.message,
          });
          setOpen(true);
        }
        if (responseValue?.message === "CPF não encontrado no cupom fiscal.") {
          setModalInfo({
            title: "Atenção",
            description: responseValue?.message,
          });
          setOpen(true);
        }
        if (responseValue?.message === "Já existem rifas cadastradas para esse cupom") {
          setModalInfo({
            title: "Atenção",
            description: responseValue?.message,
          });
          setOpen(true);
        }
        if (responseValue?.message === "Cliente não encontrado no sistema") {
          const { clearCupom, setCupom } = useCupomStore.getState();
          const { clearNF, setNF } = useNFStore.getState();
          clearNF();
          setNF(nfcNumber);
          clearCupom();
          setCupom({
            cupom,
            serie,
          });
          return redirect("/register");
        }
      }
      if (responseResult.ok) {
        const { clearRaffles, setRaffles } = useRafflesStore.json();
        clearRaffles();
        setRaffles(responseValue);
        return redirect("/success ");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  function handleSetOpen(bool) {
    setOpen(bool);
  }

  return (
    <div className="flex flex-col align-items justify-center max-w-[363px] m-auto pt-8 pb-8 gap-4">
      <Modal
        info={{
          title: modalInfo?.title,
          description: modalInfo?.description,
        }}
        onSetOpen={handleSetOpen}
        open={open}
      />
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
    </div>
  );
}
