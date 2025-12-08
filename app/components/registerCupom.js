import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IconSend } from "@tabler/icons-react";
import { useForm } from "react-hook-form";

export function RegisterCupomContainer() {
  function registerCupom() {
    console.log("teste");
  }

  const form = useForm({
    defaultValues: {
      cupom: "",
      serie: "",
    },
  });
  return (
    <div>
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
