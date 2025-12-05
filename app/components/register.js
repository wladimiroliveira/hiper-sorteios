"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { IconSend } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export function Register() {
  const form = useForm();
  return (
    <div className="mt-4">
      <Form {...form}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="namer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-terciaria">Nome completo *</FormLabel>
                <FormControl>
                  <Input placeholder="nome completo..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="namer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-terciaria">CPF *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="000.000.000-00" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-terciaria">N° Telefone *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="(00) 0 0000-0000" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="bg-primaria cursor-pointer hover:bg-hover-primaria">
            Enviar
            <IconSend />
          </Button>
        </div>
      </Form>
    </div>
  );
}
