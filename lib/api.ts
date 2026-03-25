import { supabase } from './supabase'
import { analyzeCV, extractFromCV } from './ai'

export type Folder = {
  id: string
  user_id: string
  name: string
  job_title: string
  job_description: string
  required_skills: string[]
  years_experience: number
  cv_count: number
  created_at: string
  updated_at: string
  candidates?: Candidate[]
}

export type Candidate = {
  id: string
  folder_id: string
  name: string
  email: string
  position: string
  score: number
  badge: 'green' | 'yellow' | 'red'
  skills: string[]
  education: string[]
  experience: { role: string; company: string; years: number }[]
  gaps: string[]
  flags: string[]
  match_percentage: number
  created_at: string
  is_deleted?: boolean
  cv_file_url?: string
  raw_text?: string
  phone?: string
  university?: string
  major?: string
  justification?: string
  analysis?: string
}

export interface Job {
  id: string
  folder_id: string
  user_id: string
  job_title: string
  job_description: string
  required_skills: string[]
  years_experience: number
  language: string
  total_processed: number
  status: string
  created_at: string
}

export interface JobScore {
  id: string
  job_id: string
  candidate_id: string
  score: number
  match_percentage: number
  badge: 'green' | 'yellow' | 'red'
  phone?: string
  university?: string
  major?: string
  justification?: string
  analysis?: string
  candidate: Candidate
}

export type PipelineResult = {
  id: string
  folder_id: string
  user_id: string
  job_title: string
  job_description: string
  required_skills: string[]
  years_experience: number
  language: string
  total_processed: number
  status: 'running' | 'completed' | 'failed'
  created_at: string
  rankedCandidates?: Candidate[]
  timestamp?: string
}

export type ActivityItem = {
  id: string
  user_id: string
  folder_id: string | null
  type: 'pipeline_completed' | 'cv_uploaded' | 'folder_created' | 'folder_deleted' | 'candidate_deleted'
  folder_name: string
  score: number | null
  count: number | null
  created_at: string
  // Legacy compatibility
  timestamp?: string
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  language: 'en' | 'fr'
  organization: string | null
  notification_preferences: { email: boolean; push?: boolean }
  updated_at: string
}

// ─── Auth ──────────────────────────────────────────────────
export async function getCurrentUser(): Promise<Profile | null> {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return profile as Profile
}

export async function getProfile(): Promise<Profile | null> {
  return getCurrentUser()
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { success: false, error: error.message }
  return { success: true, user: data.user }
}

export async function registerUser(fullName: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: typeof window !== 'undefined'
        ? `${window.location.origin}/dashboard`
        : undefined,
    },
  })
  if (error) return { success: false, error: error.message }

  // If user already exists (identities is empty array), treat as duplicate
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { success: false, error: 'An account with this email already exists. Please sign in.' }
  }

  // If email confirmation is required, user.session will be null
  if (data.user && !data.session) {
    return { success: true, needsConfirmation: true, user: data.user }
  }

  return { success: true, needsConfirmation: false, user: data.user }
}

export async function logoutUser() {
  await supabase.auth.signOut()
}

// ─── Folders ──────────────────────────────────────────────
export async function getFolders(): Promise<Folder[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function getFolder(folderId: string): Promise<Folder | null> {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('id', folderId)
    .eq('is_deleted', false)
    .single()
  if (error) return null
  return data
}

export async function createFolder(name: string, jobTitle: string, jobDescription = '', requiredSkills: string[] = [], yearsExperience = 0): Promise<Folder | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('folders')
    .insert({ user_id: user.id, name, job_title: jobTitle, job_description: jobDescription, required_skills: requiredSkills, years_experience: yearsExperience })
    .select()
    .single()
  if (error) { console.error(error); return null }

  // Log activity
  await supabase.from('activity_log').insert({
    user_id: user.id,
    folder_id: data.id,
    type: 'folder_created',
    folder_name: name,
  })

  return data
}

export async function updateFolder(folderId: string, name: string, jobTitle: string): Promise<Folder | null> {
  const { data, error } = await supabase
    .from('folders')
    .update({ name, job_title: jobTitle })
    .eq('id', folderId)
    .select()
    .single()
  if (error) { console.error(error); return null }
  return data
}

export async function deleteFolder(folderId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  const folder = await getFolder(folderId)
  if (!folder) return false
  
  const { error } = await supabase
    .from('folders')
    .update({ is_deleted: true })
    .eq('id', folderId)
  
  if (error) { console.error(error); return false }

  if (user) {
    await supabase.from('activity_log').insert({
      user_id: user.id,
      folder_id: null,
      type: 'folder_deleted',
      folder_name: folder.name,
    })
  }
  return true
}

