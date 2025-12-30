"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLanguage } from "@/app/context/languageContext";

import {
  customerInfoSchema,
  CustomerInfo,
} from "@/lib/validations/admin-cart.types";
import { createAdminCustomerCheckoutSession } from "@/lib/actions/admin-actions/admin-customer-checkout";
interface CustomerInfoFormProps {
  cartId: string;
  onBack: () => void;
}

export default function CustomerInfoForm({
  cartId,
  onBack,
}: CustomerInfoFormProps) {
  const { locale } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
    },
  });

  const onSubmit = async (data: CustomerInfo) => {
    setIsSubmitting(true);

    try {
      const result = await createAdminCustomerCheckoutSession(cartId, data);

      if (result.success && result.sessionUrl) {
        toast(locale === "pt" ? "Redirecionando para pagamento..." : "Redirecting to payment...");
        // Redirect to Stripe Checkout
        window.location.href = result.sessionUrl;
      } else {
        toast.error(locale === "pt" ? "Falha ao criar sessão de checkout" : "Failed to create checkout session");

        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(locale === "pt" ? "Ocorreu um erro inesperado" : "An unexpected error occurred");

      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {locale === "pt" ? "Voltar ao Carrinho" : "Back to Cart"}
            </Button>
          </div>
          <CardTitle>{locale === "pt" ? "Informações do Cliente" : "Customer Information"}</CardTitle>
          <CardDescription>
            {locale === "pt" 
              ? "Digite os detalhes do cliente para concluir o pedido"
              : "Enter customer details to complete the order"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === "pt" ? "Nome Completo *" : "Full Name *"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={locale === "pt" ? "João Silva" : "John Doe"}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === "pt" ? "Endereço de Email *" : "Email Address *"}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === "pt" ? "Número de Telefone *" : "Phone Number *"}</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder={locale === "pt" ? "+351912345678" : "+1234567890"}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === "pt" ? "Endereço *" : "Address *"}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={locale === "pt" 
                          ? "Rua Principal, 123, Cidade, Código Postal, País"
                          : "123 Main St, City, State, ZIP, Country"}
                        rows={4}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {locale === "pt" ? "Cancelar" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {locale === "pt" ? "Processando..." : "Processing..."}
                    </>
                  ) : (
                    locale === "pt" ? "Continuar para Pagamento" : "Continue to Payment"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
