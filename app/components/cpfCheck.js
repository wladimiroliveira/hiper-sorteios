"use client";

// React & Next hooks
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

// Interface
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconLogin } from "@tabler/icons-react";
import { Modal } from "@/app/components/modal";

// Local Storage
import { useCpfStore } from "@/store/cpf.store";

export function CheckCpf({ onLoading }) {
  const [open, setOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      cpf: "",
    },
  });

  const { setCpf, clearCpf } = useCpfStore.getState();

  async function handleCollectCpf(data) {
    try {
      onLoading(true);
      clearCpf();
      setCpf(data);
      router.push("../sorteios/festival-tv/coleta");
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      onLoading(false);
    }
  }

  function handleSetOpen(bool) {
    setOpen(bool);
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
        <form onSubmit={form.handleSubmit(handleCollectCpf)} className="flex flex-col gap-4">
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

          <Button type="submit" className="bg-primaria cursor-pointer hover:bg-hover-primaria">
            Acessar <IconLogin />
          </Button>
        </form>
      </Form>
    </div>
  );
}
