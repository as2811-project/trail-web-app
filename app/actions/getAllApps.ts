'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'


export async function getAllApplications(hasApplied: boolean) {
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

    const { data, error } = await supabase
      .from('job_postings')
      .select('id, jobTitle, companyName, application_date, jobUrl, progress, resume_used')
      .eq('user_id', session.user.id)
      .eq('hasApplied', hasApplied)
      .order('application_date', { ascending: false })

    if (error) {
      console.error('Error fetching recent applications:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Unexpected error:', error)
    return { count: 0, error: 'Unexpected error', data: null }
  }
}


