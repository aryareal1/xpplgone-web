/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  INumberCellEditorParams,
} from 'ag-grid-community';
import { useUser } from '@/hooks/use-user';
import SectionHeader from '@/components/section-header';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { IFundsData, IFundsDate } from '@/app/api/funds/route';
import { useStudents } from '@/hooks/use-students';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PlusIcon, RotateCcwIcon } from 'lucide-react';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PopoverArrow } from '@radix-ui/react-popover';
import { Calendar } from '@/components/ui/calendar';

ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withParams({
  backgroundColor: '#1f2836',
  browserColorScheme: 'dark',
  chromeBackgroundColor: {
    ref: 'foregroundColor',
    mix: 0.07,
    onto: 'backgroundColor',
  },
  columnBorder: true,
  foregroundColor: '#FFF',
  headerFontSize: 14,
  headerColumnBorder: { color: '#ffffff26' },
  headerColumnBorderHeight: '100%',
  fontFamily: {
    googleFont: 'outfit',
  },
  pinnedColumnBorder: { color: '#ffffff26', width: 2 },
  spacing: 6,
  headerVerticalPaddingScale: 1.5,
});

export default function FundsPage() {
  const { user } = useUser();

  // Database
  const supabase = createClient();
  const [data, setData] = useState<IFundsData[]>([]);
  const [dates, setDates] = useState<IFundsDate[]>([]);
  const [students] = useStudents();

  useEffect(() => {
    axios.get('/api/funds').then(({ data }) => {
      setData(data.data);
      setDates(data.dates);
    });

    // const update = async (
    //   type?: 'INSERT' | 'UPDATE' | 'DELETE',
    //   table?: 'data' | 'dates',
    //   nd?: any
    // ) => {
    //   if (!type && !table && !nd) {
    //     const funds = (await axios.get('/api/funds')).data;
    //     setData(funds.data);
    //     setDates(funds.dates);
    //   } else {
    //     const f = table === 'data' ? setData : table === 'dates' ? setDates : () => null;
    //     const k = table === 'data' ? 'id' : table === 'dates' ? 'date' : '';

    //     if (type === 'INSERT') f((data: any[]) => [...data, nd]);
    //     else if (type === 'UPDATE')
    //       f((data: any[]) =>
    //         data.with(
    //           data.findIndex((v) => v[k] === nd[k]),
    //           nd
    //         )
    //       );
    //     else if (type === 'DELETE') f((data: any[]) => data.filter((v) => v[k] !== nd[k]));
    //   }
    //   if (!table || table === 'dates')
    //     setDates((data: any[]) =>
    //       data.toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    //     );
    // };

    const ch = supabase
      .channel('funds', { config: { private: true } })
      .on(
        'broadcast',
        { event: 'postgres_changes' },
        ({ payload: ev }: { payload: IPostgresChangesEvent }) => {
          const setFunc = ev.table === 'data' ? setData : setDates,
            primeKey = ev.table === 'data' ? 'id' : 'date';

          setFunc((v: any[]) => {
            if (ev.operation === 'INSERT') return [...v, ev.record];
            if (ev.operation === 'UPDATE')
              return v.with(
                v.findIndex((w) => w[primeKey] === ev.record[primeKey]),
                ev.record
              );
            if (ev.operation === 'DELETE')
              return v.filter((w) => w[primeKey] !== ev.old_record[primeKey]);

            return v;
          });
          if (ev.table === 'dates')
            setDates((v: any[]) =>
              v.toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            );
        }
      );
    supabase.realtime.setAuth().then(() => ch.subscribe());

    return () => {
      supabase.removeChannel(ch);
    };
  }, [supabase]);

  // AG Grid
  const [columnsDef, setColumnsDef] = useState<ColDef[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);

  useEffect(() => {
    setColumnsDef([
      {
        field: 'no',
        width: 52,
        sortable: false,
        resizable: false,
        suppressMovable: true,
        pinned: 'left',
      },
      {
        field: 'name',
        headerName: 'Nama',
        width: 220,
        headerClass: 'text-center',
        suppressMovable: true,
        pinned: 'left',
      },
      ...dates.map<ColDef>((d) => ({
        field: d.date,
        headerComponent: DateDisplay,
        headerComponentParams: {
          date: d.date,
        },
        width: 82,
        sortable: false,
        suppressMovable: true,
        resizable: false,
        editable: true,
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: {
          precision: 0,
        } as INumberCellEditorParams,
      })),
      {
        field: 'add',
        width: 82,
        resizable: false,
        suppressMovable: true,
        headerComponent: AddDateButton,
      },
    ]);
    setRowData(
      students.map((s, i) => ({
        no: i + 1,
        name: s.full_name,
        ...data.map((d) => ({ [d.date]: d.amount })),
      }))
    );
  }, [data, dates, students]);

  return (
    <main className="mx-auto mt-5 flex max-w-[90rem] flex-col gap-5 px-4">
      <h1 className="font-outfit text-center text-4xl font-bold">Kas Kelas</h1>

      <section id="table" className="font-outfit">
        <SectionHeader
          title="Buku Kas"
          desc="Track daftar pembayaran kas kelas."
          color="bg-green-500"
        />

        <div className="h-130">
          <AgGridReact
            theme={myTheme}
            columnDefs={columnsDef}
            rowData={rowData}
            onCellValueChanged={(ev) => {
              console.log(ev);
            }}
            onCellContextMenu={(ev) => {
              console.log(ev);
              ev.event?.preventDefault();
            }}
          />
        </div>
      </section>
    </main>
  );
}

