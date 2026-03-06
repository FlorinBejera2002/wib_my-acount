import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { AlertCircle, Inbox } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  isError,
  onRetry,
  onRowClick
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  })

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-green-50">
            <TableRow>
              {columns.map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {columns.map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-100 bg-white shadow-sm py-16">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <p className="font-medium text-foreground">
            A apărut o eroare la încărcarea datelor
          </p>
          <p className="text-sm text-muted-foreground">
            Te rugăm să încerci din nou
          </p>
        </div>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Încearcă din nou
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-green-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                onClick={() => onRowClick?.(row.original)}
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
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Inbox className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    Nu au fost găsite rezultate
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
