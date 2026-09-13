"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { checkInToArea, endPresence } from "@/app/actions/presence";
import type { BrowseSpace } from "@/data/hagfors";
import { PRESENCE_DURATION_MINUTES } from "@/lib/presence";

export function CheckInPanel({ area }: { area: BrowseSpace }) {
  const [checkInId, setCheckInId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function checkIn() {
    setMessage("");
    startTransition(() => {
      checkInToArea(area.id).then((result) => {
        if (result.ok) {
          setCheckInId(result.checkInId);
          setExpiresAt(result.expiresAt);
          setMessage(`You are counted here for ${PRESENCE_DURATION_MINUTES} minutes. Scan again to renew.`);
        } else setMessage(result.message);
      });
    });
  }

  function leave() {
    startTransition(() => {
      endPresence(checkInId).then((result) => {
        setMessage(result.message);
        if (result.ok) { setCheckInId(""); setExpiresAt(""); }
      });
    });
  }

  return (
    <div className="check-in-panel">
      <div className="check-in-art" aria-hidden="true"><span>QR</span><span>20</span></div>
      <p className="eyebrow">QR presence check-in</p>
      <h2>{area.name}</h2>
      <p>{area.description}</p>
      <p className="check-in-privacy">Only an anonymous count appears on the map. HagSpot does not track GPS or show names.</p>
      {!checkInId ? <button className="detail-action" disabled={isPending} onClick={checkIn} type="button">{isPending ? "Checking in..." : "Check in here"}</button> : <div className="presence-actions"><p className="booking-message">Active until {new Date(expiresAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.</p><button className="detail-action" disabled={isPending} onClick={leave} type="button">End presence</button></div>}
      {message ? <p className="booking-message" role="status">{message}</p> : null}
      <Link className="back-link" href="/">Back to floor map</Link>
    </div>
  );
}
