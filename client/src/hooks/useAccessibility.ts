import { useEffect, useState } from 'react';

interface AccessibilityPreferences {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersColorScheme: 'light' | 'dark' | null;
}

export const useAccessibility = (): AccessibilityPreferences => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersColorScheme: null,
  });

  useEffect(() => {
    // Check if running in browser
    if (typeof window === 'undefined') return;

    // Reduced motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = () => {
      setPreferences((prev) => ({
        ...prev,
        prefersReducedMotion: reducedMotionQuery.matches,
      }));
    };
    updateReducedMotion();
    reducedMotionQuery.addEventListener('change', updateReducedMotion);

    // High contrast
    const highContrastQuery = window.matchMedia(
      '(prefers-contrast: high), (forced-colors: active)',
    );
    const updateHighContrast = () => {
      setPreferences((prev) => ({
        ...prev,
        prefersHighContrast: highContrastQuery.matches,
      }));
    };
    updateHighContrast();
    highContrastQuery.addEventListener('change', updateHighContrast);

    // Color scheme
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateColorScheme = () => {
      setPreferences((prev) => ({
        ...prev,
        prefersColorScheme: colorSchemeQuery.matches ? 'dark' : 'light',
      }));
    };
    updateColorScheme();
    colorSchemeQuery.addEventListener('change', updateColorScheme);

    return () => {
      reducedMotionQuery.removeEventListener('change', updateReducedMotion);
      highContrastQuery.removeEventListener('change', updateHighContrast);
      colorSchemeQuery.removeEventListener('change', updateColorScheme);
    };
  }, []);

  return preferences;
};

// Hook for screen reader announcements
export const useScreenReaderAnnouncement = () => {
  const [announcement, setAnnouncement] = useState<string>('');

  const announce = (message: string, _priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement('');
    // Small delay to ensure screen readers pick up the change
    setTimeout(() => {
      setAnnouncement(message);
    }, 100);
  };

  return { announcement, announce };
};

// Hook for managing focus trap (useful for modals)
export const useFocusTrap = (isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = document.querySelectorAll(focusableSelector);
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);
};

// Hook for accessible form validation
export const useFormAccessibility = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { announce } = useScreenReaderAnnouncement();

  const setError = (field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
    announce(`Error: ${message}`, 'assertive');
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return { errors, setError, clearError, clearAllErrors };
};

// Get ARIA label for action
export const getActionAriaLabel = (action: string, context?: string) => {
  const labels: Record<string, string> = {
    edit: `Edit ${context || 'item'}`,
    delete: `Delete ${context || 'item'}`,
    save: `Save ${context || 'changes'}`,
    cancel: `Cancel ${context || 'editing'}`,
    add: `Add ${context || 'item'}`,
    remove: `Remove ${context || 'item'}`,
    upload: `Upload ${context || 'file'}`,
    download: `Download ${context || 'file'}`,
    close: `Close ${context || 'dialog'}`,
  };

  return labels[action] || `${action} ${context || ''}`.trim();
};
