"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { createBooking } from "@/app/actions/bookings";
import { BOOKING_DURATIONS, getTimeSlots, type BookingDuration } from "@/lib/bookings";
import type { BrowseSpace } from "@/data/hagfors";

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function BookingWidget({ space }: { space: BrowseSpace }) {
  const [date, setDate] = useState(tomorrow);
  const [duration, setDuration] = useState<BookingDuration>(60);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const slots = useMemo(() => getTimeSlots(space.id, date, duration), [date, duration, space.id]);
  const minimumDate = new Date().toISOString().slice(0, 10);

  function reserve() {
    const slot = slots.find((candidate) => candidate.startsAt === selectedSlot);
    if (!slot) {
      setMessage("Choose an available time first.");
      return;
    }

    setMessage("");
    startTransition(() => {
      createBooking(space.id, slot.startsAt, slot.endsAt).then((result) => {
        if (result.ok) {
          setMessage("Reserved. Your room is waiting for you.");
          setSelectedSlot("");
        } else {
          setMessage(result.message);
        }
      });
    });
  }

  return (
    <div className="booking-widget">
      <div className="booking-heading"><span>Reserve this room</span><small>Choose a date and duration</small></div>
      <div className="booking-controls">
        <label>Date<input min={minimumDate} onChange={(event) => { setDate(event.target.value); setSelectedSlot(""); }} type="date" value={date} /></label>
        <label>Length<select onChange={(event) => { setDuration(Number(event.target.value) as BookingDuration); setSelectedSlot(""); }} value={duration}>{BOOKING_DURATIONS.map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes</option>)}</select></label>
      </div>
      <div className="slot-grid" aria-label="Available times">
        {slots.map((slot) => <button aria-pressed={slot.startsAt === selectedSlot} className={slot.startsAt === selectedSlot ? "slot is-selected" : "slot"} disabled={!slot.isAvailable} key={slot.startsAt} onClick={() => setSelectedSlot(slot.startsAt)} type="button">{slot.label}</button>)}
      </div>
      <button className="reserve-button" disabled={isPending} onClick={reserve} type="button">{isPending ? "Reserving..." : "Reserve selected time"}</button>
      <p className="booking-note">You must be signed in to reserve. <Link href="/sign-in?next=/">Sign in</Link></p>
      {message ? <p className="booking-message" role="status">{message}</p> : null}
    </div>
  );
}
