"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { IconSend } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useNFStore } from "@/store/nf-store";
import { useRafflesStore } from "@/store/raffles-store";
import { useRouter } from "next/navigation";

export function Register() {
  const { nf, clearNF, setNF } = useNFStore();
  const { clearRaffles, setRaffles } = useRafflesStore();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      cpf: "",
      telephone: "",
    },
  });

  async function createUser(data) {
    console.log("Dados enviados: ", data);
    console.log("NF armazenada: ", nf);

    // 1️⃣ Criar cliente
    const clientRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/raffle-clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const clientData = await clientRes.json();

    if (!clientRes.ok) {
      console.error(clientData?.message);
      return;
    }

    // 2️⃣ Criar rifa
    const raffleRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/raffles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nfc_key: nf }),
    });

    const raffleData = await raffleRes.json();

    if (!raffleRes.ok) {
      if (raffleData?.message === "Cliente não encontrado no sistema") {
        clearNF();
        setNF(nf);
        return router.push("/festival-tvs/register");
      }

      console.error(raffleData?.message);
      return;
    }

    // 3️⃣ Salvar dados da rifa e redirecionar
    clearRaffles();
    setRaffles(raffleData);

    return router.push("success");
  }

  return (
    <div className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createUser)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo *</FormLabel>
                <FormControl>
                  <Input placeholder="nome completo..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF *</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="000.000.000-00" {...field} />
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
                  <Input type="text" placeholder="(00) 0 0000-0000" {...field} />
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
