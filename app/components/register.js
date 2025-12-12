"use client";

// React & Next hooks
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

// Interface
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSend } from "@tabler/icons-react";
import { Modal } from "@/app/components/modal";

// Models
import { createRaffleModel } from "@/app/components/models/createRaffle.model";

// Local Storage
import { useRafflesStore } from "@/store/raffles.store";
import { useCpfStore } from "@/store/cpf.store";
import { useCupomStore } from "@/store/cupom.store";

export function Register({ onLoading }) {
  const { cupom, clearCupom, setCupom } = useCupomStore();
  const { clearRaffles, setRaffles } = useRafflesStore();
  const [open, setOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [redirectPath, setRedirectPath] = useState(null);

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      cpf: "",
      telephone: "",
    },
  });

  async function handleCreateUser(data) {
    const cpf = useCpfStore.getState();
    // 1️⃣ Criar cliente
    const clientRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/raffle-clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, cpf: cpf.cpf }),
    });

    const clientData = await clientRes.json();

    if (!clientRes.ok) {
      if (clientData.message) {
        setModalInfo({
          title: "Atenção",
          description: clientData?.message,
        });
        setOpen(true);
      }
      return;
    }

    async function handleCreateRaffle(raffleData) {
      onLoading(true);
      const createRaffleResult = await createRaffleModel(raffleData, cpf.cpf);
      if (!createRaffleResult.ok && createRaffleResult.message) {
        if (createRaffleResult.message === "Cliente não encontrado no sistema") {
          onLoading(false);
          setModalInfo({
            title: "Atenção",
            description:
              "O cpf cadastrado no sistema, diverge do CPF fornecido no momento da compra, favor, confira o CPF presente no cupom fiscal...",
          });
          setOpen(true);
          clearCupom();
          setCupom(raffleData);
        }
        if (createRaffleResult.message === "Valor do cupom não atingiu o valor mínimo para participar do sorteio.") {
          setModalInfo({
            title: "Atenção",
            description: createRaffleResult.message,
          });
          setOpen(true);

          // 👉 Definir redirect após OK
          setRedirectPath("../festival-tv/coleta");
          setOpen(true);
          return;
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
        onLoading(false);

        router.push("../festival-tv/success");

        return;
      }
    }

    handleCreateRaffle(cupom);
  }

  function handleSetOpen(bool) {
    setOpen(bool);

    if (!bool && redirectPath) {
      router.push(redirectPath);
      setRedirectPath(null);
    }
  }

  return (
    <div className="mt-4">
      <Modal
        info={{
          title: modalInfo?.title,
          description: modalInfo.description,
        }}
        onSetOpen={handleSetOpen}
        open={open}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateUser)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo..." type="text" {...field} required />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>N° Telefone *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="(00) 0 0000-0000" {...field} required />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-primaria hover:bg-hover-primaria">
            Enviar <IconSend />
          </Button>
        </form>
      </Form>
    </div>
  );
}
