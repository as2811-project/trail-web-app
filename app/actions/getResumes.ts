'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getResumes(count: boolean) {
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

    const { data, error } = await supabase.storage
      .from('user-objects')
      .list(session.user.id)

    if (error) {
      console.error('Error fetching resumes:', error)
      return { count: 0, error: error.message, data: null }
    }

    const resumeCount = data ? data.length : 0
    console.log('Fetched resumes:', resumeCount)

    if (count) {
      return { count: resumeCount, error: null, data: null }
    } else {
      return { count: resumeCount, error: null, data }
    }
  } catch (error) {
    console.error('Error fetching resumes:', error)
    return { count: 0, error: (error as any).message, data: null }
  }
}