// ─── Candidates ───────────────────────────────────────────
export async function getFolderCandidates(folderId: string): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('folder_id', folderId)
    .eq('is_deleted', false)
    .order('score', { ascending: false })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function deleteCandidate(folderId: string, candidateId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('candidates')
    .update({ is_deleted: true })
    .eq('id', candidateId)
    
  if (error) { console.error(error); return false }

  if (user) {
    const folder = await getFolder(folderId)
    await supabase.from('activity_log').insert({
      user_id: user.id,
      folder_id: folderId,
      type: 'candidate_deleted',
      folder_name: folder?.name || '',
    })
  }
  return true
}

export async function findDuplicateCandidate(email: string): Promise<Candidate | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !email) return null
  
  const { data } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', user.id)
    .eq('email', email)
    .limit(1)
    .maybeSingle()
    
  return data
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
  })
}

export async function uploadCV(
  file: File, 
  folderId: string, 
  options: { updateIfDuplicate?: boolean } = {}
): Promise<{ status: 'success' | 'duplicate' | 'error', candidate?: Candidate }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status: 'error' }

  const base64 = await fileToBase64(file)
  const aiData = await extractFromCV(base64, file.type)
  const text = aiData?.raw_text || ''
  
  const email = aiData?.email || ''
  if (email && !options.updateIfDuplicate) {
    const duplicate = await findDuplicateCandidate(email)
    if (duplicate) return { status: 'duplicate', candidate: duplicate }
  }

  // Upload to storage - sanitize filename (remove quotes, etc)
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${user.id}/${folderId}/${Date.now()}_${sanitizedName}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('cv-files')
    .upload(filePath, file)
    
  if (uploadError) {
    console.error(uploadError)
    return { status: 'error' }
  }

  const updates = {
    folder_id: folderId,
    user_id: user.id,
    name: aiData?.name || file.name.replace('.pdf', ''),
    email: email,
    phone: aiData?.phone || '',
    university: aiData?.university || '',
    major: aiData?.major || '',
    position: aiData?.position || '',
    skills: aiData?.skills || [],
    education: aiData?.education || [],
    experience: aiData?.experience || [],
    cv_file_url: uploadData?.path || '',
    raw_text: text,
    is_deleted: false,
    score: 0,
    badge: 'red' as const,
    gaps: [],
    flags: [],
    match_percentage: 0
  }

  // If duplicate and updating, update instead of insert
  if (email && options.updateIfDuplicate) {
    const duplicate = await findDuplicateCandidate(email)
    if (duplicate) {
      const { data, error } = await supabase
        .from('candidates')
        .update(updates)
        .eq('id', duplicate.id)
        .select()
        .single()
      if (error) return { status: 'error' }
      return { status: 'success', candidate: data }
    }
  }

  const { data, error } = await supabase
    .from('candidates')
    .insert(updates)
    .select()
    .single()

  if (error) {
    console.error("Supabase Error (RLS check):", error)
    if (error.code === '42501') {
      console.error("RLS Violation: Current User UID is", user.id, "Candidate user_id is", updates.user_id)
      return { status: 'error' }
    }
    return { status: 'error' }
  }

  return { status: 'success', candidate: data }
}

export async function reanalyzeCandidate(candidateId: string): Promise<Candidate | null> {
  const { data: candidate, error: fetchError } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', candidateId)
    .single()
    
  if (fetchError || !candidate || !candidate.cv_file_url) return null

  // Fetch file from storage
  const { data: fileBlob, error: downloadError } = await supabase.storage
    .from('cv-files')
    .download(candidate.cv_file_url)
    
  if (downloadError || !fileBlob) return null

  // Convert to base64
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    const reader_res = reader
    reader_res.onload = () => resolve((reader.result as string).split(',')[1])
    reader_res.onerror = reject
    reader_res.readAsDataURL(fileBlob)
  })

  // Extract with Gemini
  const aiData = await extractFromCV(base64)
  if (!aiData) return null

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Update the candidate record - ensure it belongs to the user
  const { data: updated, error: updateError } = await supabase
    .from('candidates')
    .update({
      name: aiData.name || candidate.name,
      email: aiData.email || candidate.email,
      position: aiData.position || candidate.position,
      skills: aiData.skills || [],
      education: aiData.education || [],
      experience: aiData.experience || [],
      raw_text: aiData.raw_text || candidate.raw_text,
      phone: aiData.phone || candidate.phone,
      university: aiData.university || candidate.university,
      major: aiData.major || candidate.major,
      badge: candidate.badge === 'red' && aiData.skills.length > 0 ? 'yellow' : candidate.badge
    })
    .eq('id', candidateId)
    .eq('user_id', user.id) // Security: only update their own
    .select()
    .single()

  if (updateError) {
    console.error(updateError)
    return null
  }

  return updated
}

