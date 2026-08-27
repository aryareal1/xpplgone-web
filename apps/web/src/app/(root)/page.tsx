import SectionHeader from '@fe/components/section-header';
import AlbumPreview from './album-preview';
import Banner from './banner';
import TodaySchedule from './today-schedule';

export default function Home() {
  return (
    <>
      <Banner />
      <div className="mx-auto flex max-w-360 flex-col gap-10 px-4 pb-16">
        <TodaySchedule />

        <AlbumPreview />

        <section id="assigments">
          <SectionHeader
            title="Tugas"
            desc="Tetap tenang! Kita pasti dapat menyelesaikan semuanya."
          />
          {/* No task data source exists in the app yet, so show an honest
              empty state instead of fake examples. */}
          <p className="text-muted-foreground border-border bg-card rounded-3xl border-2 border-dashed px-6 py-10 text-center font-bold uppercase">
            Belum ada tugas yang tercatat.
          </p>
        </section>
      </div>
    </>
  );
}
