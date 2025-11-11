import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType, data } = await req.json()
    if (!filename || !contentType || !data) {
      return NextResponse.json({ error: 'filename, contentType, data required' }, { status: 400 })
    }

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

    const buffer = Buffer.from(data, 'base64')
    const bucket = process.env.SUPABASE_BUCKET || 'images'
    const path = filename // e.g. 'clothings/product-9/main.webp'

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType,
      upsert: true,
    })
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // public bucket path
    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path)
    return NextResponse.json({ url: publicUrl.publicUrl })
  } catch (error) {
    console.error('Supabase upload failed:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
