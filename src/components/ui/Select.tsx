import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/utils/cn';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  className?: string;
  disabled?: boolean;
  error?: string;
  id: string;
  label: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
}

/**
 * Wrapper de Radix Select para mantener una API consistente con el resto
 * del sistema de UI (label, error y estilos compartidos light/dark).
 */
export const Select = ({
  className,
  disabled = false,
  error,
  id,
  label,
  onValueChange,
  options,
  placeholder,
  value,
}: SelectProps) => {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-surface-700 dark:text-surface-100/80" htmlFor={id}>
      <span>{label}</span>
      <RadixSelect.Root disabled={disabled} onValueChange={onValueChange} value={value}>
        <RadixSelect.Trigger
          aria-invalid={Boolean(error)}
          className={cn(
            'inline-flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-2.5 text-sm text-surface-900 shadow-sm outline-none transition-[background-color,border-color,color,box-shadow] duration-300 ease-in-out data-[placeholder]:text-surface-700/60 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:bg-surface-900 dark:text-surface-100 dark:data-[placeholder]:text-surface-100/45 dark:focus:ring-primary-500/30',
            error ? 'border-danger focus:border-danger focus:ring-red-100 dark:focus:ring-red-500/30' : 'border-surface-200 dark:border-surface-700',
            className,
          )}
          id={id}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="text-surface-700 dark:text-surface-100/70">
            <ChevronDown className="h-4 w-4" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 overflow-hidden rounded-2xl border border-surface-200 bg-white p-1 shadow-panel transition-[background-color,border-color,color,box-shadow] duration-300 ease-in-out dark:border-surface-700 dark:bg-surface-900"
            position="popper"
            sideOffset={8}
          >
            {/* Igualamos el ancho del panel al trigger para evitar saltos
                visuales cuando se abre el desplegable. */}
            <RadixSelect.Viewport className="max-h-64 min-w-[var(--radix-select-trigger-width)]">
              {options.map((option) => (
                <RadixSelect.Item
                  className="relative flex cursor-pointer select-none items-center rounded-xl py-2 pl-9 pr-8 text-sm text-surface-800 outline-none transition focus:bg-primary-50 focus:text-primary-700 data-[state=checked]:bg-primary-50 data-[state=checked]:text-primary-700 dark:text-surface-100 dark:focus:bg-primary-900/40 dark:focus:text-primary-100 dark:data-[state=checked]:bg-primary-900/40 dark:data-[state=checked]:text-primary-100"
                  key={option.value}
                  value={option.value}
                >
                  <RadixSelect.ItemIndicator className="absolute left-3 inline-flex items-center text-primary-600 dark:text-primary-200">
                    <Check className="h-4 w-4" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
};