// ─── Pipeline ─────────────────────────────────────────────
export async function runPipeline(
  folderId: string,
  jobTitle: string,
  jobDescription: string,
  requiredSkills: string[],
  yearsExperience: number,
  language: string,
): Promise<Job | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get candidates in folder
  const candidates = await getFolderCandidates(folderId)
  if (candidates.length === 0) return null

  // Score candidates against job criteria using REAL AI
  const scoredCandidates = []
  
  // Process in small batches to avoid 429 Rate Limits
  const batchSize = 3
  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize)
    const analyses = await Promise.all(batch.map(async (c) => {
      // Use raw_text for more accurate analysis
      const cvContent = c.raw_text || `Candidate: ${c.name}, Position: ${c.position}, Skills: ${c.skills.join(', ')}`
      const result = await analyzeCV(cvContent, jobDescription || jobTitle, requiredSkills, yearsExperience)
      
      if (!result) return { ...c, score: 0, match_percentage: 0, badge: 'red' as const }

      const score = result.score || 0
      return {
        ...c,
        score: score,
        match_percentage: score,
        badge: (score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red') as 'green' | 'yellow' | 'red',
        phone: result.phone || c.phone,
        university: result.university || c.university,
        major: result.major || c.major,
        justification: result.justification || '',
        analysis: result.analysis || result.summary || ''
      }
    }))
    scoredCandidates.push(...analyses)
  }

  scoredCandidates.sort((a, b) => b.score - a.score)

  // Update candidate scores in DB (for general view)
  for (const c of scoredCandidates) {
    await supabase.from('candidates').update({
      score: c.score,
      match_percentage: c.match_percentage,
      badge: c.badge,
    }).eq('id', c.id)
  }

  // Save pipeline result (the Job record)
  const { data: job, error: jobError } = await supabase
    .from('pipeline_results')
    .insert({
      folder_id: folderId,
      user_id: user.id,
      job_title: jobTitle,
      job_description: jobDescription,
      required_skills: requiredSkills,
      years_experience: yearsExperience,
      language: language,
      total_processed: scoredCandidates.length,
      status: 'completed'
    })
    .select()
    .single()

  if (jobError || !job) return null

  // Save snapshot into job_scores for this specific Job
  const scoresToInsert = scoredCandidates.map(c => ({
    job_id: job.id,
    candidate_id: c.id,
    user_id: user.id,
    score: c.score,
    match_percentage: c.match_percentage,
    badge: c.badge,
    phone: c.phone,
    university: c.university,
    major: c.major,
    justification: c.justification,
    analysis: c.analysis
  }))

  await supabase.from('job_scores').insert(scoresToInsert)

  // Log activity
  await supabase.from('activity_log').insert({
    user_id: user.id,
    folder_id: folderId,
    type: 'pipeline_completed',
    folder_name: jobTitle,
    score: scoredCandidates[0]?.score ?? null,
    count: candidates.length,
  })

  return job as Job
}

export async function getJobs(): Promise<Job[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('pipeline_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data || []
}

export async function getJobResults(jobId: string): Promise<JobScore[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('job_scores')
    .select('*, candidate:candidates(*)')
    .eq('job_id', jobId)
    .eq('user_id', user.id)
    .order('score', { ascending: false })

  return data || []
}

export async function getJob(jobId: string): Promise<Job | null> {
  const { data } = await supabase
    .from('pipeline_results')
    .select('*')
    .eq('id', jobId)
    .single()

  return data
}

// ─── Activity ─────────────────────────────────────────────
export async function getRecentActivity(limit = 10): Promise<ActivityItem[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) { console.error(error); return [] }
  return (data || []).map(item => ({
    ...item,
    folder: item.folder_name,
    timestamp: item.created_at,
  }))
}

// ─── Dashboard Metrics ────────────────────────────────────
export async function getDashboardMetrics() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { totalFolders: 0, totalCandidates: 0, averageScore: 0, completedPipelines: 0 }

  const [foldersRes, candidatesRes, pipelinesRes] = await Promise.all([
    supabase.from('folders').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_deleted', false),
    supabase.from('candidates').select('score').eq('user_id', user.id).eq('is_deleted', false),
    supabase.from('pipeline_results').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  const candidates = candidatesRes.data || []
  const avgScore = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + (c.score || 0), 0) / candidates.length)
    : 0

  return {
    totalFolders: foldersRes.count || 0,
    totalCandidates: candidates.length,
    averageScore: avgScore,
    completedPipelines: pipelinesRes.count || 0,
  }
}

// ─── Exports ───────────────────────────────────────────────
export async function exportResultsCSV(candidates: Candidate[]): Promise<string> {
  const headers = ['Rank', 'Name', 'Position', 'Score', 'Skills', 'Gaps']
  const rows = candidates.map((c, idx) => [
    idx + 1, c.name, c.position, c.score, c.skills.join('; '), c.gaps.join('; '),
  ])
  let csv = headers.join(',') + '\n'
  rows.forEach((row) => { csv += row.map((cell) => `"${cell}"`).join(',') + '\n' })
  return csv
}

// ─── Profile ───────────────────────────────────────────────
export async function updateProfile(updates: Partial<Omit<Profile, 'id' | 'email' | 'updated_at'>>): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
  if (error) { console.error(error); return false }
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('profile_updated'))
  }
  return true
}

export async function uploadAvatar(file: File): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (uploadError) {
    console.error(uploadError)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  await updateProfile({ avatar_url: publicUrl })
  return publicUrl
}
