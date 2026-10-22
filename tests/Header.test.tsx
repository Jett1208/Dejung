import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../src/components/Header';

describe('Header Component', () => {
  it('renders Dejung brand title and does not contain "ผู้ช่วยจัดสรรงบประมาณ"', () => {
    render(
      <Header
        isDark={true}
        onToggleTheme={vi.fn()}
        onReset={vi.fn()}
        onOpenExportImport={vi.fn()}
        onOpenSettings={vi.fn()}
      />
    );

    expect(screen.getByText('Dejung')).toBeInTheDocument();
    expect(screen.queryByText(/ผู้ช่วยจัดสรรงบประมาณ/i)).toBeNull();
    const headerElem = screen.getByRole('banner');
    expect(headerElem.className).toContain('sticky');
  });

  it('triggers onOpenSettings when settings button is clicked', () => {
    const onOpenSettings = vi.fn();
    render(
      <Header
        isDark={true}
        onToggleTheme={vi.fn()}
        onReset={vi.fn()}
        onOpenExportImport={vi.fn()}
        onOpenSettings={onOpenSettings}
      />
    );

    const settingsBtn = screen.getByLabelText('ตั้งค่าระบบ');
    fireEvent.click(settingsBtn);

    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });
});
