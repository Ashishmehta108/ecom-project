"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/admin/AdminProductPanel";
import { ProductFormValues } from "@/lib/validations/product-schema";
import { useLanguage } from "@/app/context/languageContext";

export const SpecsTab: React.FC = () => {
  const form = useFormContext<ProductFormValues>();
  const { locale, setLocale } = useLanguage();

  const { control } = form;

  const generalPairs = useFieldArray({
    control,
    name: "specifications.general",
  });

  const technicalPairs = useFieldArray({
    control,
    name: "specifications.technical",
  });

  // Renders any dynamic KEY–VALUE pair array (general/technical) with multilingual values
  const renderPairBlock = (
    fields: { id: string }[],
    remove: (i: number) => void,
    nameBase: string
  ) =>
    fields.map((f, idx) => (
      <Card key={f.id} className="p-4 shadow-sm border rounded-xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* KEY */}
            <FormField
              control={control}
              name={`${nameBase}.${idx}.key` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-9" placeholder="e.g. Brand" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* REMOVE BUTTON */}
            <div className="flex items-end">
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="h-9 w-full"
                onClick={() => remove(idx)}
              >
                Remove
              </Button>
            </div>
          </div>

          {/* VALUE - Multilingual */}
          <div className="space-y-2">
            <FormLabel>Value</FormLabel>
            <Tabs value={locale} onValueChange={setLocale} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="pt">Português</TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="mt-2">
                <FormField
                  control={control}
                  name={`${nameBase}.${idx}.value.en` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="h-9" placeholder="e.g. Apple" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="pt" className="mt-2">
                <FormField
                  control={control}
                  name={`${nameBase}.${idx}.value.pt` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="h-9" placeholder="ex: Maçã" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Card>
    ));

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Product Specifications"
        description="Add all specification fields for this product"
      />

      {/* GENERAL SPECIFICATIONS */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">General Specifications</h3>

        {renderPairBlock(
          generalPairs.fields,
          generalPairs.remove,
          "specifications.general"
        )}

        <Button
          type="button"
          size="sm"
          className="h-9"
          onClick={() => generalPairs.append({ key: "", value: { en: "", pt: "" } })}
        >
          + Add General Field
        </Button>
      </div>

      {/* TECHNICAL SPECIFICATIONS */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Technical Specifications</h3>

        {renderPairBlock(
          technicalPairs.fields,
          technicalPairs.remove,
          "specifications.technical"
        )}

        <Button
          type="button"
          size="sm"
          className="h-9"
          onClick={() => technicalPairs.append({ key: "", value: { en: "", pt: "" } })}
        >
          + Add Technical Field
        </Button>
      </div>
    </div>
  );
};
