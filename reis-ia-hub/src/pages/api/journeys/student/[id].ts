import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase-server';
import { notifyAdmins, notify } from '../../../../lib/notifications';

export const prerender = false;

async function checkJourneyAccess(supabase: ReturnType<typeof createServerClient>, journeyId: string, profileId: string, isAdmin: boolean) {
  if (isAdmin) return true;
  const { data } = await supabase
    .from('student_journeys')
    .select('id')
    .eq('id', journeyId)
    .eq('student_id', profileId)
    .single();
  return !!data;
}

export const GET: APIRoute = async ({ params, locals }) => {
  const profile = locals.profile;
  if (!profile?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });

  const supabase = createServerClient();
  const isAdmin = profile.role === 'admin';

  const hasAccess = await checkJourneyAccess(supabase, id, profile.id, isAdmin);
  if (!hasAccess) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  // Fetch journey with phases and nodes
  const { data: journey, error: journeyError } = await supabase
    .from('student_journeys')
    .select(`
      *,
      student:profiles!student_journeys_student_id_fkey(id, full_name, avatar_url, email)
    `)
    .eq('id', id)
    .single();

  if (journeyError) {
    return new Response(JSON.stringify({ error: journeyError.message }), { status: 500 });
  }

  const { data: phases, error: phasesError } = await supabase
    .from('student_journey_phases')
    .select(`
      *,
      nodes:student_journey_nodes(*)
    `)
    .eq('journey_id', id)
    .order('sort_order', { ascending: true });

  if (phasesError) {
    return new Response(JSON.stringify({ error: phasesError.message }), { status: 500 });
  }

  // Sort nodes within each phase
  if (phases) {
    phases.forEach((phase: any) => {
      if (phase.nodes) {
        phase.nodes.sort((a: any, b: any) => a.sort_order - b.sort_order);
      }
    });
  }

  return new Response(JSON.stringify({ ...journey, phases }), { status: 200 });
};

