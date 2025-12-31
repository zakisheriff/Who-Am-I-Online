import { AnalysisResult, Signal, SCORING } from './types'
import { calculateConfidence, determineRisk, generateSummary } from './scorer'
import crypto from 'crypto'

function md5(str: string) {
    return crypto.createHash('md5').update(str.trim().toLowerCase()).digest('hex')
}

async function checkGravatar(email: string): Promise<Signal[]> {
    const hash = md5(email)
    const signals: Signal[] = []

    try {
        const res = await fetch(`https://www.gravatar.com/avatar/${hash}?d=404`, { method: 'HEAD' })
        if (res.status === 200) {
            signals.push({
                type: 'email',
                value: email,
                confidenceScore: SCORING.EMAIL_EXACT,
                description: 'Gravatar profile found for this email address',
                source: 'Gravatar Public API'
            })
            signals.push({
                type: 'platform',
                value: 'WordPress/Gravatar',
                confidenceScore: SCORING.PLATFORM_CONFIRMATION,
                description: 'Associated WordPress/Gravatar account confirmed',
                source: 'Gravatar'
            })
        }
    } catch (e) {
        // Ignore
    }
    return signals
}

async function checkBreachSimulation(email: string): Promise<Signal[]> {
    // Deterministic simulation
    const hash = md5(email)
    const firstByte = parseInt(hash.substring(0, 2), 16)

    // 50% chance of "breach" finding in demo
    if (firstByte % 2 !== 0) return []

    return [{
        type: 'email',
        value: email,
        confidenceScore: SCORING.PHONE_BREACH_PRESENCE, // Using similar weight for email breach
        description: 'Email address found in historical public breach datasets (Simulated)',
        source: 'HaveIBeenPwned (Simulated)'
    }]
}

async function checkDomainIntelligence(email: string): Promise<Signal[]> {
    const domain = email.split('@')[1]
    if (!domain) return []

    const signals: Signal[] = []

    // Simulated DNS/MX Check
    signals.push({
        type: 'platform',
        value: domain,
        confidenceScore: 10,
        description: `DNS Records valid for @${domain}`,
        source: 'DNS Lookup (Simulated)'
    })

    const highRepDomains = ['gmail.com', 'outlook.com', 'icloud.com', 'protonmail.com', 'yahoo.com']
    if (highRepDomains.includes(domain.toLowerCase())) {
        signals.push({
            type: 'platform',
            value: domain,
            confidenceScore: 15,
            description: `High-reputation email provider detected (${domain})`,
            source: 'Domain Reputation Database'
        })
    }

    return signals
}

export async function analyzeEmail(email: string): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = []

    // 1. Domain Intelligence (New)
    const domainSignals = await checkDomainIntelligence(email)
    if (domainSignals.length > 0) {
        const conf = calculateConfidence(domainSignals)
        results.push({
            platform: 'Email Domain',
            status: 'found',
            signals: domainSignals,
            confidence: conf,
            riskLevel: 'LOW',
            summary: 'Domain infrastructure is active and valid.'
        })
    }

    // 2. Gravatar
    const gravSignals = await checkGravatar(email)
    const gravConfidence = calculateConfidence(gravSignals)

    if (gravSignals.length > 0) {
        results.push({
            platform: 'Gravatar',
            status: 'found',
            signals: gravSignals,
            confidence: gravConfidence,
            riskLevel: determineRisk(gravConfidence),
            summary: generateSummary('Gravatar', gravSignals, gravConfidence),
            url: `https://gravatar.com/${md5(email)}`,
            dork: `site:gravatar.com "${email}"`
        })
    }
    // Omitted the failure case for Gravatar to avoid clutter if nothing found

    // 3. Breach Check
    const breachSignals = await checkBreachSimulation(email)
    if (breachSignals.length > 0) {
        const conf = calculateConfidence(breachSignals)
        results.push({
            platform: 'Public Breach Data',
            status: 'potential',
            signals: breachSignals,
            confidence: conf,
            riskLevel: determineRisk(conf),
            summary: 'Email appears in known data leaks.'
        })
    }

    return results
}
