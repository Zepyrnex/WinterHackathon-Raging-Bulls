
'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/firebase/config';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Apply theme from localStorage on initial load
    const savedTheme = localStorage.getItem('voltify-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;

    // Only proceed with Firebase auth if config is available
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      const auth = getAuth(app);
      const db = getFirestore(app);

      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          // If a user is logged in, check for their theme setting in Firestore
          try {
            const settingsRef = doc(db, `users/${currentUser.uid}/settings`, 'app-settings');
            const settingsSnap = await getDoc(settingsRef);
            if (settingsSnap.exists()) {
              const userSettings = settingsSnap.data();
              const newTheme = userSettings.theme || 'dark';
              if (newTheme !== theme) {
                setTheme(newTheme);
                localStorage.setItem('voltify-theme', newTheme);
                document.documentElement.className = newTheme;
              }
            }
          } catch (error) {
            console.error("Failed to fetch user theme settings:", error);
          }
        }
      });

      return () => unsubscribe();
    }
  }, [theme]);


  return (
    <html lang="en">
      <head>
        <title>Voltify</title>
        <meta name="description" content="Monitor and optimize your energy consumption." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn(
          "font-body antialiased",
        )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
