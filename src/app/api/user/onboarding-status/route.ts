import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email || typeof email !== 'string') {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // You cannot use localStorage on the server.
  // Replace this with your database lookup logic.
  // Example: const userData = await getUserDataFromDB(email);

  // For demonstration, always return not onboarded:
  return new Response(
    JSON.stringify({ isOnboarded: false }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}