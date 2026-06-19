export type Tone = 'Empathetic' | 'Urgent' | 'Educational' | 'Friendly' | 'Professional'

export type Channel = 'social' | 'google' | 'email'

export type ProductType =
  | 'Term life'
  | 'Whole life'
  | 'Final expense'
  | 'Universal life'
  | 'Mortgage protection'
  | 'IUL'

export type TargetAudience =
  | 'Parents with young children'
  | 'Seniors 60+'
  | 'Newlyweds'
  | 'Small business owners'
  | 'Homeowners'
  | 'Veterans'
  | 'New homebuyers'

export interface CampaignBrief {
  name: string
  product: ProductType
  audience: TargetAudience
  sellingPoints: string
  cta: string
  tone: Tone
  channels: Channel[]
}

export interface SocialAds {
  facebook_headline: string
  facebook_body: string
  instagram_caption: string
  x_post: string
}

export interface GoogleAds {
  headline1: string
  headline2: string
  headline3: string
  description1: string
  description2: string
}

export interface EmailAd {
  subject_line: string
  preview_text: string
  body: string
}

export interface GeneratedOutput {
  social?: SocialAds
  google?: GoogleAds
  email?: EmailAd
}

export interface Campaign {
  id: string
  user_id: string
  name: string
  product: string
  audience: string
  selling_points: string | null
  cta: string | null
  tone: string
  channels: Channel[]
  output: GeneratedOutput | null
  created_at: string
  updated_at: string
}

export interface GenerateRequest {
  product: string
  audience: string
  sellingPoints: string
  cta: string
  tone: string
  channels: Channel[]
}

export interface ApiError {
  error: string
}

export type LeadStage = 'new' | 'contacted' | 'qualified' | 'quoted' | 'closed_won' | 'closed_lost'

export type LeadProductType =
  | 'mortgage_protection'
  | 'iul'
  | 'final_expense'
  | 'term_life'
  | 'whole_life'

export type LeadSource = 'landing_page' | 'booking' | 'manual' | 'import'

export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor'

export type Urgency = 'immediately' | '1_3_months' | '3_6_months' | 'researching'

export interface Lead {
  id: string
  user_id: string
  name: string
  email: string
  phone: string | null
  product_interest: LeadProductType
  coverage_amount: string | null
  age: number | null
  health_status: HealthStatus | null
  urgency: Urgency | null
  notes: string | null
  score: number | null
  score_reason: string | null
  ai_script: string | null
  stage: LeadStage
  assigned_to: string | null
  source: LeadSource
  utm_campaign: string | null
  utm_source: string | null
  landing_page_slug: string | null
  deal_value: number | null
  closed_at: string | null
  created_at: string
  updated_at: string
}

export interface LeadSubmitRequest {
  name: string
  email: string
  phone?: string
  product_interest: LeadProductType
  coverage_amount?: string
  age?: number
  health_status?: HealthStatus
  urgency?: Urgency
  landing_page_slug?: string
  utm_campaign?: string
  utm_source?: string
}

export interface VettingResult {
  score: number
  score_reason: string
  ai_script: string
}

export interface LandingPage {
  id: string
  user_id: string
  slug: string
  title: string
  headline: string
  subheadline: string | null
  product_type: LeadProductType | null
  cta_text: string
  active: boolean
  created_at: string
}

export const PRODUCT_LABELS: Record<LeadProductType, string> = {
  mortgage_protection: 'Mortgage Protection',
  iul: 'Indexed Universal Life',
  final_expense: 'Final Expense',
  term_life: 'Term Life',
  whole_life: 'Whole Life',
}

export const STAGE_LABELS: Record<LeadStage, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  quoted: 'Quoted',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
}

export const STAGE_ORDER: LeadStage[] = [
  'new', 'contacted', 'qualified', 'quoted', 'closed_won', 'closed_lost'
]

// ── Sequences ──────────────────────────────────────────────────────────────

export type SequenceChannel = 'email' | 'sms'
export type EnrollmentStatus = 'active' | 'paused' | 'completed' | 'unsubscribed'

export interface Sequence {
  id: string
  user_id: string
  name: string
  product_type: LeadProductType | null
  active: boolean
  created_at: string
}

export interface SequenceStep {
  id: string
  sequence_id: string
  step_number: number
  delay_hours: number
  channel: SequenceChannel
  subject: string | null
  body: string
  ai_personalized: boolean
  created_at: string
}

export interface SequenceEnrollment {
  id: string
  lead_id: string
  sequence_id: string
  current_step: number
  status: EnrollmentStatus
  enrolled_at: string
  next_send_at: string | null
  completed_at: string | null
}

export interface SequenceSend {
  id: string
  enrollment_id: string
  step_id: string
  lead_id: string
  channel: SequenceChannel
  subject: string | null
  body: string
  status: string
  sent_at: string
}

// ── Appointments ───────────────────────────────────────────────────────────

export type AppointmentStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export interface BookingSettings {
  user_id: string
  username: string
  display_name: string
  bio: string | null
  call_duration_minutes: number
  timezone: string
  available_days: number[]
  available_start_time: string
  available_end_time: string
  buffer_minutes: number
  booking_notice_hours: number
  active: boolean
}

export interface Appointment {
  id: string
  agent_user_id: string
  lead_id: string | null
  booker_name: string
  booker_email: string
  booker_phone: string | null
  product_interest: string | null
  notes: string | null
  scheduled_at: string
  duration_minutes: number
  status: AppointmentStatus
  cancellation_reason: string | null
  created_at: string
}

// ── Team ───────────────────────────────────────────────────────────────────

export type TeamRole = 'owner' | 'admin' | 'agent'
export type TeamMemberStatus = 'pending' | 'active' | 'disabled'

export interface TeamMember {
  id: string
  owner_user_id: string
  member_user_id: string | null
  email: string
  role: TeamRole
  status: TeamMemberStatus
  invite_token: string | null
  invited_at: string
  accepted_at: string | null
}

// ── Client Portal ──────────────────────────────────────────────────────────

export interface ClientPortal {
  id: string
  lead_id: string
  user_id: string
  portal_token: string
  policy_type: string | null
  policy_number: string | null
  carrier: string | null
  coverage_amount: string | null
  monthly_premium: string | null
  policy_start_date: string | null
  notes: string | null
  active: boolean
  created_at: string
}

export interface ClientDocument {
  id: string
  portal_id: string
  name: string
  description: string | null
  file_url: string
  file_type: string | null
  uploaded_at: string
}

// ── Analytics ──────────────────────────────────────────────────────────────

export interface AnalyticsKPIs {
  total_leads: number
  leads_this_month: number
  conversion_rate: number
  avg_deal_value: number
  total_revenue: number
  hot_leads: number
}

export interface LeadsOverTime {
  date: string
  count: number
}

export interface LeadsByProduct {
  product: string
  count: number
}

export interface PipelineFunnel {
  stage: string
  count: number
}
