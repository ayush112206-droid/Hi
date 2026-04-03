import { NextResponse } from 'next/server';
import crypto from 'crypto';

const SECRET = process.env.VERIFY_SECRET || 'default_secret_for_verification_vip_study_2026';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    const parts = token.split('.');
    if (parts.length !== 3) return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });

    const [userId, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    // Check signature
    const data = `${userId}.${timestamp}`;
    const expectedSignature = crypto.createHmac('sha256', SECRET).update(data).digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid token signature' }, { status: 400 });
    }

    // Check expiry (24 hours)
    const now = Date.now();
    if (now - timestamp > 24 * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error('Validate Token Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
