"use client";

import { Input } from "@/components/ui/input";

interface QuantityStepperProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onValueChange, min = 0, max }: QuantityStepperProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    if (!isNaN(numValue)) {
        if (numValue >= min && (max === undefined || numValue <= max)) {
            onValueChange(numValue);
        } else if (numValue < min) {
            onValueChange(min);
        } else if (max !== undefined && numValue > max) {
            onValueChange(max);
        }
    } else if (e.target.value === '') {
        onValueChange(min);
    }
  };


  return (
    <div className="flex items-center justify-center">
      <Input
        type="number"
        className="h-8 w-14 text-center border-0 shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        aria-label="Quantity"
      />
    </div>
  );
}
