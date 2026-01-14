import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth'

// GET - Get all settings or single setting by key
export async function GET(request: Request) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const { searchParams } = new URL(request.url)
        const key = searchParams.get('key')

        const supabase = createAdminClient()

        if (key) {
            const { data: setting, error } = await supabase
                .from('site_settings')
                .select('*')
                .eq('key', key)
                .single()

            if (error || !setting) {
                return NextResponse.json(
                    { error: 'Setting not found', success: false },
                    { status: 404 }
                )
            }

            return NextResponse.json({ data: setting, success: true })
        }

        const { data: settings, error } = await supabase
            .from('site_settings')
            .select('*')
            .order('key', { ascending: true })

        if (error) {
            console.error('Error fetching settings:', error)
            return NextResponse.json(
                { error: 'Failed to fetch settings', success: false },
                { status: 500 }
            )
        }

        // Convert array to object for easier access
        const settingsObject = settings?.reduce((acc, s) => {
            acc[s.key] = s.value
            return acc
        }, {} as Record<string, string>)

        return NextResponse.json({ data: settings, settingsObject, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}

// PUT - Update setting
export async function PUT(request: Request) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const body = await request.json()
        const { key, value, description } = body

        if (!key || value === undefined) {
            return NextResponse.json(
                { error: 'Key and value are required', success: false },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        // Upsert
        const { data: setting, error } = await supabase
            .from('site_settings')
            .upsert({
                key,
                value: String(value),
                description: description || null
            }, { onConflict: 'key' })
            .select()
            .single()

        if (error) {
            console.error('Error updating setting:', error)
            return NextResponse.json(
                { error: 'Failed to update setting', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: setting, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
