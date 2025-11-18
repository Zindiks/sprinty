import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn() - classname utility', () => {
    it('should merge multiple class strings', () => {
      const result = cn('text-red-500', 'bg-blue-500', 'p-4');
      expect(result).toBe('text-red-500 bg-blue-500 p-4');
    });

    it('should handle conditional classes (falsy values)', () => {
      const result = cn('base-class', false && 'conditional-class', 'another-class');
      expect(result).toBe('base-class another-class');
    });

    it('should handle conditional classes (truthy values)', () => {
      const result = cn('base-class', true && 'conditional-class', 'another-class');
      expect(result).toBe('base-class conditional-class another-class');
    });

    it('should merge Tailwind CSS conflicting classes correctly', () => {
      // twMerge should keep the last value for conflicting utilities
      const result = cn('p-4', 'p-8');
      expect(result).toBe('p-8'); // Should only keep p-8, not both
    });

    it('should handle Tailwind width conflicts', () => {
      const result = cn('w-full', 'w-1/2');
      expect(result).toBe('w-1/2'); // Should only keep w-1/2
    });

    it('should handle Tailwind text color conflicts', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500'); // Should only keep text-blue-500
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle null and undefined inputs', () => {
      const result = cn('base-class', null, undefined, 'another-class');
      expect(result).toBe('base-class another-class');
    });

    it('should handle array of classes', () => {
      const result = cn(['class-1', 'class-2'], 'class-3');
      expect(result).toBe('class-1 class-2 class-3');
    });

    it('should handle object notation with boolean values', () => {
      const result = cn({
        'base-class': true,
        'conditional-true': true,
        'conditional-false': false,
      });
      expect(result).toBe('base-class conditional-true');
    });

    it('should handle complex combination of inputs', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn(
        'base-class',
        { active: isActive, disabled: isDisabled },
        isActive && 'text-blue-500',
        'p-4',
      );
      expect(result).toBe('base-class active text-blue-500 p-4');
    });

    it('should remove duplicate classes', () => {
      const result = cn('text-sm', 'text-sm', 'p-4');
      expect(result).toBe('text-sm p-4');
    });

    it('should handle Tailwind responsive modifiers correctly', () => {
      const result = cn('text-sm', 'md:text-lg', 'lg:text-xl');
      expect(result).toBe('text-sm md:text-lg lg:text-xl');
    });

    it('should handle Tailwind state modifiers correctly', () => {
      const result = cn('bg-blue-500', 'hover:bg-blue-700', 'focus:bg-blue-900');
      expect(result).toBe('bg-blue-500 hover:bg-blue-700 focus:bg-blue-900');
    });

    it('should merge conflicting responsive variants', () => {
      const result = cn('p-2', 'md:p-4', 'md:p-6');
      expect(result).toBe('p-2 md:p-6'); // Should keep last md:p-6
    });
  });
});
