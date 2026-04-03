import { NextResponse } from 'next/server';
import crypto from 'crypto';

const SECRET = process.env.VERIFY_SECRET || 'default_secret_for_verification_vip_study_2026';
const VPLINK_API = process.env.VPLINK_API || '64cb3994119c683652e7f241880b1f4b3dda5e37';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    // Generate token: userId.timestamp.signature
    const timestamp = Date.now();
    const data = `${userId}.${timestamp}`;
    const signature = crypto.createHmac('sha256', SECRET).update(data).digest('hex');
    const token = `${data}.${signature}`;

    // The destination link
    let appUrl = process.env.APP_URL || process.env.URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
    if (!appUrl) {
      const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
      const protocol = req.headers.get('x-forwarded-proto') || 'https';
      appUrl = host ? `${protocol}://${host}` : 'http://localhost:3000';
    }
    const baseUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;
    const destinationLink = `${baseUrl}/verify/${token}`;

    // Call VPLINK API
    const vplinkUrl = `https://vplink.in/api?api=${VPLINK_API}&url=${encodeURIComponent(destinationLink)}&format=text`;
    
    let shortLink = '';
    try {
      const response = await fetch(vplinkUrl);
      shortLink = await response.text();
    } catch (fetchError) {
      console.error('VPLINK Network Error:', fetchError);
    }

    if (!shortLink || !shortLink.startsWith('http')) {
      console.error('VPLINK API Error:', shortLink);
      // Fallback to the direct link if shortening fails
      return NextResponse.json({ shortLink: destinationLink });
    }

    return NextResponse.json({ shortLink });
  } catch (error) {
    console.error('Generate Token Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
