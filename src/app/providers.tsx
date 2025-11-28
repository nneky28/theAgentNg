
'use client'

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import React from 'react'

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function SessionProviders({ children, session }: ProvidersProps): React.ReactElement {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}