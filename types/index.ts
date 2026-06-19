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
