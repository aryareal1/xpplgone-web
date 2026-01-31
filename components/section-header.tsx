import { cn } from '@/lib/utils';

export default function SectionHeader(props: {
  color: string;
  title: string;
  desc: string | string[];
}) {
  const descriptions = Array.isArray(props.desc) ? props.desc : [props.desc];

  return (
    <header className="mb-6 flex items-center gap-4">
      <div className={cn('h-16 w-2 rounded-full', props.color)} />
      <div>
        <h2 className="font-outfit text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl dark:text-white">
          {props.title}
        </h2>
        <div className="flex flex-col">
          {descriptions.map((d, i) => (
            <p
              key={i}
              className={cn(
                'font-outfit text-sm font-medium md:text-base',
                i === 0
                  ? 'text-slate-600 dark:text-slate-400'
                  : 'text-slate-500 dark:text-slate-500'
              )}
            >
              {d}
            </p>
          ))}
        </div>
      </div>
    </header>
  );
}
