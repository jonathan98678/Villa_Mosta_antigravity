import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

// Temporary admin credentials for development (remove in production)
const TEMP_ADMIN = {
    email: '123@123.123',
    password: '123',
    id: 'temp-admin-id',
    name: 'Admin',
    role: 'admin'
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required', success: false },
                { status: 400 }
            )
        }

        // Check for temporary admin first (for development without database)
        if (email === TEMP_ADMIN.email && password === TEMP_ADMIN.password) {
            const token = await new SignJWT({
                id: TEMP_ADMIN.id,
                email: TEMP_ADMIN.email,
                role: TEMP_ADMIN.role,
                name: TEMP_ADMIN.name
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('24h')
                .sign(JWT_SECRET)

            const cookieStore = await cookies()
            cookieStore.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
                path: '/'
            })

            return NextResponse.json({
                success: true,
                admin: {
                    id: TEMP_ADMIN.id,
                    email: TEMP_ADMIN.email,
                    name: TEMP_ADMIN.name,
                    role: TEMP_ADMIN.role
                }
            })
        }

        // Try database authentication
        try {
            const supabase = createAdminClient()

            const { data: admin, error } = await supabase
                .from('admin_users')
                .select('*')
                .eq('email', email.toLowerCase())
                .single()

            if (error || !admin) {
                return NextResponse.json(
                    { error: 'Invalid credentials', success: false },
                    { status: 401 }
                )
            }

            const isValid = await bcrypt.compare(password, admin.password_hash)

            if (!isValid) {
                return NextResponse.json(
                    { error: 'Invalid credentials', success: false },
                    { status: 401 }
                )
            }

            await supabase
                .from('admin_users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', admin.id)

            const token = await new SignJWT({
                id: admin.id,
                email: admin.email,
                role: admin.role,
                name: admin.name
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('24h')
                .sign(JWT_SECRET)

            const cookieStore = await cookies()
            cookieStore.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
                path: '/'
            })

            return NextResponse.json({
                success: true,
                admin: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role
                }
            })
        } catch {
            // Database not configured, only temp login works
            return NextResponse.json(
                { error: 'Invalid credentials (use 123/123 for demo)', success: false },
                { status: 401 }
            )
        }
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
