import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, username, whatsappNo, specialization, state, city } = body;

  if (
    !email ||
    !username ||
    !whatsappNo ||
    !specialization ||
    !Array.isArray(specialization) ||
    specialization.length === 0 ||
    !state ||
    !city
  ) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // You cannot use localStorage on the server.
  // Save to your database here instead.

  // Example response:
  return new Response(
    JSON.stringify({ message: 'Onboarding completed successfully' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}