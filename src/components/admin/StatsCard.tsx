interface StatsCardProps {
    title: string
    value: string | number
    description?: string
    icon?: React.ReactNode
    trend?: {
        value: number
        isPositive: boolean
    }
}

export function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-400">{title}</p>
                    <p className="text-2xl font-semibold text-white mt-1">{value}</p>
                    {description && (
                        <p className="text-xs text-slate-500 mt-1">{description}</p>
                    )}
                    {trend && (
                        <p className={`text-xs mt-2 ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-3 bg-slate-800 rounded-lg text-amber-500">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}