export const PATCH: APIRoute = async ({ params, request, locals }) => {
  const profile = locals.profile;
  if (!profile?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });

  const supabase = createServerClient();
  const isAdmin = profile.role === 'admin';

  const hasAccess = await checkJourneyAccess(supabase, id, profile.id, isAdmin);
  if (!hasAccess) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const body = await request.json();

  // Update node status (student completes, submits)
  if (body.action === 'update_node') {
    const { node_id, status, submission_url, submission_note } = body;
    if (!node_id) return new Response(JSON.stringify({ error: 'node_id required' }), { status: 400 });

    const updatePayload: Record<string, unknown> = {};

    if (status !== undefined) {
      const validStatuses = ['available', 'in_progress', 'completed', 'skipped'];
      // Non-admins can only move to in_progress or completed
      if (!isAdmin && !['in_progress', 'completed'].includes(status)) {
        return new Response(JSON.stringify({ error: 'Invalid status transition' }), { status: 400 });
      }
      if (validStatuses.includes(status)) {
        updatePayload.status = status;
        if (status === 'completed') {
          updatePayload.completed_at = new Date().toISOString();
        }
        if (status === 'in_progress' && !body.started_at) {
          updatePayload.started_at = new Date().toISOString();
        }
      }
    }

    if (submission_url !== undefined) updatePayload.submission_url = submission_url;
    if (submission_note !== undefined) updatePayload.submission_note = submission_note;

    const { data: nodeData, error: nodeError } = await supabase
      .from('student_journey_nodes')
      .update(updatePayload)
      .eq('id', node_id)
      .select()
      .single();

    if (nodeError) return new Response(JSON.stringify({ error: nodeError.message }), { status: 500 });

    // If completing a node, update XP, check phase unlocks, and notify
    if (status === 'completed' && nodeData) {
      // Notify admins — include feedback for checkpoints
      const isCheckpoint = nodeData.content_type === 'checkpoint';
      const feedbackText = submission_note || '';
      notifyAdmins({
        type: isCheckpoint ? 'mentoria' : 'system',
        title: isCheckpoint ? `Checkpoint: ${profile.full_name || 'Aluno'}` : 'Node concluído',
        body: isCheckpoint && feedbackText
          ? `${profile.full_name || 'Aluno'} — "${nodeData.title}"\n\nFeedback: ${feedbackText}`
          : `${profile.full_name || 'Aluno'} concluiu "${nodeData.title}"`,
        link: `/journey/${id}`,
      });

      // Save checkpoint feedback to hub_knowledge
      if (isCheckpoint && feedbackText) {
        await supabase.from('hub_knowledge').insert({
          user_id: profile.id,
          user_name: profile.full_name || null,
          category: 'checkpoint_feedback',
          title: `Checkpoint: ${nodeData.title} — ${profile.full_name || 'Aluno'}`,
          summary: feedbackText.substring(0, 200),
          content: feedbackText,
          source: `journey:${id}`,
          tags: ['checkpoint', 'feedback', 'journey'],
          journey_id: id,
        }).then(() => {}).catch(() => {});
      }
      // Add XP
      const { data: journeyData } = await supabase
        .from('student_journeys')
        .select('total_xp')
        .eq('id', id)
        .single();

      if (journeyData) {
        await supabase
          .from('student_journeys')
          .update({ total_xp: (journeyData.total_xp || 0) + (nodeData.xp_reward || 0) })
          .eq('id', id);
      }

      // Check phase unlocks
      await supabase.rpc('check_phase_unlock', { p_journey_id: id });
    }

    return new Response(JSON.stringify(nodeData), { status: 200 });
  }

  // Admin: leave feedback on a node
  if (body.action === 'feedback') {
    if (!isAdmin) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    const { node_id, mentor_feedback } = body;
    if (!node_id) return new Response(JSON.stringify({ error: 'node_id required' }), { status: 400 });

    const { data, error } = await supabase
      .from('student_journey_nodes')
      .update({ mentor_feedback })
      .eq('id', node_id)
      .select()
      .single();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    // Notify student about feedback
    const { data: journey } = await supabase.from('student_journeys').select('student_id').eq('id', id).single();
    if (journey?.student_id) {
      notify({
        userId: journey.student_id,
        type: 'mentoria',
        title: 'Feedback do mentor',
        body: `Voce recebeu feedback em "${data.title}"`,
        link: `/journey/${id}`,
      });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  }

  // Admin: manually unlock a phase
  if (body.action === 'unlock_phase') {
    if (!isAdmin) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    const { phase_id } = body;
    if (!phase_id) return new Response(JSON.stringify({ error: 'phase_id required' }), { status: 400 });

    await supabase
      .from('student_journey_phases')
      .update({ status: 'available', unlocked_at: new Date().toISOString() })
      .eq('id', phase_id);

    await supabase
      .from('student_journey_nodes')
      .update({ status: 'available' })
      .eq('phase_id', phase_id)
      .eq('status', 'locked');

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  // Admin: add custom node to student journey
  if (body.action === 'add_node') {
    if (!isAdmin) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    const { phase_id, title, description, content_type, content_url, content_body, estimated_minutes, is_required, xp_reward, sort_order } = body;
    if (!phase_id || !title) return new Response(JSON.stringify({ error: 'phase_id and title required' }), { status: 400 });

    // Check if phase belongs to this journey
    const { data: phase } = await supabase
      .from('student_journey_phases')
      .select('id, status')
      .eq('id', phase_id)
      .eq('journey_id', id)
      .single();

    if (!phase) return new Response(JSON.stringify({ error: 'Phase not found' }), { status: 404 });

    const validTypes = ['task', 'material', 'presentation', 'checkpoint', 'quiz'];
    const { data, error } = await supabase
      .from('student_journey_nodes')
      .insert({
        phase_id,
        title,
        description: description || null,
        content_type: validTypes.includes(content_type) ? content_type : 'task',
        content_url: content_url || null,
        content_body: content_body || null,
        estimated_minutes: estimated_minutes || null,
        sort_order: sort_order ?? 0,
        is_required: is_required !== false,
        xp_reward: xp_reward ?? 10,
        status: phase.status === 'locked' ? 'locked' : 'available',
      })
      .select()
      .single();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify(data), { status: 201 });
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
};
