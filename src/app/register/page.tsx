
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  type Auth,
} from "firebase/auth";
import { getFirestore, doc, setDoc, type Firestore } from "firebase/firestore";
import { app } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  let auth: Auth | null = null;
  let db: Firestore | null = null;
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    auth = getAuth(app);
    db = getFirestore(app);
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) {
      setError("Firebase is not configured. Please check your environment variables.");
      return;
    }
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });

      // Create user profile and settings in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        id: user.uid,
        displayName: username,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      });
      
      const settingsDocRef = doc(db, `users/${user.uid}/settings`, 'app-settings');
      await setDoc(settingsDocRef, {
        userId: user.uid,
        theme: 'dark',
        notifications: {
            peakUsage: true,
            suggestions: true,
        }
      });


      router.push("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !db) {
      setError("Firebase is not configured. Please check your environment variables.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create user profile and settings in Firestore for new Google user
      const userDocRef = doc(db, "users", user.uid);
       await setDoc(userDocRef, {
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      }, { merge: true });

       const settingsDocRef = doc(db, `users/${user.uid}/settings`, 'app-settings');
       await setDoc(settingsDocRef, {
        userId: user.uid,
        theme: 'dark',
        notifications: {
            peakUsage: true,
            suggestions: true,
        }
      }, { merge: true });

      router.push("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm glass-card">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-3xl font-bold text-foreground">
              Voltify
            </h1>
          </div>
          <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Join Voltify to start managing your energy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Registration Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="John Doe"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.85 1.62-2.92 0-5.28-2.34-5.28-5.28s2.36-5.28 5.28-5.28c1.58 0 2.72.68 3.42 1.34l2.64-2.64C16.92 3.82 14.92 3 12.48 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c4.85 0 8.7-3.32 8.7-8.7v-1.12z"
              ></path>
            </svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="w-full">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
