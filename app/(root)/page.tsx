'use client';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Image from 'next/image';
import { motion as m, stagger, Variants } from 'motion/react';
import Banner from './banner';
import SectionHeader from '@/components/section-header';

const variants = {
  albumImage: [
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
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 },
    },
  ],
} satisfies Record<string, Variants[]>;

export default function Home() {
  return (
    <>
      <Banner />
      <div className="mx-auto flex max-w-[90rem] flex-col gap-8 px-4">
        <section id="pictures">
          <SectionHeader
            color="bg-indigo-500"
            title="Album"
            desc="Foto kita adalah kenangan kita di masa lampau. Bernostalgialah!"
          />
          <m.div
            variants={variants.albumImage[0]}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Carousel>
              <CarouselContent>
                {['/images/banner-1.jpg', '/images/banner-2.jpg'].map((img, i) => (
                  <CarouselItem key={i} className="basis-1/3 md:basis-1/5 lg:basis-1/6">
                    <m.div variants={variants.albumImage[1]}>
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={img}
                          alt={`Image #${i + 1}`}
                          fill
                          className="rounded-lg object-cover object-center"
                          sizes="(max-width: 768px) 33vw, (max-width: 1024px) 20vw, 16vw"
                        />
                      </AspectRatio>
                    </m.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </m.div>
        </section>

        <section id="assigments">
          <SectionHeader
            color="bg-emerald-700"
            title="Tugas"
            desc="Tetap tenang! Kita pasti dapat menyelesaikan semuanya."
          />
          <div></div>
        </section>
        {/* <div className="bg-white h-500" /> */}
      </div>
    </>
  );
}
