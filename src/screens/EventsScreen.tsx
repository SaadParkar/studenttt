import React, { useState } from 'react';
import { ScreenId, CampusEvent } from '../types';
import { ArrowLeft, MapPin, Clock, Users, Sparkles, CheckCircle2 } from 'lucide-react';

interface EventsScreenProps {
  events: CampusEvent[];
  navigate: (screen: ScreenId) => void;
  onToggleRsvp: (eventId: string) => void;
}

export const EventsScreen: React.FC<EventsScreenProps> = ({
  events,
  navigate,
  onToggleRsvp,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Hackathon', 'Guest Lecture', 'Cultural', 'Workshop'];

  const filtered =
    filterCategory === 'All' ? events : events.filter((e) => e.category === filterCategory);

  return (
    <div className="space-y-6 pb-6 max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Campus Events & Fests
            </h1>
            <p className="text-xs text-slate-500 font-medium">Hackathons, Guest Lectures & Workshops</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-[10px] font-extrabold uppercase">
          3 THIS WEEK
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      <div className="space-y-4">
        {filtered.map((evt) => (
          <div
            key={evt.id}
            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 shadow-md space-y-3"
          >
            <div className="h-44 relative">
              <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-white border border-white/20 uppercase">
                {evt.category}
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-lg font-black leading-tight">{evt.title}</h3>
                <p className="text-xs text-slate-300 font-medium">{evt.organizer}</p>
              </div>
            </div>

            <div className="p-4 pt-1 space-y-3">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{evt.date} • {evt.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{evt.venue}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-pink-500" />
                  <span>{evt.attendeesCount} Attending</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-semibold">Free Student Entry</span>
                <button
                  onClick={() => onToggleRsvp(evt.id)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all ${
                    evt.isRsvped
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {evt.isRsvped ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>RSVP Confirmed</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>RSVP Seat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
