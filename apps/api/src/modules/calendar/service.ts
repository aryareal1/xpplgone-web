const HOLIDAYS_API = 'https://api-hari-libur.vercel.app/api';

export const Calendar = {
  /** Indonesian public holidays for a year, proxied from the hari-libur API. */
  async getHolidays(year: string) {
    const res = await fetch(`${HOLIDAYS_API}?year=${encodeURIComponent(year)}`);
    if (!res.ok)
      throw new Error(`Holidays upstream responded ${res.status}`);

    const { data } = (await res.json()) as {
      data?: { date: string; description: string }[];
    };
    return (data ?? []).map(({ date, description }) => ({ date, description }));
  },
};
