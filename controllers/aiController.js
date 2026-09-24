const { GoogleGenAI } = require('@google/genai');

/**
 * Helper function for smart fallback auto-fill analysis
 * used when GEMINI_API_KEY is not provided or API call fails.
 */
function heuristicAutoFill(rawInput) {
  const text = (rawInput || '').toLowerCase();

  let category = 'Other';
  let priority = 'Medium';
  let suggestedDepartment = 'General Civic Maintenance';

  if (text.includes('pothole') || text.includes('road') || text.includes('asphalt') || text.includes('crack') || text.includes('tar') || text.includes('street')) {
    category = 'Roads & Potholes';
    suggestedDepartment = 'Public Works Department (PWD)';
    priority = text.includes('accident') || text.includes('deep') || text.includes('danger') || text.includes('main road') ? 'High' : 'Medium';
  } else if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('tank') || text.includes('supply') || text.includes('tap')) {
    category = 'Water Supply';
    suggestedDepartment = 'Water Supply & Sanitation Department';
    priority = text.includes('burst') || text.includes('flood') || text.includes('no water') || text.includes('contaminat') ? 'Urgent' : 'High';
  } else if (text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('dump') || text.includes('smell') || text.includes('clean')) {
    category = 'Waste Management';
    suggestedDepartment = 'Solid Waste Management Department';
    priority = text.includes('block') || text.includes('overflow') || text.includes('health') ? 'High' : 'Medium';
  } else if (text.includes('light') || text.includes('lamp') || text.includes('dark') || text.includes('pole') || text.includes('electric')) {
    category = 'Street Lighting';
    suggestedDepartment = 'Electrical & Street Lighting Department';
    priority = text.includes('dark') || text.includes('night') || text.includes('unsafe') ? 'Medium' : 'Low';
  } else if (text.includes('drain') || text.includes('sewer') || text.includes('gutter') || text.includes('overflow') || text.includes('clog')) {
    category = 'Drainage & Sewage';
    suggestedDepartment = 'Drainage & Sewage Board';
    priority = text.includes('overflow') || text.includes('stink') || text.includes('rain') ? 'High' : 'Medium';
  } else if (text.includes('dog') || text.includes('crime') || text.includes('fire') || text.includes('tree') || text.includes('hazard') || text.includes('safety')) {
    category = 'Public Safety';
    suggestedDepartment = 'Municipal Safety & Emergency Cell';
    priority = 'High';
  }

  // Extract location/landmark heuristic
  let landmark = 'Salokhenagar, Ward No. 4, Kolhapur';
  const nearMatch = rawInput.match(/(?:near|at|opposite|behind|beside|by|around|in)\s+([A-Za-z0-9\s,&-]+?)(?=\.|\,|$|and|with)/i);
  if (nearMatch && nearMatch[1].trim().length > 3) {
    landmark = `${nearMatch[1].trim()}, Salokhenagar, Kolhapur`;
  }

  // Title generation
  const cleanInput = rawInput.replace(/[^\w\s]/gi, '').trim();
  const words = cleanInput.split(/\s+/).slice(0, 7).join(' ');
  const formattedTitle = words.length > 5 
    ? `${words.charAt(0).toUpperCase() + words.slice(1)} - ${category}`
    : `Civic Issue: ${category} in Salokhenagar`;

  // Expanded description
  const description = `${rawInput.trim()}\n\n[AI Assessment Note]: Issue categorized under ${category} with ${priority} priority. Immediate inspection recommended by ${suggestedDepartment} to prevent public inconvenience or safety hazards in Salokhenagar Ward.`;

  return {
    title: formattedTitle,
    category,
    priority,
    landmark,
    description,
    suggestedDepartment,
    urgencyReason: `Priority set to ${priority} based on civic impact analysis for ${category}.`
  };
}

/**
 * Controller: Auto-fill report form using AI
 */
