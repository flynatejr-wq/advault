'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { TeamRole } from '@/types'

export function useTeamRole(): { role: TeamRole | 'owner' | null; loading: boolean } {
  const [role, setRole] = useState<TeamRole | 'owner' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      const { data } = await supabase
        .from('team_members')
        .select('role, owner_user_id')
        .eq('member_user_id', user.id)
        .eq('status', 'active')
        .single()
      setRole(data ? (data.role as TeamRole) : 'owner')
      setLoading(false)
    })
  }, [])

  return { role, loading }
}
