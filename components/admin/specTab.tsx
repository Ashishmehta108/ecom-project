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
import { SectionHeader } from "@/components/admin/AdminProductPanel";
import { ProductFormValues } from "@/lib/validations/product-schema";

export const TSpecsTab: React.FC = () => {
  const form = useFormContext<ProductFormValues>();
  const { control } = form;

  const generalPairs = useFieldArray({
    control,
    name: "specifications.general",
  });

  const technicalPairs = useFieldArray({
    control,
    name: "specifications.technical",
  });

  const renderPairBlock = (
    fields: any[],
    remove: (i: number) => void,
    nameBase: string
  ) =>
    fields.map((f, idx) => (
      <Card key={f.id} className="p-4 shadow-sm border rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* KEY */}
          <FormField
            control={control}
            name={`${nameBase}.${idx}.key`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key</FormLabel>
                <FormControl>
                  <Input {...field} className="h-9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* VALUE */}
          <FormField
            control={control}
            name={`${nameBase}.${idx}.value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input {...field} className="h-9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* REMOVE BUTTON */}
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="mt-6 h-9"
            onClick={() => remove(idx)}
          >
            Remove
          </Button>
        </div>
      </Card>
    ));

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Product Specifications"
        description="Add all specification fields for this product"
      />

      {/* ------------------------------ GENERAL ------------------------------ */}
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
          onClick={() => generalPairs.append({ key: "", value: "" })}
        >
          + Add General Field
        </Button>
      </div>

      {/* ------------------------------ TECHNICAL ------------------------------ */}
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
          onClick={() => technicalPairs.append({ key: "", value: "" })}
        >
          + Add Technical Field
        </Button>
      </div>
    </div>
  );
};
