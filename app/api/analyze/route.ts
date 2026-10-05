import { NextRequest, NextResponse } from 'next/server';
import { analyzeEnvironmentalReport } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location, description, image, voiceTranscript } = body;

    const effectiveDescription = (description && description.trim() !== '')
      ? description.trim()
      : (voiceTranscript && voiceTranscript.trim() !== '')
      ? voiceTranscript.trim()
      : '';

    if (!effectiveDescription && !image) {
      return NextResponse.json(
        { error: 'Please provide an image, description, or voice note for environmental analysis.' },
        { status: 400 }
      );
    }

    if (!location) {
      return NextResponse.json(
        { error: 'Location is required.' },
        { status: 400 }
      );
    }

    // Call server-side Gemini AI analysis with multimodal and voice transcript support
    const analysis = await analyzeEnvironmentalReport(
      location, 
      effectiveDescription || 'Visible environmental concern documented via photo.', 
      image,
      voiceTranscript
    );

    return NextResponse.json(analysis);
  } catch (err: any) {
    console.error('API /api/analyze error:', err);
    return NextResponse.json(
      { error: "GreenMind couldn't complete the analysis. Please try again." },
      { status: 500 }
    );
  }
}
