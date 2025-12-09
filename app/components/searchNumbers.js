"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "./modal";

export function SearchNumbers() {
  const [clientRaffles, setClientRaffles] = useState();
  const [open, setOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const router = useRouter();
  async function onSearchNumbers(data) {
    try {
      if (!data?.cpf) {
        return;
      }
      const responseResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/raffles?cpf=${data?.cpf}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data?.cpf}`,
        },
      });
      const responseValue = await responseResult.json();
      if (responseResult.ok) {
        return setClientRaffles(responseValue);
      }
      if (!responseResult.ok && responseResult.status === 404) {
        setModalInfo({
          title: "Atenção",
          description: "Nenhum número da sorte foi cadastrado neste CPF",
        });
        setOpen(true);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  function handleSetOpen(bool) {
    setOpen(bool);
  }

  const form = useForm({
    defaultValues: {
      cpf: "",
    },
  });
  return (
    <div className="">
      <Modal
        info={{
          title: modalInfo?.title,
          description: modalInfo.description,
        }}
        onSetOpen={handleSetOpen}
        open={open}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSearchNumbers)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="000.000.000-00" {...field} required />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="flex w-full bg-primaria hover:bg-hover-primaria">
            <IconSearch />
            Consultar
          </Button>
        </form>
      </Form>
      <div className="flex flex-col gap-2 pt-4 align-center justify-center">
        {clientRaffles ? <h3 className="text-center font-semibold">Este são seus números da sorte</h3> : ""}
        <div>
          {clientRaffles ? (
            clientRaffles.map((raffle) => <span className="block text-center">{raffle.raffle_number}</span>)
          ) : (
            <span>...</span>
          )}
        </div>
      </div>
    </div>
  );
}
