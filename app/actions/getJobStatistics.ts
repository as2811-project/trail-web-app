'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getJobStatistics(hasApplied: boolean) {
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

    const { data, error, count } = await supabase
      .from('job_postings')
      .select('*', { count: 'exact' })
      .eq('user_id', session.user.id)
      .or(`hasApplied.eq.${hasApplied},hasApplied.is.null`)

    if (error) {
      console.error('Supabase error:', error)
      return { count: 0, error: error.message, data: null }
    }

    console.log(`Query result for hasApplied=${hasApplied}:`, { count, dataLength: data?.length })

    return { count: count || 0, error: null, data }
  } catch (error) {
    console.error('Error fetching job statistics:', error)
    return { count: 0, error: 'An unexpected error occurred', data: null }
  }
}
