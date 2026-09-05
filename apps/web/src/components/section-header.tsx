import { cn } from '@fe/lib/utils';

export default function SectionHeader(props: {
  title: string;
  desc?: string | string[];
}) {
  const descriptions = Array.isArray(props.desc)
    ? props.desc
    : props.desc
      ? [props.desc]
      : [];

  return (
    <header className="mb-6">
      <h2 className="font-display text-foreground text-2xl font-extrabold tracking-wide uppercase md:text-3xl lg:text-4xl">
        {props.title}
      </h2>
      {descriptions.length > 0 && (
        <div className="flex flex-col">
          {descriptions.map((d, i) => (
            <p
              key={i}
              className={cn(
                'text-muted-foreground text-sm font-medium md:text-base',
                i > 0 && 'opacity-80',
              )}
            >
              {d}
            </p>
          ))}
        </div>
      )}
    </header>
  );
}
