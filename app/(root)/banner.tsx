import { motion as m, stagger, Variants } from 'motion/react';
import Image from 'next/image';

const variants = [
  {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: stagger(0.2),
      },
    },
  },
  {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1 } },
  },
] satisfies Variants[];

export default function Banner() {
  return (
    <section id="banner">
      <div className="relative h-60 sm:h-70 md:h-85 lg:h-100">
        <div className="from-background absolute z-10 h-full w-full bg-gradient-to-t to-white/50 to-60% dark:to-black/50" />
        <Image
          src="/images/banner-1.jpg"
          alt="Banner"
          fill
          className="object-cover object-bottom sm:object-[0%_68%]"
          sizes="100vw"
          priority
        />
        <m.div
          className="font-outfit relative z-20 flex h-full w-full flex-col items-center justify-center md:gap-2 lg:gap-3"
          variants={variants[0]}
          initial="hidden"
          animate="show"
        >
          <m.p variants={variants[1]} className="text-lg md:text-2xl lg:text-3xl xl:text-4xl">
            Welcome to the class of
          </m.p>
          <m.h1
            variants={variants[1]}
            className="font-slab text-3xl font-bold md:text-5xl lg:text-6xl xl:text-7xl"
          >
            X PPLG 1
          </m.h1>
          <m.p variants={variants[1]} className="text-lg md:text-2xl lg:text-3xl xl:text-4xl">
            of <b>SMK N 1 Kandeman</b>
          </m.p>
        </m.div>
      </div>
    </section>
  );
}
