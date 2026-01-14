import { NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth'

// Note: In production, this would upload to Supabase Storage
// For now, this is a placeholder that accepts file uploads

export async function POST(request: Request) {
    const admin = await verifyAdminAuth()
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const folder = formData.get('folder') as string || 'uploads'

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided', success: false },
                { status: 400 }
            )
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.', success: false },
                { status: 400 }
            )
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB.', success: false },
                { status: 400 }
            )
        }

        // In production, upload to Supabase Storage:
        // const supabase = createAdminClient()
        // const fileName = `${folder}/${Date.now()}-${file.name}`
        // const { data, error } = await supabase.storage
        //     .from('images')
        //     .upload(fileName, file, { contentType: file.type })
        // 
        // if (error) throw error
        // 
        // const { data: publicUrl } = supabase.storage
        //     .from('images')
        //     .getPublicUrl(fileName)
        // 
        // return NextResponse.json({ success: true, url: publicUrl.publicUrl })

        // For development, return a placeholder URL
        const placeholderUrl = `/placeholder-${Date.now()}.jpg`

        return NextResponse.json({
            success: true,
            url: placeholderUrl,
            message: 'File upload placeholder. Configure Supabase Storage for production.'
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload file', success: false },
            { status: 500 }
        )
    }
}
