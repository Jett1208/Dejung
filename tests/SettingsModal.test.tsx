import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsModal } from '../src/components/SettingsModal';
import { DEFAULT_APP_SETTINGS } from '../src/hooks/useAppSettings';

describe('SettingsModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <SettingsModal
        isOpen={false}
        onClose={vi.fn()}
        settings={DEFAULT_APP_SETTINGS}
        onUpdateSetting={vi.fn()}
        onResetSettings={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders modal content and triggers toggles when clicked', () => {
    const onUpdate = vi.fn();
    const onClose = vi.fn();
    const onReset = vi.fn();

    render(
      <SettingsModal
        isOpen={true}
        onClose={onClose}
        settings={DEFAULT_APP_SETTINGS}
        onUpdateSetting={onUpdate}
        onResetSettings={onReset}
      />
    );

    expect(screen.getByText('ตั้งค่าระบบ (Settings)')).toBeInTheDocument();

    const switches = screen.getAllByRole('switch');
    expect(switches).toHaveLength(4);

    // Toggle animation setting (switch 0)
    fireEvent.click(switches[0]);
    expect(onUpdate).toHaveBeenCalledWith('enableAnimations', false);

    // Toggle savings goal setting (switch 1)
    fireEvent.click(switches[1]);
    expect(onUpdate).toHaveBeenCalledWith('showSavingsGoal', false);

    // Toggle categories list (switch 2)
    fireEvent.click(switches[2]);
    expect(onUpdate).toHaveBeenCalledWith('showCategories', false);

    // Click reset to defaults
    const resetBtn = screen.getByText('คืนค่าเริ่มต้น');
    fireEvent.click(resetBtn);
    expect(onReset).toHaveBeenCalledTimes(1);

    // Click finish/close
    const finishBtn = screen.getByText('เสร็จสิ้น');
    fireEvent.click(finishBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
