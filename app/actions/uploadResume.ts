'use server'

import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function uploadResume(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: CookieOptions) {
              cookieStore.set({ name, value: '', ...options })
            },
          },
        }
      )
    
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        console.error('No authenticated session found')
        return { count: 0, error: 'Not authenticated', data: null }
      }
    const file = formData.get('file') as File
    const userId = session.user.id

    if (!file) {
      return { error: 'No file provided' }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const filePath = `${userId}/${file.name}`
    const { error } = await supabase.storage
      .from('user-objects')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (error) {
      return { error: error.message }
    }

    return { success: true, path: filePath }
  } catch (error) {
    return { error: 'Failed to upload file' }
  }
}

