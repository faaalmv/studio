
"use client";

import { useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @typedef {object} QuantityStepperProps
 * @property {number} value - The current value of the stepper.
 * @property {(value: number) => void} onValueChange - Callback triggered when the value changes.
 * @property {() => void} [onCommit] - Callback triggered on blur or Enter key press.
 * @property {number} max - The maximum allowed value.
 * @property {string} aria-labelledby - The ID of the element that labels the stepper.
 */
interface QuantityStepperProps {
  value: number;
  onValueChange: (value: number) => void;
  onCommit?: () => void;
  max: number;
  'aria-labelledby': string;
}

/**
 * A customizable quantity stepper component.
 * @param {QuantityStepperProps} props - The component props.
 * @returns {JSX.Element} The rendered quantity stepper.
 */
export function QuantityStepper({ value, onValueChange, onCommit, max, 'aria-labelledby': ariaLabelledby }: QuantityStepperProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
    const numericValue = sanitizedValue === '' ? 0 : parseInt(sanitizedValue, 10);
    onValueChange(numericValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<H