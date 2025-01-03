'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getDetails(id: number) {
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
      return { error: 'Not authenticated', data: null }
    }

    const { data, error } = await supabase
      .from('job_postings')
      .select('id, jobTitle, companyName, descriptionHtml, application_date, jobUrl, progress, resume_used')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching job details:', error)
      return { error: error.message, data: null }
    }

    return { error: null, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'Unexpected error', data: null }
  }
}

export async function updateJobDetails(id: number, progress: string, resume_used: string) {
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
      return { error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('job_postings')
      .update({ progress, resume_used })
      .eq('id', id)

    if (error) {
      console.error('Error updating job details:', error)
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'Unexpected error' }
  }
}

