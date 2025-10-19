"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onValueChange, min = 0, max }: QuantityStepperProps) {
  const handleIncrement = () => {
    const newValue = value + 1;
    if (max === undefined || newValue <= max) {
      onValueChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = value - 1;
    if (newValue >= min) {
      onValueChange(newValue);
    }
  };

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
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrement"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        className="h-8 w-12 text-center border-0 shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        aria-label="Quantity"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleIncrement}
        disabled={max !== undefined && value >= max}
        aria-label="Increment"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
