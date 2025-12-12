"use client";

import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { Regex } from "../services/regex.service";
import { createRaffleModel } from "./createRaffle.model";
import { useState } from "react";
import { Modal } from "../modal";
import { Button } from "@/components/ui/button";
import { IconCameraFilled, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { useCpfStore } from "@/store/cpf.store";

export function ScannerModel({ openScanner, onOpenScanner, onLoading }) {
  const [redirectPath, setRedirectPath] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalInfo, setModalInfo] = useState({});
  const [open, setOpen] = useState(false);

  function handleSetOpen(bool) {
    setOpen(bool);

    if (!bool && redirectPath) {
      console.log(redirectPath);
      router.push(redirectPath);
      setRedirectPath(null);
    }
  }

  function handleOpenScanner() {
    if (openScanner === true) {
      onOpenScanner(false);
      return;
    }
    onOpenScanner(true);
  }

  const highlightCodeOnCanvas = (detectedCodes, ctx) => {
    detectedCodes.forEach((detectedCode) => {
      const { boundingBox, cornerPoints } = detectedCode;
      // Draw bounding box
      ctx.strokeStyle = "#02735E";
      ctx.lineWidth = 4;
      ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);

      // Draw corner points
      ctx.fillStyle = "#0CF25D";
      cornerPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };
  const devices = useDevices();

  async function handleCreateRaffle(data) {
    onLoading(true);
    const cpf = useCpfStore.getState();
    const dataValue = Regex(/p=([^|]+)/, data[0].rawValue);
    const createRaffleResult = await createRaffleModel(dataValue, cpf.cpf);
    if (!createRaffleResult.ok && createRaffleResult.message) {
      if (createRaffleResult.message === "Cliente não encontrado no sistema") {
        clearCupom();
        setCupom(data);
        return router.push("../sorteios/festival-tv/register");
      }
      if (createRaffleResult.message === "CPF inválido!") {
        setModalInfo({
          title: "Atenção",
          description: createRaffleResult.message,
        });

        setRedirectPath("../sorteios/festival-tv");
        setOpen(true);
        return;
      }

      onLoading(false);
      setModalInfo({
        title: "Atenção",
        description: createRaffleResult.message,
      });
      setOpen(true);
    }
    if (createRaffleResult.ok) {
      clearRaffles();
      setRaffles(createRaffleResult?.raffles);
      return router.push("../sorteios/festival-tv/success");
    }
  }

  return (
    <div>
      <div
        className={clsx({
          "flex flex-col items-center max-w-[363px] max-h-[328px]": openScanner === true,
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
        {openScanner && (
          <Scanner
            onScan={(result) => handleCreateRaffle(result)}
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
        )}
      </div>
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
      <Modal
        info={{
          title: modalInfo?.title,
          description: modalInfo?.description,
        }}
        onSetOpen={handleSetOpen}
        open={open}
      />
    </div>
  );
}
