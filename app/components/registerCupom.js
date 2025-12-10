"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";

import { createRaffleModel } from "@/app/components/models/createRaffle.model";

import { useCupomStore } from "@/store/cupom.store";
import { useRafflesStore } from "@/store/raffles.store";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSend } from "@tabler/icons-react";

import { Modal } from "@/app/components/modal";

export function RegisterCupomContainer() {
  //React Hooks
  const router = useRouter();
  const pathname = usePathname();
  const [modalInfo, setModalInfo] = useState();
  const [open, setOpen] = useState(false);

  // Zustand Stores
  const { setCupom, clearCupom } = useCupomStore();
  const { setRaffles, clearRaffles } = useRafflesStore();

  // Handle Functions
  function handleSetOpen(bool) {
    setOpen(bool);
  }

  async function handleCreateRaffle(data) {
    const createRaffleResult = await createRaffleModel(data);
    // console.log(createRaffleResult);
    if (!createRaffleResult.ok && createRaffleResult.message) {
      if (createRaffleResult.message === "Cliente não encontrado no sistema") {
        clearCupom();
        setCupom(data);
        return router.push("../sorteios/festival-tv/register");
      }
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

  const form = useForm({
    defaultValues: {
      cupom: "",
      serie: "",
    },
  });

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
          <form onSubmit={form.handleSubmit(handleCreateRaffle)} className="flex flex-col gap-4">
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
