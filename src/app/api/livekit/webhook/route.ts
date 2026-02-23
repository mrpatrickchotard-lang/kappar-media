import { WebhookReceiver } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Not configured' }, { status: 500 });
    }

    const receiver = new WebhookReceiver(apiKey, apiSecret);

    const body = await request.text();
    const authHeader = request.headers.get('authorization') || '';

    const event = await receiver.receive(body, authHeader);

    // Log the event for monitoring
    console.log(`[LiveKit Webhook] Event: ${event.event}`, {
      room: event.room?.name,
      participant: event.participant?.identity,
      timestamp: new Date().toISOString(),
    });

    switch (event.event) {
      case 'room_started': {
        console.log(`[LiveKit] Room started: ${event.room?.name}`);
        // Room created — could update booking status to 'in_progress'
        break;
      }

      case 'participant_joined': {
        console.log(`[LiveKit] Participant joined: ${event.participant?.identity} in room ${event.room?.name}`);
        break;
      }

      case 'participant_left': {
        console.log(`[LiveKit] Participant left: ${event.participant?.identity} from room ${event.room?.name}`);
        break;
      }

      case 'room_finished': {
        const room = event.room;
        if (room) {
          const durationSeconds = room.activeRecording
            ? 0
            : Math.floor((Date.now() / 1000) - Number(room.creationTime || 0));
          console.log(`[LiveKit] Room finished: ${room.name}, duration: ${durationSeconds}s, participants: ${room.numParticipants}`);
          // Here you would update the booking with actual call duration
          // and trigger billing based on the room name (which contains the bookingId)
          // e.g., await updateBookingDuration(roomName, durationSeconds);
        }
        break;
      }

      case 'egress_started': {
        console.log(`[LiveKit] Recording started for room: ${event.room?.name}`);
        break;
      }

      case 'egress_ended': {
        console.log(`[LiveKit] Recording ended for room: ${event.room?.name}`);
        break;
      }

      default:
        console.log(`[LiveKit] Unhandled event: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[LiveKit Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
