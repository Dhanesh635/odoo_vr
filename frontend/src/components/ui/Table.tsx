import { ReactNode } from "react";
import EmptyState from "./EmptyState";
import { TableSkeleton } from "./Skeleton";

type TableColumn<TData> = {
  key: string;
  header: ReactNode;
  accessor?: keyof TData;
  render?: (row: TData, rowIndex: number) => ReactNode;
  className?: string;
  headerClassName?: string;
};

type TableProps<TData> = {
  columns: TableColumn<TData>[];
  data: TData[];
  getRowKey: (row: TData, rowIndex: number) => string | number;
  actions?: (row: TData, rowIndex: number) => ReactNode;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
};

export default function Table<TData>({
  actions,
  className = "",
  columns,
  data,
  emptyDescription = "There are no records to display.",
  emptyTitle = "No data found",
  getRowKey,
  isLoading = false,
}: TableProps<TData>) {
  const hasRows = data.length > 0;

  return (
    <div
      className={[
        "overflow-hidden rounded-[20px] border border-border/50 bg-surface/80 backdrop-blur-xl shadow-xl shadow-black/40 ring-1 ring-white/5",
        className,
      ].join(" ")}
    >
      {/* Skeleton loading state */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={columns.length + (actions ? 1 : 0)} />
      ) : null}

      {/* Table content */}
      {!isLoading ? (
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-border/50">
            <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur-md">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={[
                      "whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/60",
                      column.headerClassName ?? "",
                    ].join(" ")}
                  >
                    {column.header}
                  </th>
                ))}
                {actions ? (
                  <th
                    scope="col"
                    className="whitespace-nowrap px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-foreground/60"
                  >
                    Actions
                  </th>
                ) : null}
              </tr>
            </thead>

            <tbody className="divide-y divide-border/30">
              {hasRows
                ? data.map((row, rowIndex) => (
                    <tr
                      key={getRowKey(row, rowIndex)}
                      className={[
                        "transition-all duration-200 hover:bg-primary/10 hover:shadow-inner",
                        rowIndex % 2 === 1 ? "bg-surface/30" : "",
                      ].join(" ")}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={[
                            "whitespace-nowrap px-6 py-4 text-sm text-foreground/90",
                            column.className ?? "",
                          ].join(" ")}
                        >
                          {column.render
                            ? column.render(row, rowIndex)
                            : column.accessor
                              ? String(row[column.accessor] ?? "")
                              : null}
                        </td>
                      ))}
                      {actions ? (
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                          {actions(row, rowIndex)}
                        </td>
                      ) : null}
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {!isLoading && !hasRows ? (
        <div className="border-t border-slate-800 p-4">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : null}
    </div>
  );
}

export type { TableColumn, TableProps };
