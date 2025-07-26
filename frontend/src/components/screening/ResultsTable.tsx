import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';
import { StockResult } from '@/types/screening';

interface ResultsTableProps {
  data: StockResult[];
  isLoading?: boolean;
  onExport?: (format: 'csv' | 'json') => void;
}

export function ResultsTable({ data, isLoading, onExport }: ResultsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<StockResult>[]>(() => [
    {
      accessorKey: 'stock',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 p-0 hover:bg-transparent"
        >
          Stock
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.getValue('stock') as string;
        const tradingViewUrl = `https://in.tradingview.com/chart?symbol=NSE%3A${stock}`;
        
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{stock}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => window.open(tradingViewUrl, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: 'ltp',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 p-0 hover:bg-transparent"
        >
          LTP (% Chng)
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const ltp = row.getValue('ltp') as string;
        const isPositive = ltp.includes('+') || (!ltp.includes('-') && !ltp.includes('('));
        
        return (
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {ltp}
          </span>
        );
      },
    },
    {
      accessorKey: 'consolidating',
      header: 'Consolidating',
      cell: ({ row }) => {
        const value = row.getValue('consolidating') as string;
        const percentage = parseFloat(value.replace(/[^\d.]/g, ''));
        
        return (
          <Badge variant={percentage <= 10 ? 'default' : 'secondary'}>
            {value}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'breaking_out',
      header: 'Breaking Out',
      cell: ({ row }) => {
        const value = row.getValue('breaking_out') as string;
        return <span className="font-mono text-sm">{value}</span>;
      },
    },
    {
      accessorKey: 'volume',
      header: 'Volume',
      cell: ({ row }) => {
        const volume = row.getValue('volume') as string;
        const multiplier = parseFloat(volume.replace('x', ''));
        
        return (
          <Badge variant={multiplier >= 2 ? 'default' : 'outline'}>
            {volume}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'ma_signal',
      header: 'MA Signal',
      cell: ({ row }) => {
        const signal = row.getValue('ma_signal') as string;
        const isBullish = signal.toLowerCase().includes('bull') || 
                         signal.toLowerCase().includes('support');
        
        return (
          <Badge variant={isBullish ? 'default' : 'destructive'}>
            {signal}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'rsi',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 p-0 hover:bg-transparent"
        >
          RSI
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const rsi = row.getValue('rsi') as number;
        let variant: 'default' | 'secondary' | 'destructive' = 'secondary';
        
        if (rsi <= 30) variant = 'default'; // Oversold
        else if (rsi >= 70) variant = 'destructive'; // Overbought
        
        return <Badge variant={variant}>{rsi}</Badge>;
      },
    },
    {
      accessorKey: 'trend',
      header: 'Trend',
      cell: ({ row }) => {
        const trend = row.getValue('trend') as string;
        const isUpTrend = trend.toLowerCase().includes('up');
        
        return (
          <Badge variant={isUpTrend ? 'default' : 'destructive'}>
            {trend}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'pattern',
      header: 'Pattern',
      cell: ({ row }) => {
        const pattern = row.getValue('pattern') as string;
        if (!pattern) return <span className="text-muted-foreground">-</span>;
        
        return (
          <Badge variant="outline" className="max-w-[120px] truncate">
            {pattern}
          </Badge>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🔍 Found {data.length} Results
          </CardTitle>
          <div className="flex items-center gap-2">
            {onExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onExport('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport('json')}>
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-8"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {table.getFilteredRowModel().rows.length} of {data.length} stocks
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}