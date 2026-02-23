import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useGroups(userId) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    async function fetchGroups() {
      try {
        const { data: memberships, error: memberError } = await supabase
          .from('group_members')
          .select(`
            grupo_id,
            es_admin,
            groups (
              id,
              nombre,
              codigo_invitacion,
              tipo_puntaje,
              cantidad_posiciones,
              temporada,
              creador_id
            )
          `)
          .eq('usuario_id', userId)
          .eq('estado', 'aprobado')

        if (memberError) throw memberError

        const groupsWithStats = await Promise.all(
          (memberships || []).map(async (m) => {
            const group = m.groups

            const { count: memberCount } = await supabase
              .from('group_members')
              .select('*', { count: 'exact', head: true })
              .eq('grupo_id', group.id)
              .eq('estado', 'aprobado')

            const { count: pendingCount } = await supabase
              .from('group_members')
              .select('*', { count: 'exact', head: true })
              .eq('grupo_id', group.id)
              .eq('estado', 'pendiente')

            const { data: nextRace } = await supabase
              .from('races')
              .select('id, nombre, fecha_programada')
              .eq('temporada', group.temporada)
              .eq('estado', 'programada')
              .order('fecha_programada', { ascending: true })
              .limit(1)
              .maybeSingle()

            let sinPredecir = 0
            if (nextRace) {
              const { data: prediction } = await supabase
                .from('predictions')
                .select('id')
                .eq('grupo_id', group.id)
                .eq('carrera_id', nextRace.id)
                .eq('usuario_id', userId)
                .maybeSingle()

              if (!prediction) sinPredecir = 1
            }

            const { data: scores } = await supabase
              .from('scores')
              .select('puntos')
              .eq('grupo_id', group.id)
              .eq('usuario_id', userId)

            const totalPoints = scores?.reduce((sum, s) => sum + parseFloat(s.puntos || 0), 0) || 0

            const { data: allScores } = await supabase
              .from('scores')
              .select('usuario_id, puntos')
              .eq('grupo_id', group.id)

            const userTotals = {}
            allScores?.forEach(s => {
              if (!userTotals[s.usuario_id]) userTotals[s.usuario_id] = 0
              userTotals[s.usuario_id] += parseFloat(s.puntos || 0)
            })

            const sortedUsers = Object.entries(userTotals).sort(([, a], [, b]) => b - a)
            const position = sortedUsers.findIndex(([uid]) => uid === userId) + 1

            return {
              id: group.id,
              nombre: group.nombre,
              code: group.codigo_invitacion,
              tipo: group.tipo_puntaje,
              cantidad_posiciones: group.cantidad_posiciones,
              temporada: group.temporada,
              isAdmin: m.es_admin || group.creador_id === userId,
              miembros: memberCount || 0,
              pending: pendingCount || 0,
              sinPredecir,
              posicion: position || 1,
              puntos: Math.round(totalPoints),
            }
          })
        )

        setGroups(groupsWithStats)
      } catch (err) {
        console.error('Error fetching groups:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [userId])

  return { groups, loading, error }
}