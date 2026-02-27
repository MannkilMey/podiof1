import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGroupMembers(groupId) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMembers = async () => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('group_members')
        .select(`
          id,
          usuario_id,
          es_admin,
          estado,
          joined_at,
          users!inner(
            id,
            nombre,
            apellido,
            email
          )
        `)
        .eq('grupo_id', groupId)
        .order('joined_at', { ascending: true });

      if (fetchError) throw fetchError;

      // Transformar datos y obtener puntos
      const transformedMembers = await Promise.all(
        (data || []).map(async (member) => {
          // Obtener puntos del usuario en este grupo
          const { data: scores } = await supabase
            .from('scores')
            .select('puntos')
            .eq('grupo_id', groupId)
            .eq('usuario_id', member.usuario_id);

          const totalPoints = scores?.reduce((sum, s) => sum + parseFloat(s.puntos || 0), 0) || 0;

          // Contar exactos (predictions con puntos por posición exacta)
          const { data: predictions } = await supabase
            .from('predictions')
            .select('puntos_posicion')
            .eq('grupo_id', groupId)
            .eq('usuario_id', member.usuario_id);

          const exactos = predictions?.filter(p => p.puntos_posicion > 0).length || 0;

          return {
            id: member.id,
            userId: member.usuario_id,
            isAdmin: member.es_admin,
            status: member.estado,
            joinedAt: member.joined_at,
            name: member.users.nombre,
            lastName: member.users.apellido,
            email: member.users.email,
            fullName: `${member.users.nombre} ${member.users.apellido}`.trim(),
            puntos: Math.round(totalPoints),
            exactos: exactos
          };
        })
      );

      setMembers(transformedMembers);
    } catch (err) {
      console.error('Error loading members:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (memberId) => {
    try {
      const { error: deleteError } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);

      if (deleteError) throw deleteError;

      // Actualizar lista local
      setMembers(prev => prev.filter(m => m.id !== memberId));
      
      return { success: true };
    } catch (err) {
      console.error('Error removing member:', err);
      return { success: false, error: err.message };
    }
  };

  const makeAdmin = async (memberId) => {
    try {
      const { error: updateError } = await supabase
        .from('group_members')
        .update({ es_admin: true })
        .eq('id', memberId);

      if (updateError) throw updateError;

      // Actualizar lista local
      setMembers(prev => prev.map(m => 
        m.id === memberId ? { ...m, isAdmin: true } : m
      ));

      return { success: true };
    } catch (err) {
      console.error('Error making admin:', err);
      return { success: false, error: err.message };
    }
  };

  const removeAdmin = async (memberId) => {
    try {
      const { error: updateError } = await supabase
        .from('group_members')
        .update({ es_admin: false })
        .eq('id', memberId);

      if (updateError) throw updateError;

      // Actualizar lista local
      setMembers(prev => prev.map(m => 
        m.id === memberId ? { ...m, isAdmin: false } : m
      ));

      return { success: true };
    } catch (err) {
      console.error('Error removing admin:', err);
      return { success: false, error: err.message };
    }
  };

  const leaveGroup = async (userId) => {
    try {
      const { error: deleteError } = await supabase
        .from('group_members')
        .delete()
        .eq('grupo_id', groupId)
        .eq('usuario_id', userId);

      if (deleteError) throw deleteError;

      return { success: true };
    } catch (err) {
      console.error('Error leaving group:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    loadMembers();
  }, [groupId]);

  return {
    members,
    loading,
    error,
    removeMember,
    makeAdmin,
    removeAdmin,
    leaveGroup,
    refresh: loadMembers
  };
}