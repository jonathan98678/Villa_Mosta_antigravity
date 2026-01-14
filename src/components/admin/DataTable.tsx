'use client'

import { ReactNode } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'

interface Column<T> {
    key: keyof T | string
    label: string
    render?: (item: T) => ReactNode
    sortable?: boolean
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    onRowClick?: (item: T) => void
    searchable?: boolean
    searchPlaceholder?: string
    emptyMessage?: string
}

export default function DataTable<T extends { id: string | number }>({
    data,
    columns,
    onRowClick,
    searchable = false,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No data available'
}: DataTableProps<T>) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            {searchable && (
                <div className="p-4 border-b border-slate-800">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                                >
                                    <div className="flex items-center gap-2">
                                        {col.label}
                                        {col.sortable && (
                                            <div className="flex flex-col">
                                                <ChevronUp size={12} className="text-slate-600" />
                                                <ChevronDown size={12} className="text-slate-600 -mt-1" />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {data.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => onRowClick?.(item)}
                                className={`hover:bg-slate-800/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''
                                    }`}
                            >
                                {columns.map((col) => (
                                    <td key={String(col.key)} className="px-6 py-4 text-slate-300">
                                        {col.render
                                            ? col.render(item)
                                            : String(item[col.key as keyof T] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                    {emptyMessage}
                </div>
            )}
        </div>
    )
}
