import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth'

// GET - List all contact requests
export async function GET(request: Request) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const { searchParams } = new URL(request.url)
        const unreadOnly = searchParams.get('unread') === 'true'

        const supabase = createAdminClient()

        let query = supabase
            .from('contact_requests')
            .select('*')
            .order('created_at', { ascending: false })

        if (unreadOnly) {
            query = query.eq('is_read', false)
        }

        const { data: contacts, error } = await query

        if (error) {
            console.error('Error fetching contacts:', error)
            return NextResponse.json(
                { error: 'Failed to fetch contact requests', success: false },
                { status: 500 }
            )
        }

        const unreadCount = contacts?.filter(c => !c.is_read).length || 0

        return NextResponse.json({ data: contacts, unreadCount, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
