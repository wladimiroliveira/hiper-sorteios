import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { IconSearch } from "@tabler/icons-react";

export function SearchNumbers() {
  async function onSearchNumbers(data) {
    try {
      if (!data?.cpf) {
        return;
      }
      const responseResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/raffle-clients?cpf=${data?.cpf}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data?.cpf}`,
        },
      });
      const responseValue = await responseResult.json();
      if (responseResult.ok) {
        console.log(responseValue);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  const form = useForm({
    defaultValues: {
      cpf: "",
    },
  });
  return (
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
  );
}
