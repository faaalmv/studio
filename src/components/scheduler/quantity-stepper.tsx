"use client";

import { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  onValueChange: (value: number) => void;
  max: number;
  dailyTotal: number;
}

export function QuantityStepper({ value, onValueChange, max, dailyTotal }: QuantityStepperProps) {
  const [internalValue, setInternalValue] = useState<string>(value === 0 ? '' : String(value));
  const { toast } = useToast();

  useEffect(() => {
    const externalValueStr = value === 0 ? '' : String(value);
    if (externalValueStr !== internalValue) {
      setInternalValue(externalValueStr);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
    setInternalValue(sanitizedValue);
  };

  const handleCommit = useCallback(() => {
    const newNumericValue = internalValue === '' ? 0 : parseInt(internalValue, 10);
    const otherMealsTotal = dailyTotal - value;
    const maxForThisInput = max - otherMealsTotal;

    if (newNumericValue > maxForThisInput) {
      toast({
        title: "Límite Diario Excedido",
        description: `El total para este día no puede superar ${max}.`,
        variant: "destructive",
      });
      const clampedValue = Math.max(0, maxForThisInput);
      setInternalValue(String(clampedValue));
      if (clampedValue !== value) {
        onValueChange(clampedValue);
      }
    } else if (newNumericValue !== value) {
      onValueChange(newNumericValue);
    }
  }, [internalValue, dailyTotal, value, max, onValueChange, toast]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommit();
      e.currentTarget.blur();
    }
  };

  const handleStep = useCallback((amount: number) => {
    const currentNumericValue = value || 0;
    const potentialNewValue = Math.max(0, currentNumericValue + amount);
    const otherMealsTotal = dailyTotal - value;

    if (otherMealsTotal + potentialNewValue > max) {
       toast({
        title: "Límite Diario Excedido",
        description: `El total para este día no puede superar ${max}.`,
        variant: "destructive",
      });
      const clampedValue = max - otherMealsTotal;
       if (clampedValue !== value) {
         onValueChange(clampedValue);
       }
    } else {
        onValueChange(potentialNewValue);
    }
  }, [value, dailyTotal, max, onValueChange, toast]);

  return (
    <div className="group relative flex items-center justify-center w-full h-full transition-transform duration-150 ease-in-out focus-within:z-10 focus-within:scale-110">
      <Input
        type="text"
        pattern="[0-9]*"
        inputMode="numeric"
        value={internalValue}
        onChange={handleInputChange}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-full w-full rounded-none border-0 p-2 pr-5 text-center text-sm shadow-none transition-all duration-150 [appearance:textfield] focus:bg-primary/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0",
          "placeholder:text-muted-foreground/50",
          "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
          { "font-semibold text-primary": value > 0 }
        )}
        placeholder="0"
      />
      <div className="absolute right-0.5 top-0 bottom-0 flex flex-col items-center justify-center w-5">
        <button 
          onClick={() => handleStep(1)}
          className="h-1/2 w-full text-slate-400 hover:text-slate-800 transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center justify-center"
          aria-label="Increment value"
          tabIndex={-1}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button 
          onClick={() => handleStep(-1)} 
          disabled={!value || value <= 0}
          className="h-1/2 w-full text-slate-400 hover:text-slate-800 transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Decrement value"
          tabIndex={-1}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
