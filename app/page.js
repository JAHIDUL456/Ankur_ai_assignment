'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/dashboard'); 
    return null;
  }

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      
      

      <main className="mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center sm:py-36">
        <section className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/90 shadow-sm ring-1 ring-slate-900/5 px-8 py-14">
          
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Discover events you’ll love
          </h1>
          <p className="mt-3 mx-auto max-w-2xl text-base sm:text-lg text-slate-600">
            Book in seconds and manage everything in your dashboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => router.push('/events')}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-500 active:scale-[.99]"
            >
              Browse events
            </button>
            <button
              onClick={() => router.push('/auth/signin')}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-900 transition hover:bg-slate-50"
            >
              Sign in
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500">No sign-up required to browse events</p>
        </section>
      </main>
    </div>
  );
}
