import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export interface AdminSession {
    id: string
    email: string
    name: string
    role: string
}

export async function verifyAdminAuth(): Promise<AdminSession | null> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')?.value

        if (!token) {
            return null
        }

        const { payload } = await jwtVerify(token, JWT_SECRET)

        return {
            id: payload.id as string,
            email: payload.email as string,
            name: payload.name as string,
            role: payload.role as string
        }
    } catch (error) {
        console.error('Auth verification error:', error)
        return null
    }
}

export function unauthorizedResponse() {
    return Response.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
    )
}