exports.autoFillReport = async (req, res) => {
  try {
    const { prompt, title, description, landmark, category } = req.body;
    const rawInput = prompt || [title, description, landmark, category].filter(Boolean).join(' ');

    if (!rawInput || rawInput.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide issue details or a prompt for AI processing.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are CivicAI, an expert municipal triage assistant for Salokhenagar, Kolhapur.
Your job is to take raw, informal user text describing a civic problem and return a structured JSON object to fill out a civic report form.

Valid Categories MUST be exactly one of:
- "Roads & Potholes"
- "Water Supply"
- "Waste Management"
- "Street Lighting"
- "Drainage & Sewage"
- "Public Safety"
- "Other"

Valid Priorities MUST be exactly one of:
- "Low"
- "Medium"
- "High"
- "Urgent"

Return ONLY a raw JSON object with key names:
{
  "title": "A clear, concise, professional issue title (5-10 words)",
  "category": "One of the valid categories listed above",
  "priority": "One of the valid priorities listed above",
  "landmark": "Specific landmark, street name, or ward detail in Salokhenagar, Kolhapur",
  "description": "A detailed, structured issue description (3-5 sentences explaining problem, impact on residents, and recommended repair action)",
  "suggestedDepartment": "Name of responsible municipal department",
  "urgencyReason": "Brief reason for priority assignment"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Raw citizen input: "${rawInput}"\n\nGenerate structured JSON report fields.`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        const textResponse = response.text;
        const parsedData = JSON.parse(textResponse);

        return res.status(200).json({
          success: true,
          source: 'gemini-ai',
          data: {
            title: parsedData.title || 'Civic Issue Report',
            category: parsedData.category || 'Other',
            priority: parsedData.priority || 'Medium',
            landmark: parsedData.landmark || 'Salokhenagar, Kolhapur',
            description: parsedData.description || rawInput,
            suggestedDepartment: parsedData.suggestedDepartment || 'Municipal Ward Office',
            urgencyReason: parsedData.urgencyReason || 'Standard municipal triage.'
          }
        });
      } catch (aiError) {
        console.warn('Gemini API Error, using heuristic fallback:', aiError.message);
      }
    }

    // Fallback if no API key or API call failed
    const fallbackData = heuristicAutoFill(rawInput);
    return res.status(200).json({
      success: true,
      source: 'civic-ai-engine',
      data: fallbackData
    });

  } catch (error) {
    console.error('AI Auto-Fill Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI auto-fill request.'
    });
  }
};

/**
 * Controller: Conversational AI Chatbot for Citizens
 */
exports.chatWithAi = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are CivicAI Assistant, the friendly, helpful AI bot for Salokhenagar Municipal Ward Portal, Kolhapur.
Your goals:
1. Help citizens report municipal problems (potholes, water leaks, streetlights, garbage, drainage).
2. Answer questions about civic services, priority levels, and reporting steps.
3. Keep responses concise, warm, helpful, and formatted with clean Markdown.
4. If a user describes a specific issue, offer to help them auto-fill the report form!`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `User message: "${message}"`,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });

        return res.status(200).json({
          success: true,
          reply: response.text
        });
      } catch (aiErr) {
        console.warn('Gemini Chat Error, using smart fallback:', aiErr.message);
      }
    }

    // Smart conversational fallback response
    let reply = `Hello! I am **CivicAI Assistant** for Salokhenagar, Kolhapur. 🏙️\n\nI can help you report civic issues, auto-fill your report forms, or check ward details.\n\n`;

    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('report') || lowerMsg.includes('form') || lowerMsg.includes('fill') || lowerMsg.includes('issue')) {
      reply += `To file a report easily, click the **"Report Issue"** button at the top or use my **"✨ Auto-Fill with AI"** tool inside the form!\n\nSimply type what you see (e.g. *"Water pipe burst near Kalamba water tank"*) and AI will automatically structure the title, category, priority, and description for you!`;
    } else if (lowerMsg.includes('status') || lowerMsg.includes('track') || lowerMsg.includes('my reports')) {
      reply += `You can view and track all your submitted issues on the **"My Reports"** page in the top navigation bar! Reports move from **Pending ⏳** $\\rightarrow$ **In Progress 🛠️** $\\rightarrow$ **Resolved ✅**.`;
    } else {
      reply += `How can I help you today? You can describe a local problem like a pothole, broken streetlight, or garbage issue, and I'll help you prepare a report for the ward officers!`;
    }

    return res.status(200).json({
      success: true,
      reply
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process chat message.'
    });
  }
};
