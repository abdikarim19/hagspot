import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckInPanel } from "./check-in-panel";
import { spaces } from "@/data/hagfors";

type CheckInPageProps = { searchParams: Promise<{ area?: string }> };

export default async function CheckInPage({ searchParams }: CheckInPageProps) {
  const { area: areaId } = await searchParams;
  const area = spaces.find((space) => space.id === areaId && space.kind === "occupancy");
  if (!area) notFound();

  return <main className="check-in-page"><Link className="wordmark" href="/">HagSpot</Link><CheckInPanel area={area} /></main>;
}
