import { ReactNode } from "react";
import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";

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
        "overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70",
        className,
      ].join(" ")}
    >
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="sticky top-0 z-10 bg-slate-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={[
                    "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400",
                    column.headerClassName ?? "",
                  ].join(" ")}
                >
                  {column.header}
                </th>
              ))}
              {actions ? (
                <th
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <LoadingSpinner size="md" />
                </td>
              </tr>
            ) : null}

            {!isLoading && hasRows
              ? data.map((row, rowIndex) => (
                  <tr
                    key={getRowKey(row, rowIndex)}
                    className="transition-colors hover:bg-slate-800/50"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={[
                          "whitespace-nowrap px-4 py-3 text-sm text-slate-200",
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
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                        {actions(row, rowIndex)}
                      </td>
                    ) : null}
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      {!isLoading && !hasRows ? (
        <div className="border-t border-slate-800 p-4">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : null}
    </div>
  );
}

export type { TableColumn, TableProps };
