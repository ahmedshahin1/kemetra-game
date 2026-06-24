/**
 * Kemetra AI Service
 * Communicates with the local AI backend via ngrok to generate
 * dynamic, region-specific quiz questions.
 *
 * Falls back to OpenRouter if the local backend is unreachable.
 */

const AI_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL;
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build the prompt for quiz question generation.
 */
function buildPrompt(region, language, count = 5) {
    const lang = language === 'ar' ? 'Arabic' : 'English';
    return `You are an expert Egyptologist and historian. Generate ${count} multiple-choice quiz questions about the Egyptian region "${region}" in ${lang}.

Each question MUST follow this exact JSON structure:
{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correct": <index 0-3>,
  "fact": "A short interesting historical fact explaining the correct answer."
}

Rules:
- Return ONLY a raw JSON array of ${count} question objects. No markdown, no extra text.
- All 4 options must be plausible and historically grounded.
- Questions should cover pharaonic, Islamic, Coptic, and modern history of the region.
- The "fact" field must be 1–2 sentences.`;
}

/**
 * Parse the AI response text into a valid question array.
 * Handles cases where the model wraps the JSON in markdown code fences.
 */
function parseQuestions(text) {
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) throw new Error('Response is not an array');
    return parsed.filter(
        q => q.question && Array.isArray(q.options) && q.options.length === 4 && typeof q.correct === 'number' && q.fact
    );
}

// ---------------------------------------------------------------------------
// Primary: Local AI Backend (ngrok)
// ---------------------------------------------------------------------------

async function fetchFromLocalBackend(region, language, count) {
    if (!AI_BASE_URL) throw new Error('VITE_AI_API_BASE_URL is not set');

    const prompt = buildPrompt(region, language, count);

    const response = await fetch(`${AI_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // ngrok requires this header to bypass the browser warning page
            'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
            model: 'gemma3:4b',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            stream: false,
        }),
        signal: AbortSignal.timeout(20000), // 20-second timeout
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Local AI backend error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from local AI backend');

    return parseQuestions(content);
}

// ---------------------------------------------------------------------------
// Fallback: OpenRouter
// ---------------------------------------------------------------------------

async function fetchFromOpenRouter(region, language, count) {
    if (!OPENROUTER_KEY) throw new Error('VITE_OPENROUTER_API_KEY is not set');

    const prompt = buildPrompt(region, language, count);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENROUTER_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Kemetra',
        },
        body: JSON.stringify({
            model: 'google/gemini-flash-1.5',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        }),
        signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenRouter');

    return parseQuestions(content);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate quiz questions for a given Egyptian region using the AI backend.
 *
 * @param {string} region    - The region name (e.g. "Cairo", "Luxor")
 * @param {string} language  - Language code: 'en' or 'ar'
 * @param {number} count     - Number of questions to request (default: 5)
 * @returns {Promise<Array>} - Array of question objects
 */
export async function generateAIQuestions(region, language = 'en', count = 5) {
    // Try local backend first
    try {
        console.log(`[Kemetra AI] Fetching ${count} questions for "${region}" from local backend...`);
        const questions = await fetchFromLocalBackend(region, language, count);
        if (questions.length > 0) {
            console.log(`[Kemetra AI] ✅ Got ${questions.length} questions from local backend.`);
            return questions;
        }
        throw new Error('Local backend returned 0 valid questions');
    } catch (localErr) {
        console.warn(`[Kemetra AI] Local backend failed: ${localErr.message}. Falling back to OpenRouter...`);
    }

    // Fallback to OpenRouter
    try {
        const questions = await fetchFromOpenRouter(region, language, count);
        console.log(`[Kemetra AI] ✅ Got ${questions.length} questions from OpenRouter.`);
        return questions;
    } catch (openRouterErr) {
        console.error(`[Kemetra AI] OpenRouter also failed: ${openRouterErr.message}`);
        throw new Error('All AI sources failed. Falling back to static knowledge base.');
    }
}
