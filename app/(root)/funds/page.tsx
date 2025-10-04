'use client';

import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  INumberCellEditorParams,
  CellContextMenuEvent,
  ColumnHeaderContextMenuEvent,
} from 'ag-grid-community';
import { useUser } from '@/hooks/use-user';
import SectionHeader from '@/components/section-header';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { IFundsData, IFundsDate } from '@/app/api/funds/route';
import { useStudents } from '@/hooks/use-students';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ChartNoAxesColumnIcon,
  PencilLineIcon,
  PlusIcon,
  ReceiptTextIcon,
  RotateCcwIcon,
  Trash2Icon,
  User2Icon,
} from 'lucide-react';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PopoverArrow } from '@radix-ui/react-popover';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { StatisticsDialog } from './dialogs';
import { distribute } from '@/lib/utils';

ModuleRegistry.registerModules([AllCommunityModule]);

const allowedRoles = [
  'owner',
  'admin',
  'teacher',
  'homeroom_teacher',
  'president',
  'vice_president',
  'treasurer',
];

export default function FundsPage() {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const isEditor = useMemo(() => user && allowedRoles.includes(user.role), [user]);

  // AG Grid
  const gridTheme = useMemo(
    () =>
      themeQuartz.withParams({
        backgroundColor: 'var(--color-grid)',
        headerBackgroundColor: 'var(--color-grid-header)',
        browserColorScheme: resolvedTheme,
        chromeBackgroundColor: {
          ref: 'foregroundColor',
          mix: 0.07,
          onto: 'backgroundColor',
        },
        columnBorder: true,
        foregroundColor: 'var(--color-grid-foreground)',
        headerFontSize: 14,
        headerColumnBorder: { color: 'var(--color-grid-border)' },
        headerColumnBorderHeight: '100%',
        pinnedColumnBorder: { color: 'var(--color-grid-border)', width: 2 },
        borderColor: 'var(--color-grid-border)',
        fontFamily: {
          googleFont: 'outfit',
        },
        spacing: 6,
        headerVerticalPaddingScale: 1.5,
      }),
    [resolvedTheme]
  );
  const gridRef = useRef<AgGridReact>(null); // eslint-disable-next-line react-hooks/exhaustive-deps
  const gapi = useMemo(() => gridRef.current?.api, [gridRef.current]);
  const dateColDef = useCallback(
    (date: IFundsDate) => {
      const isOld = new Date(date.date).getTime() < new Date(new Date().toDateString()).getTime();

      return {
        field: date.date,
        cellClass: 'text-center',
        cellClassRules: {
          'text-yellow-500': (params) =>
            Array.isArray(params.value) && params.value[0] !== 2000 && isOld,
          'text-green-400': (params) =>
            (params.value && isOld) || (Array.isArray(params.value) && params.value[0] === 2000),
          'text-red-500': (params) => !params.value && isOld,
        },
        enableCellChangeFlash: true,
        valueFormatter: (params) => {
          const v = params.data[date.date];
          if (!v) {
            if (isOld) return '-';
            return;
          }
          return Array.isArray(v)
            ? v[0] === 2000
              ? '✓'
              : (v[0] * -1).toLocaleString('id-ID')
            : v.toLocaleString('id-ID');
        },
        headerComponent: DateDisplay,
        headerComponentParams: {
          date: date.date,
        },
        width: 82,
        sortable: false,
        suppressMovable: true,
        resizable: false,
        ...(isEditor
          ? {
              editable: (params) => {
                if (isOld) return false;
                const v = params.data[date.date];
                return !(Array.isArray(v) && v[0] === 2000);
              },
              cellEditor: 'agNumberCellEditor',
              cellEditorParams: {
                precision: 0,
              } as INumberCellEditorParams,
            }
          : {}),
      } as ColDef;
    },
    [isEditor]
  );

  // Database
  const supabase = createClient();
  const [data, setData] = useState<IFundsData[]>([]);
  const [dates, setDates] = useState<IFundsDate[]>([]);
  const [students] = useStudents();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!gapi) return;
    if (!mounted) {
      fetch('/api/funds')
        .then((r) => r.json())
        .then((d) => {
          const { data, dates } = d;
          setData(data);
          setDates(dates);
          setMounted(true);
        });
      return;
    }

    gapi.setGridOption(
      'rowData',
      students.map((s, i) => {
        let row = {
          no: i + 1,
          name: s.full_name,
          uid: s.uid,
        };
        let list = dates.map(
          (dt) => data.find((d) => d.user === s.uid && d.date === dt.date)?.amount || null
        );
        distribute(list, 2000).forEach((v, i) => {
          const d = dates[i];
          // @ts-expect-error "`d.date` is valid for index"
          row[d.date] = v;
        });
        return row;
      })
    );

    gapi.setGridOption('columnDefs', [
      {
        field: 'no',
        width: 42,
        sortable: false,
        resizable: false,
        suppressMovable: true,
        pinned: 'left',
        cellClass: 'text-center',
      },
      {
        field: 'name',
        headerName: 'Nama',
        width: 220,
        suppressMovable: true,
        pinned: 'left',
      },
      ...dates.map<ColDef>((d) => dateColDef(d)),
      ...(isEditor
        ? [
            {
              field: 'add',
              width: 82,
              resizable: false,
              suppressMovable: true,
              headerComponent: AddDateButton,
            },
          ]
        : []),
    ]);

    const ch = supabase
      .channel('funds', { config: { private: true } })
      .on(
        'broadcast',
        { event: 'postgres_changes' },
        ({ payload }: { payload: IPostgresChangesEvent }) => {
          const { table, operation } = payload;

          if (table === 'data') {
            const record = (payload.record || payload.old_record) as IFundsData;
            setData((data) => {
              if (operation === 'INSERT') return [...data, record];
              else if (operation === 'UPDATE')
                return data.with(
                  data.findIndex((w) => w.id === record.id),
                  record
                );
              else if (operation === 'DELETE') return data.filter((w) => w.id !== record.id);
              return data;
            });

            let row = gapi.getRowNode(record?.user);
            let rowData = { ...row?.data };
            let list = dates.map((dt) =>
              dt.date === record.date
                ? record.amount
                : data.find((d) => d.user === rowData.uid && d.date === dt.date)?.amount || null
            );
            distribute(list, 2000).forEach((v, i) => {
              const d = dates[i];
              rowData[d.date] = v;
            });
            row?.setData(rowData);
          }

          if (table === 'dates') {
            const record = (payload.record || payload.old_record) as IFundsDate;
            setDates((dates) => {
              let n = dates.slice();
              if (operation === 'INSERT') n = [...dates, record];
              else if (operation === 'UPDATE')
                n = dates.with(
                  dates.findIndex((w) => w.date === record.date),
                  record
                );
              else if (operation === 'DELETE') n = dates.filter((w) => w.date !== record.date);
              n.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              return n;
            });

            let columns = gapi.getColumnDefs() || [];
            let newColumns = dateColDef(record);

            if (operation === 'INSERT')
              columns = [...columns.slice(0, -1), newColumns, ...columns.slice(-1)];
            else if (operation === 'UPDATE')
              columns = columns.with(
                columns.findIndex((w) => 'field' in w && w.field === newColumns.field),
                newColumns
              );
            else if (operation === 'DELETE')
              columns = columns.filter((w) => 'field' in w && w.field !== newColumns.field);

            columns.sort((a, b) =>
              'field' in a && 'field' in b && a.field && b.field
                ? new Date(a.field).getTime() - new Date(b.field).getTime()
                : 0
            );
            gapi.setGridOption('columnDefs', columns);
          }
        }
      );
    supabase.realtime.setAuth().then(() => ch.subscribe());

    return () => {
      supabase.removeChannel(ch);
    };
  }, [data, dateColDef, dates, gapi, isEditor, mounted, students, supabase]);

  // State
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<
    CellContextMenuEvent | ColumnHeaderContextMenuEvent
  >();
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  return (
    <main className="mx-auto mt-5 flex max-w-[90rem] flex-col gap-5 px-4">
      <h1 className="font-outfit text-center text-4xl font-bold">Kas Kelas</h1>

      <section id="table" className="font-outfit">
        <SectionHeader
          title="Buku Kas"
          desc="Track daftar pembayaran kas kelas."
          color="bg-green-500"
        />

        <div
          className="h-130"
          onContextMenu={(ev) => setContextMenuPos({ x: ev.clientX, y: ev.clientY })}
        >
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            getRowId={(params) => params.data.uid}
            onCellValueChanged={(ev) => {
              if (!ev.source) return;
              let [uid, date] = [ev.data.uid, ev.column.getId()];
              let record = data.find((d) => d.user === uid && d.date === date);
              let value = ev.value;
              if (!record && !value) return;

              // INSERT
              if (!record && value)
                return fetch('/api/funds', {
                  method: 'POST',
                  body: JSON.stringify({
                    table: 'data',
                    value: {
                      user: uid,
                      date,
                      amount: parseFloat(value),
                    },
                  }),
                });

              // DELETE
              if (record && !value)
                return fetch('/api/funds', {
                  method: 'POST',
                  body: JSON.stringify({
                    table: 'data',
                    delete: true,
                    value: { user: uid, date },
                  }),
                });

              // UPDATE
              return fetch('/api/funds', {
                method: 'POST',
                body: JSON.stringify({
                  table: 'data',
                  value: {
                    ...record,
                    amount: value,
                    updated_at: new Date().toISOString(),
                    updated_by: user?.uid || '',
                  },
                }),
              });
            }}
            onCellContextMenu={(ev) => {
              if (ev.column.getId() === 'add') return;
              setContextMenu(ev);
              setContextMenuOpen(true);
            }}
            preventDefaultOnContextMenu
            onColumnHeaderContextMenu={(ev) => {
              if (ev.column.getId() === 'add') return;
              setContextMenu(ev);
              setContextMenuOpen(true);
            }}
            onCellEditingStarted={(params) => {
              const editor = params.api.getCellEditorInstances({
                rowNodes: [params.node],
                columns: [params.column],
              })[0];
              if (editor && editor.focusIn) editor.focusIn();
            }}
          />

          <Dialog>
            {contextMenuOpen && contextMenu && (
              <DropdownMenu open onOpenChange={() => setContextMenuOpen(false)}>
                <DropdownMenuTrigger asChild>
                  <div
                    style={{
                      position: 'absolute',
                      top: contextMenuPos.y,
                      left: contextMenuPos.x,
                    }}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="font-outfit font-light dark:bg-gray-800"
                  side="right"
                  align="start"
                >
                  {'data' in contextMenu ? (
                    <>
                      {!['no', 'name'].includes(contextMenu.column.getId()) && (
                        <>
                          {isEditor && (
                            <DropdownMenuItem
                              className="focus:bg-gray-125 cursor-pointer text-sm dark:focus:bg-gray-700"
                              onClick={() =>
                                contextMenu.api.startEditingCell({
                                  colKey: contextMenu.column.getId(),
                                  rowIndex: contextMenu.rowIndex || 0,
                                  rowPinned: contextMenu.rowPinned,
                                  key: 'Enter',
                                })
                              }
                            >
                              <PencilLineIcon /> Edit
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="focus:bg-gray-125 cursor-pointer text-sm dark:focus:bg-gray-700">
                            <ReceiptTextIcon /> Detail
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DialogTrigger asChild>
                        <DropdownMenuItem className="focus:bg-gray-125 cursor-pointer text-sm dark:focus:bg-gray-700">
                          <ChartNoAxesColumnIcon /> Statistik
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DropdownMenuItem className="focus:bg-gray-125 cursor-pointer text-sm dark:focus:bg-gray-700">
                        <User2Icon /> Profil
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      {!['no', 'name'].includes(contextMenu.column.getId()) && isEditor && (
                        <DropdownMenuItem
                          className="focus:bg-gray-125 cursor-pointer text-sm dark:focus:bg-gray-700"
                          onClick={() => {
                            fetch('/api/funds', {
                              method: 'POST',
                              body: JSON.stringify({
                                table: 'dates',
                                delete: true,
                                value: { date: contextMenu.column.getId() },
                              }),
                            });
                          }}
                        >
                          <Trash2Icon /> Hapus
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <DialogContent className="font-outfit">
              {contextMenu && (
                <>
                  {'data' in contextMenu ? (
                    <StatisticsDialog data={data} dates={dates} contextMenu={contextMenu} />
                  ) : (
                    <></>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </main>
  );
}

// Date Grid Header
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

// Add Date Popup Button
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
                  className="border bg-green-500 hover:bg-green-400 dark:bg-green-700 dark:hover:bg-green-600"
                  onClick={() => {
                    setOpen(false);
                    fetch('/api/funds', {
                      method: 'POST',
                      body: JSON.stringify({
                        table: 'dates',
                        value: { date: date.toDateString() },
                      }),
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

// interface IPostgresChangesEvent {
//   id: string;
//   old_record: any;
//   operation: 'INSERT' | 'UPDATE' | 'DELETE';
//   record: any;
//   schema: string;
//   table: string;
// }
interface IPostgresChangesEvent<T = unknown> {
  id: string;
  old_record?: T;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  record: T;
  schema: string;
  table: string;
}
