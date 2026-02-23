import { AccessToken } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { roomName, participantName, participantIdentity } = await request.json();

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: 'roomName and participantName are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error('LiveKit API key or secret not configured');
      return NextResponse.json(
        { error: 'Video service not configured' },
        { status: 500 }
      );
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity || participantName.replace(/\s+/g, '-').toLowerCase(),
      name: participantName,
      ttl: '2h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({ token });
  } catch (error) {
    console.error('LiveKit token error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video token' },
      { status: 500 }
    );
  }
}
