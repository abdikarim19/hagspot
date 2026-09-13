import { FloorBrowser } from "@/components/floor-browser";
import Link from "next/link";

export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <Link className="wordmark" href="/">HagSpot</Link>
        <nav><Link href="/sign-in">Sign in</Link><a className="header-link" href="#spaces">Explore spaces</a></nav>
      </header>
      <section className="intro" id="spaces">
        <div><p className="eyebrow">Hagfors Center · Augsburg University</p><h1>A better place to begin your workday.</h1></div>
        <p className="intro-copy">Find a room to reserve or an open area to settle into. See the building before you make the trip.</p>
      </section>
      <FloorBrowser />
      <footer className="site-footer"><span>HagSpot / space, made visible</span><span>Availability changes throughout the day</span></footer>
    </main>
  );
}
