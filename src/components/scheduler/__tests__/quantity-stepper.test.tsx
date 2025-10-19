
import { render, fireEvent, screen } from '@testing-library/react';
import { QuantityStepper } from '../quantity-stepper';

describe('QuantityStepper', () => {
  const onValueChange = jest.fn();
  const onCommit = jest.fn();
  const onClearError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with initial value', () => {
    render(<QuantityStepper value={5} onValueChange={onValueChange} max={10} aria-labelledby="stepper-label" />);
    expect(screen.getByRole('spinbutton')).toHaveValue('5');
  });

  it('should call onValueChange when input changes', () => {
    render(<QuantityStepper value={5} onValueChange={onValueChange} max={10} aria-labelledby="stepper-label" />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '8' } });
    expect(onValueChange).toHaveBeenCalledWith(8);
  });

  it('should increment and decrement value', () => {
    render(<QuantityStepper value={5} onValueChange={onValueChange} max={10} aria-labelledby="stepper-label" />);
    const incrementButton = screen.getByLabelText('Increment value');
    const decrementButton = screen.getByLabelText('Decrement value');

    fireEvent.click(incrementButton);
    expect(onValueChange).toHaveBeenCalledWith(6);

    fireEvent.click(decrementButton);
    expect(onValueChange).toHaveBeenCalledWith(4);
  });

  it('should apply error styles when isError is true', () => {
    render(<QuantityStepper value={5} onValueChange={onValueChange} max={10} aria-labelledby="stepper-label" isError />);
    expect(screen.getByRole('spinbutton')).toHaveClass('ring-2 ring-destructive');
  });

  it('should call onClearError on focus', () => {
    render(<QuantityStepper value={5} onValueChange={onValueChange} max={10} aria-labelledby="stepper-label" isError onClearError={onClearError} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.focus(input);
    expect(onClearError).toHaveBeenCalled();
  });
});
