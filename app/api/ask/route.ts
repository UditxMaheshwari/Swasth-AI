import { NextRequest, NextResponse } from 'next/server';

// Helper functions (converted from Python backend)
function removeMarkdown(text: string): string {
  text = text.replace(/\*\*.*?\*\*/g, '');
  text = text.replace(/[\*\-] /g, '');
  text = text.replace(/[#\*_\[\]()]/g, '');
  text = text.replace(/\n+/g, '\n').trim();
  return text;
}

function formatText(text: string): string {
  const sections = text.split('\n');
  return sections
    .map(section => section.trim())
    .filter(section => section)
    .join('\n\n');
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    
    if (!question) {
      return NextResponse.json(
        { error: 'No question provided' },
        { status: 400 }
      );
    }

    // Import dynamic modules (these would need to be replaced with actual API calls)
    const teamApiKey = process.env.TEAM_API_KEY;
    const docModelId = process.env.DOC_MODEL_ID;
    const summModelId = process.env.SUMM_MODEL_ID;
    const agentModelId = process.env.AGENT_MODEL_ID;

    if (!teamApiKey || !agentModelId) {
      return NextResponse.json(
        { error: 'Missing required API keys' },
        { status: 500 }
      );
    }

    // Detect language (simplified - you might want to use a proper language detection library)
    const outputLanguage = 'english'; // Default to English for now
    const formattedQuery = `${question} Response in ${outputLanguage}`;

    // Make API call to aiXplain (you'll need to implement this based on their API)
    const agentResponse = await fetch('https://models.aixplain.com/api/v1/execute', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${teamApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: agentModelId,
        data: formattedQuery,
      }),
    });

    if (!agentResponse.ok) {
      throw new Error('Failed to get response from AI agent');
    }

    const agentData = await agentResponse.json();
    const formattedResponse = agentData.data?.output || 'No response available';
    const formResponse = removeMarkdown(formattedResponse);
    const agentAnswer = formatText(formResponse);

    // Get summary (if summary model is available)
    let summary = agentAnswer;
    if (summModelId) {
      try {
        const summResponse = await fetch('https://models.aixplain.com/api/v1/execute', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${teamApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model_id: summModelId,
            data: {
              question,
              response: agentAnswer.replace(/\n/g, ' ').replace(/"/g, '\\"').replace(/'/g, "\\'"),
              language: outputLanguage,
            },
          }),
        });

        if (summResponse.ok) {
          const summData = await summResponse.json();
          const correctedText = summData.data || agentAnswer;
          const corrText = removeMarkdown(correctedText);
          summary = formatText(corrText);
        }
      } catch (error) {
        console.error('Summary generation failed:', error);
      }
    }

    return NextResponse.json({
      response: agentAnswer,
      summary: summary,
    });

  } catch (error) {
    console.error('Error in /api/ask:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
