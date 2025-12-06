import { Button } from "@/components/ui/button";
import { IconCameraFilled, IconSend } from "@tabler/icons-react";

export function Scanner({ openScanner, sendNfc, nfcNumber }) {
  return (
    <div className="mt-6 mb-6">
      <label htmlFor="scan">Escanear cupom *</label>
      <Button className="flex w-full bg-primaria hover:bg-hover-primaria" onClick={openScanner}>
        <IconCameraFilled />
        Abrir scanner
      </Button>
      <span className="text-sm italic text-terciaria">{nfcNumber ? nfcNumber : "Nenhum cupom escaneado"}</span>
      <div className="text-right">
        <Button className="bg-primaria cursor-pointer hover:bg-hover-primaria" onClick={sendNfc}>
          Enviar
          <IconSend />
        </Button>
      </div>
    </div>
  );
}
