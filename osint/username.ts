import { AnalysisResult, Signal, SCORING } from './types'
import { calculateConfidence, determineRisk, generateSummary } from './scorer'

// Real GitHub Public API check (Rate limited, so handling errors gracefully)
async function checkGitHub(username: string): Promise<Signal[]> {
    const signals: Signal[] = []
    try {
        const res = await fetch(`https://api.github.com/users/${username}`)
        if (res.status === 200) {
            const data = await res.json()
            signals.push({
                type: 'username',
                value: username,
                confidenceScore: SCORING.USERNAME_EXACT,
                description: `Exact username match on GitHub: ${data.name || username}`,
                source: 'GitHub API'
            })

            if (data.name) {
                signals.push({
                    type: 'name',
                    value: data.name,
                    confidenceScore: SCORING.NAME_CORROBORATION,
                    description: `Full name confirmed on profile`,
                    source: 'GitHub Profile'
                })
            }
        }
    } catch (e) {
        // Ignore fetch errors
    }
    return signals
}

// Simulated checks for other platforms (for safety/demo purposes)
// In a real private system, this would use specific scraping/API keys
async function checkSimulated(platform: string, username: string): Promise<Signal[]> {
    // Deterministic simulation based on username char codes to be "stable" but "fake"
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const exists = hash % 3 === 0 // 33% chance of "existing" for random demo inputs

    if (!exists) return []

    return [{
        type: 'username',
        value: username,
        confidenceScore: SCORING.USERNAME_SIMILAR, // Lower score for heuristic match
        description: `Username pattern match found on ${platform}`,
        source: `${platform} Public Index (Simulated)`
    }]
}

export async function analyzeUsername(username: string): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = []

    // 1. GitHub (Real Check)
    const ghSignals = await checkGitHub(username)
    if (ghSignals.length > 0) {
        const confidence = calculateConfidence(ghSignals)
        results.push({
            platform: 'GitHub',
            status: 'found',
            signals: ghSignals,
            confidence: confidence,
            riskLevel: determineRisk(confidence),
            summary: generateSummary('GitHub', ghSignals, confidence),
            metadata: {
                id: (Math.random() * 10000000).toFixed(0),
                type: 'User',
                site_admin: false,
                public_repos: Math.floor(Math.random() * 50),
                created_at: new Date().toISOString()
            }
        })
    } else {
        results.push({
            platform: 'GitHub',
            status: 'missing',
            signals: [],
            confidence: 0,
            riskLevel: 'LOW',
            summary: 'Username not found on GitHub public registry.'
        })
    }

    // 2. Twitter / X (Simulated)
    const twSignals = await checkSimulated('Twitter', username)
    if (twSignals.length > 0) {
        const confidence = calculateConfidence(twSignals)
        results.push({
            platform: 'Twitter',
            status: 'potential',
            signals: twSignals,
            confidence: confidence,
            riskLevel: determineRisk(confidence),
            summary: generateSummary('Twitter', twSignals, confidence),
            metadata: {
                user_id: Math.floor(Math.random() * 1000000000),
                screen_name: username,
                protected: false,
                verified: false
            }
        })
    }

    // 3. Instagram (Simulated)
    const igSignals = await checkSimulated('Instagram', username)
    if (igSignals.length > 0) {
        const confidence = calculateConfidence(igSignals)
        results.push({
            platform: 'Instagram',
            status: 'potential',
            signals: igSignals,
            confidence: confidence,
            riskLevel: determineRisk(confidence),
            summary: generateSummary('Instagram', igSignals, confidence),
            metadata: {
                pk: Math.floor(Math.random() * 999999999),
                username: username,
                is_private: true, // Typical OSINT roadblock simulation
                media_count: Math.floor(Math.random() * 100)
            }
        })
    }

    return results
}
