'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    const [checked, setChecked] = React.useState(
      props.defaultChecked || props.checked || false,
    );

    React.useEffect(() => {
      if (props.checked !== undefined) {
        setChecked(props.checked);
      }
    }, [props.checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      setChecked(newChecked);
      onCheckedChange?.(newChecked);
      props.onChange?.(e);
    };

    return (
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className="peer absolute h-full w-full cursor-pointer opacity-0"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all duration-300',
            checked
              ? 'border-orange-500 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)] dark:border-orange-500 dark:bg-orange-500'
              : 'border-neutral-300 bg-white/50 backdrop-blur-sm peer-hover:border-orange-300 dark:border-neutral-700 dark:bg-neutral-900/50',
            className,
          )}
        >
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
