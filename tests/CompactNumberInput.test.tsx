import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CompactNumberInput } from '../src/components/CompactNumberInput';

describe('CompactNumberInput Component', () => {
  it('displays empty string when value is 0 and shows placeholder', () => {
    render(
      <CompactNumberInput
        value={0}
        onChange={vi.fn()}
        placeholder="กรอกจำนวนเงิน"
        unit="บาท"
      />
    );

    const input = screen.getByPlaceholderText('กรอกจำนวนเงิน') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(screen.getByText('บาท')).toBeInTheDocument();
  });

  it('displays compact formatted text when blurred and raw digits when focused', () => {
    const { rerender } = render(
      <CompactNumberInput
        value={150000}
        onChange={vi.fn()}
        placeholder="0"
      />
    );

    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    // Blurred: displays 150k
    expect(input.value).toBe('150k');

    // Focused: displays raw 150000
    fireEvent.focus(input);
    expect(input.value).toBe('150000');

    // Blurred again: returns to compact 150k
    fireEvent.blur(input);
    expect(input.value).toBe('150k');

    // Value below 100k
    rerender(
      <CompactNumberInput
        value={25000}
        onChange={vi.fn()}
        placeholder="0"
      />
    );
    expect(input.value).toBe('25,000');
  });

  it('triggers onChange with parsed numeric values while typing', () => {
    const handleChange = vi.fn();
    render(
      <CompactNumberInput
        value={0}
        onChange={handleChange}
        placeholder="0"
      />
    );

    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '250000' } });

    expect(handleChange).toHaveBeenCalledWith(250000);
  });

  it('enforces min constraint on blur', () => {
    const handleChange = vi.fn();
    render(
      <CompactNumberInput
        value={0}
        onChange={handleChange}
        placeholder="0"
        min={1}
      />
    );

    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.blur(input);

    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it('shows tooltip title with full currency', () => {
    render(
      <CompactNumberInput
        value={150000}
        onChange={vi.fn()}
      />
    );

    const input = screen.getByTitle('฿150,000 บาท');
    expect(input).toBeInTheDocument();
  });
});
