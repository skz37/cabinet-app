import { cn } from '@/lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';

// MediFlow type scale (« Design tokens » board). Default = Corps 16/24.
const textVariants = cva(
  cn(
    'text-foreground text-body font-normal',
    Platform.select({
      web: 'select-text',
    })
  ),
  {
    variants: {
      variant: {
        default: '',
        /** Display 32/38 · 800 — « Bonjour, Amina » */
        display: 'text-display font-extrabold',
        /** Titre 1 24/30 · 700 — screen titles */
        h1: 'text-title-1 font-bold',
        /** Titre 2 20/26 · 700 — section titles */
        h2: 'text-title-2 font-bold',
        /** Titre 3 17/24 · 600 — card titles, doctor names */
        h3: 'text-title-3 font-semibold',
        /** Secondaire 14/20 · 500 — dates, hints */
        caption: 'text-caption text-muted-foreground font-medium',
        /** Chip 13/16 · 700 */
        chip: 'text-chip font-bold',
        code: 'bg-muted rounded-sm px-1 font-mono text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  display: 'heading',
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  code: Platform.select({ web: 'code' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  display: '1',
  h1: '1',
  h2: '2',
  h3: '3',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext };
