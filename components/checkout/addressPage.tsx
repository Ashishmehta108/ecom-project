import { Address } from "@/lib/types/address.types";
import { Card, CardContent } from "../ui/card";
import { Check } from "lucide-react";

export function AddressCard({
    address,
    isSelected,
    onClick,
  }: {
    address: Address;
    isSelected: boolean;
    onClick: () => void;
  }) {
    return (
      <Card
        onClick={onClick}
        className={`relative cursor-pointer transition border-2 ${
          isSelected
            ? "border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
            : "border-neutral-200 dark:border-neutral-800"
        }`}
      >
        <CardContent className="p-3 sm:p-4 text-sm sm:text-base">
          {isSelected && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-neutral-900 dark:bg-neutral-50 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white dark:text-neutral-900" />
            </div>
          )}
  
          <h3 className="font-semibold">{address.fullName || "Unnamed User"}</h3>
          <p>{address.line1 || "Address missing"}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p className="text-xs mt-1 opacity-70">{address.phone}</p>
        </CardContent>
      </Card>
    );
  }