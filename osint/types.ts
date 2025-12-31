export interface Signal {
    type: 'email' | 'username' | 'phone' | 'name' | 'platform'
    value: string
    confidenceScore: number
    description: string
    source: string // e.g., 'GitHub Public Profile', 'Gravatar', 'Heuristic'
}

export interface AnalysisResult {
    platform: string
    status: 'found' | 'potential' | 'missing' | 'error'
    signals: Signal[]
    confidence: number // 0-100
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' // derived from confidence
    summary: string
}

export interface AnalysisInput {
    email?: string
    username?: string
    fullName?: string
    phoneNumber?: string
}

/* Constants for Scoring */
export const SCORING = {
    EMAIL_EXACT: 40,
    USERNAME_EXACT: 25,
    USERNAME_SIMILAR: 10,
    PHONE_MATCH: 20, // General phone match
    PHONE_BREACH_PRESENCE: 20,
    NAME_CORROBORATION: 10,
    PLATFORM_CONFIRMATION: 5,
}
