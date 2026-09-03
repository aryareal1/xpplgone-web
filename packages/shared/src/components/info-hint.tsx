'use client';

import { InfoIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';

/**
 * Explains what a number means. Controlled open so a tap works on touch, where
 * Radix's hover trigger never fires.
 */
export function InfoHint({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`Info: ${label}`}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center self-center leading-none text-muted-foreground transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none dark:hover:text-foreground"
        >
          <InfoIcon className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-64 leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