const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
function DateDisplay(props: { date: string }) {
  const date = new Date(props.date);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div>{days[date.getDay()]},</div>
      <div>
        {date.getDate()} {months[date.getMonth()]} ~{(date.getFullYear() + '').slice(2)}
      </div>
    </div>
  );
}

function AddDateButton() {
  const [date, setDate] = useState(new Date());
  const [month, setMonth] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-8/10 w-full items-center justify-center">
      <Popover
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) return;
          setDate(new Date());
          setMonth(new Date());
        }}
        open={open}
      >
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-full w-full" pointer>
            <PlusIcon className="size-4" />{' '}
          </Button>
        </PopoverTrigger>
        <PopoverContent asChild>
          <Card className="w-full bg-gray-50 dark:bg-gray-800">
            <PopoverArrow className="fill-gray-200 dark:fill-gray-800" />
            <CardHeader>
              <CardTitle className="row-span-2 self-center">Tambah Tanggal</CardTitle>
              <CardAction className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  pointer
                  onClick={() => {
                    setDate(new Date());
                    setMonth(new Date());
                  }}
                >
                  <RotateCcwIcon />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  pointer
                  className="bg-green-500 hover:bg-green-400 dark:bg-green-700 dark:hover:bg-green-600"
                  onClick={() => {
                    setOpen(false);
                    axios.post('/api/funds', {
                      table: 'dates',
                      date: date.toDateString(),
                    });
                  }}
                >
                  <PlusIcon />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Calendar
                className="bg-transparent p-0"
                mode="single"
                required
                defaultMonth={date}
                selected={date}
                month={month}
                onSelect={setDate}
                onMonthChange={setMonth}
                disabled={{
                  before: new Date('2025-07-14'),
                  after: new Date(),
                }}
              />
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface IPostgresChangesEvent {
  id: string;
  old_record: any;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  record: any;
  schema: string;
  table: string;
}
// interface IPostgresChangesEvent<T extends string, M extends Record<T, unknown>> {
//   id: string;
//   old_record?: M[T];
//   operation: 'INSERT' | 'UPDATE' | 'DELETE';
//   record: M[T];
//   schema: string;
//   table: T;
// }
// type FundsSchemaMap = {
//   data: IFundsData;
//   dates: IFundsDate;
// };
