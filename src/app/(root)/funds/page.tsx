'use client';

import { PopoverArrow } from '@radix-ui/react-popover';
import {
  AllCommunityModule,
  type CellContextMenuEvent,
  type ColDef,
  type ColumnHeaderContextMenuEvent,
  type INumberCellEditorParams,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import {
  ChartNoAxesColumnIcon,
  PencilLineIcon,
  PlusIcon,
  ReceiptTextIcon,
  RotateCcwIcon,
  Trash2Icon,
  User2Icon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Fund, FundDate } from '@/api/schema';
import SectionHeader from '@/components/section-header';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useStudents } from '@/hooks/use-students';
import { useUser } from '@/hooks/use-user';
import api from '@/lib/api';
import { createClient } from '@/lib/supabase/client';

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
  const isEditor = useMemo(
    () => user && allowedRoles.includes(user.role),
    [user],
  );

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
    [resolvedTheme],
  );
  const gridRef = useRef<AgGridReact>(null);
  const gapi = gridRef.current?.api;

  // Database
  const supabase = createClient();
  const [data, setData] = useState<Fund[]>([]);
  const [students] = useStudents();

  useEffect(() => {
    if (!gapi) return;

    api.funds.get().then(({ data }) => {
      if (!data) return;

      const { funds, dates } = data.data;

      setData(funds);

      gapi.setGridOption(
        'rowData',
        students.map((s, i) => {
          const row = {
            no: i + 1,
            name: s.name,
            uid: s.uid,
          };
          funds
            .filter((d) => d.user === s.uid)
            .forEach((d) => {
              // @ts-expect-error `d.date` is valid for index
              row[d.date] = d.amount;
            });
          return row;
        }),
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
        ...dates.map<ColDef>((d) => ({
          field: String(d.date),
          enableCellChangeFlash: true,
          valueFormatter: (params) =>
            params.data[String(d.date)]?.toLocaleString('id-ID'),
          headerComponent: DateDisplay,
          headerComponentParams: {
            date: d.date,
          },
          width: 82,
          sortable: false,
          suppressMovable: true,
          resizable: false,
          ...(isEditor
            ? {
                editable: true,
                cellEditor: 'agNumberCellEditor',
                cellEditorParams: {
                  precision: 0,
                } as INumberCellEditorParams,
              }
            : {}),
        })),
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

      gapi.setGridOption('alwaysShowHorizontalScroll', true);
      gapi.setGridOption('alwaysShowVerticalScroll', true);
    });

    const ch = supabase
      .channel('funds', { config: { private: true } })
      .on(
        'broadcast',
        { event: 'postgres_changes' },
        ({ payload }: { payload: IPostgresChangesEvent }) => {
          const { table, operation } = payload;

          if (table === 'data') {
            const record = (payload.record || payload.old_record) as Fund;
            const row = gapi.getRowNode(record?.user);
            row?.setDataValue(
              String(record.date),
              (payload.record as Fund | null)?.amount,
            );

            if (operation === 'INSERT') setData((data) => [...data, record]);
            else if (operation === 'UPDATE')
              setData((data) =>
                data.with(
                  data.findIndex((w) => w.id === record.id),
                  record,
                ),
              );
            else if (operation === 'DELETE')
              setData((data) => data.filter((w) => w.id !== record.id));
          }

          if (table === 'dates') {
            const record = (payload.record || payload.old_record) as FundDate;
            let columns = gapi.getColumnDefs() || [];
            const newColumns: ColDef = {
              field: String(record.date),
              enableCellChangeFlash: true,
              valueFormatter: (params) =>
                params.data[String(record.date)]?.toLocaleString('id-ID'),
              headerComponent: DateDisplay,
              headerComponentParams: {
                date: record.date,
              },
              width: 82,
              sortable: false,
              suppressMovable: true,
              resizable: false,
              ...(isEditor
                ? {
                    editable: true,
                    cellEditor: 'agNumberCellEditor',
                    cellEditorParams: {
                      precision: 0,
                    } as INumberCellEditorParams,
                  }
                : {}),
            };

            if (operation === 'INSERT')
              columns = [
                ...columns.slice(0, -1),
                newColumns,
                ...columns.slice(-1),
              ];
            else if (operation === 'UPDATE')
              columns = columns.with(
                columns.findIndex(
                  (w) => 'field' in w && w.field === newColumns.field,
                ),
                newColumns,
              );
            else if (operation === 'DELETE')
              columns = columns.filter(
                (w) => 'field' in w && w.field !== newColumns.field,
              );

            columns.sort((a, b) =>
              'field' in a && 'field' in b && a.field && b.field
                ? new Date(String(a.field)).getTime() -
                  new Date(String(b.field)).getTime()
                : 0,
            );
            gapi.setGridOption('columnDefs', columns);
          }
        },
      );
    supabase.realtime.setAuth().then(() => ch.subscribe());

    return () => {
      supabase.removeChannel(ch);
    };
  }, [gapi, isEditor, students, supabase]);

  // State
  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<
    CellContextMenuEvent | ColumnHeaderContextMenuEvent | null
  >(null);

  return (
    <main className="mx-auto mt-5 flex max-w-360 flex-col gap-5 px-4">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-outfit mb-8 text-center text-4xl font-bold">
          Kas Kelas
        </h1>
      </motion.header>

      <section id="table" className="font-outfit">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionHeader
            title="Buku Kas"
            desc="Track daftar pembayaran kas kelas."
            color="bg-green-500"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="show-scrollbar h-130"
          onContextMenu={(ev) =>
            setContextMenuPos({ x: ev.clientX, y: ev.clientY })
          }
        >
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            getRowId={(params) => params.data.uid}
            onCellValueChanged={(ev) => {
              if (!ev.source) return;
              console.log(ev);
              const [uid, date] = [ev.data.uid, ev.column.getId()];
              const record = data.find(
                (d) => d.user === uid && d.date === date,
              );
              const value = ev.value;

              // INSERT
              if (!record && value)
                return api.funds.post({
                  table: 'data',
                  value: {
                    user: uid,
                    date,
                    amount: parseFloat(value),
                  },
                });
              // DELETE
              if (record && !value)
                return api.funds.post({
                  table: 'data',
                  delete: true,
                  value: { user: uid, date },
                });

              // UPDATE
              return api.funds.post({
                table: 'data',
                value: {
                  ...record,
                  amount: value,
                  updated_at: new Date().toISOString(),
                  updated_by: user?.uid || '',
                },
              });
            }}
            onCellContextMenu={(ev) => {
              if (ev.column.getId() === 'add') return;
              setContextMenu(ev);
            }}
            preventDefaultOnContextMenu
            onColumnHeaderContextMenu={(ev) => {
              if (ev.column.getId() === 'add') return;
              setContextMenu(ev);
            }}
            onCellEditingStarted={(params) => {
              const editor = params.api.getCellEditorInstances({
                rowNodes: [params.node],
                columns: [params.column],
              })[0];
              if (editor?.focusIn) editor.focusIn();
            }}
          />

          {contextMenu && (
            <DropdownMenu open onOpenChange={() => setContextMenu(null)}>
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
                    <DropdownMenuItem className="focus:bg-gray-125 cursor-pointer text-sm dark:focus:bg-gray-700">
                      <ChartNoAxesColumnIcon /> Statistik
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-gray-125 cursor-pointer text-sm dark:focus:bg-gray-700">
                      <User2Icon /> Profil
                    </DropdownMenuItem>
                  </>
                ) : (
                  !['no', 'name'].includes(contextMenu.column.getId()) &&
                  isEditor && (
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
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </motion.div>
      </section>
    </main>
  );
}

const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];
function DateDisplay(props: { date: string }) {
  const date = new Date(props.date);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div>{days[date.getDay()]},</div>
      <div>
        {date.getDate()} {months[date.getMonth()]} ~
        {`${date.getFullYear()}`.slice(2)}
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
              <CardTitle className="row-span-2 self-center">
                Tambah Tanggal
              </CardTitle>
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
