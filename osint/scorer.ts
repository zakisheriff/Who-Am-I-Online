import { Signal, AnalysisResult, SCORING } from './types'

export function calculateConfidence(signals: Signal[]): number {
    let score = 0

    for (const signal of signals) {
        score += signal.confidenceScore
    }

    // Cap at 100
    return Math.min(Math.round(score), 100)
}

export function determineRisk(confidence: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (confidence >= 70) return 'HIGH'
    if (confidence >= 40) return 'MEDIUM'
    return 'LOW'
}

export function generateSummary(platform: string, signals: Signal[], confidence: number): string {
    if (confidence > 80) return `CONFIRMED: Target identity successfully isolated on ${platform}. Data integrity verified.`
    if (confidence > 50) return `POTENTIAL: Strong heuristic correlation detected on ${platform}. Probable match.`
    return `WEAK: Low-fidelity signal. Insufficient data for positive attribution.`
}
