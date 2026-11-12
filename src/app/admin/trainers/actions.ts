'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/authorization'
import {
  trainerAssignmentInputSchema,
  trainerInputSchema,
} from '@/lib/validations/trainer'

export type TrainerActionState = {
  status: 'idle' | 'error' | 'success'
  message: string
}

function getText(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function saveTrainerAction(
  _previousState: TrainerActionState,
  formData: FormData,
): Promise<TrainerActionState> {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const parsed = trainerInputSchema.safeParse({
    id: getText(formData, 'id'),
    displayName: getText(formData, 'displayName'),
    bio: getText(formData, 'bio'),
    specialties: getText(formData, 'specialties'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Check the trainer details and try again.',
    }
  }

  const { id, ...trainer } = parsed.data
  const values = {
    display_name: trainer.displayName,
    bio: trainer.bio || null,
    specialties: trainer.specialties,
  }
  const result = id
    ? await supabase.from('trainers').update(values).eq('id', id).select('id').single()
    : await supabase.from('trainers')
      .insert({ ...values, profile_id: null, is_active: true })
      .select('id')
      .single()

  if (result.error || !result.data) {
    return { status: 'error', message: 'The trainer could not be saved. Please try again.' }
  }

  revalidatePath('/admin/trainers')
  revalidatePath('/trainer')
  return { status: 'success', message: id ? 'Trainer details updated.' : 'Trainer added.' }
}

export async function setTrainerActiveAction(
  _previousState: TrainerActionState,
  formData: FormData,
): Promise<TrainerActionState> {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const trainerId = getText(formData, 'trainerId')
  const activeText = getText(formData, 'active')
  const parsedId = trainerInputSchema.shape.id.safeParse(trainerId)
  if (!parsedId.success || !parsedId.data || activeText !== 'true' && activeText !== 'false') {
    return { status: 'error', message: 'Invalid trainer status request.' }
  }

  const { error } = await supabase.rpc('set_trainer_active', {
    target_trainer_id: parsedId.data,
    target_is_active: activeText === 'true',
  })
  if (error) {
    return {
      status: 'error',
      message: error.code === 'P0002' ? 'Trainer not found.' : 'Unable to update trainer status.',
    }
  }

  revalidatePath('/admin/trainers')
  revalidatePath('/trainer')
  return { status: 'success', message: activeText === 'true' ? 'Trainer activated.' : 'Trainer archived; active assignments have ended.' }
}

export async function assignTrainerAction(
  _previousState: TrainerActionState,
  formData: FormData,
): Promise<TrainerActionState> {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const parsed = trainerAssignmentInputSchema.safeParse({
    trainerId: getText(formData, 'trainerId'),
    memberNumber: getText(formData, 'memberNumber'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Select a trainer and enter a member number.',
    }
  }

  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('id')
    .eq('member_number', parsed.data.memberNumber)
    .eq('status', 'ACTIVE')
    .maybeSingle()
  if (memberError) {
    return { status: 'error', message: 'Unable to verify that member. Please try again.' }
  }
  if (!member) {
    return { status: 'error', message: 'No active member was found with that member number.' }
  }

  const { data: assignmentId, error } = await supabase.rpc('assign_trainer', {
    target_trainer_id: parsed.data.trainerId,
    target_member_id: member.id,
  })
  if (error || !assignmentId) {
    return {
      status: 'error',
      message: error?.code === '23505'
        ? 'This trainer is already assigned to that member.'
        : error?.code === 'P0002'
          ? 'The trainer or member is no longer active.'
          : 'Unable to assign this trainer. Please try again.',
    }
  }

  revalidatePath('/admin/trainers')
  revalidatePath('/trainer')
  revalidatePath('/member')
  return { status: 'success', message: 'Trainer assigned to the member.' }
}

export async function endTrainerAssignmentAction(
  _previousState: TrainerActionState,
  formData: FormData,
): Promise<TrainerActionState> {
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const assignmentId = getText(formData, 'assignmentId')
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(assignmentId)) {
    return { status: 'error', message: 'Invalid assignment.' }
  }

  const { data, error } = await supabase
    .from('trainer_assignments')
    .update({ ended_at: new Date().toISOString() })
    .eq('id', assignmentId)
    .is('ended_at', null)
    .select('id')
    .maybeSingle()

  if (error || !data) {
    return { status: 'error', message: 'Unable to end this assignment. Refresh and try again.' }
  }

  revalidatePath('/admin/trainers')
  revalidatePath('/trainer')
  revalidatePath('/member')
  return { status: 'success', message: 'Trainer assignment ended.' }
}
