import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { verifyAdminAuth } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/Sidebar'

export default async function AdminLayout({
    children,
}: {
    children: ReactNode
}) {
    const admin = await verifyAdminAuth()

    if (!admin) {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <AdminSidebar />
            <main className="lg:ml-64 min-h-screen">
                <div className="p-4 lg:p-8 pt-16 lg:pt-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
