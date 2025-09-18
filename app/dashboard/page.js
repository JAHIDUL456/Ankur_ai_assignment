'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);
  const router = useRouter();

  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetch('/api/bookings')
        .then((res) => res.json())
        .then((data) => setBookings(Array.isArray(data) ? data : []))
        .catch(() => setBookings([]));
    }
  }, [status]);

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;

  const userInitial = (session.user?.name || '?').charAt(0).toUpperCase();

  const cancelBooking = async (id) => {
    setLoadingIds((ids) => [...ids, id]);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      }
    } finally {
      setLoadingIds((ids) => ids.filter((x) => x !== id));
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
            {userInitial}
          </div>
          <span className="text-slate-900 font-medium">{session.user.name}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 h-10 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg"
        >
          Sign Out
        </button>
      </div>

      {(() => {
        const totalTickets = bookings.reduce((sum, b) => sum + Number(b.quantity ?? 1), 0);
        const totalCost = bookings.reduce(
          (sum, b) => sum + Number((b.event?.price || 0) * (b.quantity ?? 1)),
          0
        );
        return (
          <div className="mb-10 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 text-white shadow-lg ring-1 ring-black/10 transition-shadow">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between divide-y sm:divide-y-0 sm:divide-x divide-white/20">
              <div className="flex-1 p-4 sm:p-5">
                <p className="text-[11px] sm:text-xs font-medium tracking-wide text-white/90 flex items-center gap-1.5">
                  Tickets Booked
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-extrabold drop-shadow-sm">{totalTickets}</p>
              </div>
              <div className="flex-1 p-4 sm:p-5">
                <p className="text-[11px] sm:text-xs font-medium tracking-wide text-white/90 flex items-center gap-1.5">
                  Total Cost
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-extrabold drop-shadow-sm">{totalCost.toFixed(0)} TK</p>
              </div>
            </div>
          </div>
        );
      })()}

      <h1 className="text-2xl font-extrabold mb-4 text-slate-900 mt-4 mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-slate-600">No bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookings.map((b) => (
            <div key={b.id} className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-base sm:text-lg text-slate-900">{b.event.title}</h2>
                <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">{(((b.event.price || 0) * (b.quantity ?? 1))).toFixed(0)} TK</span>
              </div>
              <div className="mt-2 text-sm text-slate-600 space-y-1.5">
                <p><span className="text-slate-500">Date:</span> {new Date(b.event.date).toLocaleString()}</p>
                <p><span className="text-slate-500">Venue:</span> {b.event.venue}</p>
                <p><span className="text-slate-500">Seats:</span> {b.quantity ?? 1}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button
                  onClick={() => cancelBooking(b.id)}
                  disabled={loadingIds.includes(b.id)}
                  className={`w-full sm:w-auto px-3.5 h-9 rounded-lg font-medium border transition ${loadingIds.includes(b.id) ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white text-red-600 border-red-200 hover:bg-red-50 active:scale-[.99]'}`}
                >
                  {loadingIds.includes(b.id) ? 'Cancelling…' : 'Cancel Booking'}
                </button>
                <a
                  href={`/events/${b.event.id}`}
                  className="w-full sm:w-auto px-3.5 h-9 leading-9 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-center transition"
                >
                  Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => router.push('/events')}
        className="mt-6 px-6 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
      >
        Show All Events
      </button>
      </div>
    </div>
  );
}
