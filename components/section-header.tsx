export default function SectionHeader(props: { color: string; title: string; desc: string }) {
  return (
    <header className="mb-3 grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-2">
      <div className={`row-span-2 ${props.color} w-2 rounded`} />
      <h2 className="font-outfit text-lg font-bold md:text-xl lg:text-2xl">{props.title}</h2>
      <p className="font-outfit text-sm text-gray-600 lg:text-base dark:text-gray-400">
        {props.desc}
      </p>
    </header>
  );
}
