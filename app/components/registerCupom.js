"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IconSend } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { Modal } from "./modal";
import { useRafflesStore } from "@/store/raffles-store";
import { useRouter } from "next/navigation";
import { useCupomStore } from "@/store/cupom-store";

export function RegisterCupomContainer() {
  const router = useRouter();
  const [modalInfo, setModalInfo] = useState();
  const [open, setOpen] = useState(false);

  async function registerCupom(cupomInfo) {
    const cupom = parseInt(cupomInfo.cupom);
    const serie = parseInt(cupomInfo.serie);
    try {
      console.log(process.env.NODE_ENV);
      console.log(process.env.NEXT_PUBLIC_API_URL);
      console.log(process.env.API_URL);
      const responseResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/raffles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nfc_number: cupom,
          nfc_serie: serie,
        }),
      });
      const responseValue = await responseResult.json();
      console.log(responseValue);
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
          clearCupom();
          setCupom({
            cupom,
            serie,
          });
          return router.push("/sorteios/festival-tv/register");
        }
      }
      if (responseResult.ok) {
        const { clearRaffles, setRaffles } = useRafflesStore.getState();
        clearRaffles();
        setRaffles(responseValue);
        return router.push(`/sorteios/festival-tv/success`);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  const form = useForm({
    defaultValues: {
      cupom: "",
      serie: "",
    },
  });

  function handleSetOpen(bool) {
    setOpen(bool);
  }
  return (
    <div>
      <Modal
        info={{
          title: modalInfo?.title,
          description: modalInfo?.description,
        }}
        onSetOpen={handleSetOpen}
        open={open}
      />
      <p className="font-bold">Cadastre as informações do cupom</p>
      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(registerCupom)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="cupom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Cupom *</FormLabel>
                  <FormControl>
                    <Input placeholder="000000" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Série *</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="000" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="text-right">
              <Button type="submit" className="bg-primaria hover:bg-hover-primaria">
                Enviar <IconSend />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
