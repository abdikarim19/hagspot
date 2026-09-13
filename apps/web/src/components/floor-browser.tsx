"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { floors, spaces, type BrowseSpace } from "@/data/hagfors";
import { BookingWidget } from "@/components/booking-widget";

type SpaceFilter = "all" | "bookable" | "occupancy";

const occupancyLabels = {
  quiet: "Quiet",
  active: "Active",
  busy: "Busy",
  full: "Full",
};

export function FloorBrowser() {
  const [selectedFloorId, setSelectedFloorId] = useState(floors[0].id);
  const [selectedSpaceId, setSelectedSpaceId] = useState(spaces[0].id);
  const [filter, setFilter] = useState<SpaceFilter>("all");
  const [query, setQuery] = useState("");

  const selectedFloor = floors.find((floor) => floor.id === selectedFloorId) ?? floors[0];
  const visibleSpaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return spaces.filter((space) => {
      const matchesFloor = space.floorId === selectedFloor.id;
      const matchesFilter = filter === "all" || space.kind === filter;
      const matchesQuery =
        !normalizedQuery ||
        `${space.name} ${space.description} ${space.equipment.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFloor && matchesFilter && matchesQuery;
    });
  }, [filter, query, selectedFloor.id]);

  const selectedSpace = spaces.find((space) => space.id === selectedSpaceId);

  function chooseFloor(floorId: string) {
    setSelectedFloorId(floorId);
    const firstSpaceOnFloor = spaces.find((space) => space.floorId === floorId);
    if (firstSpaceOnFloor) setSelectedSpaceId(firstSpaceOnFloor.id);
  }

  return (
    <section className="browser-shell" aria-label="Hagfors Center space browser">
      <div className="floor-tabs" role="tablist" aria-label="Choose a floor">
        {floors.map((floor) => (
          <button
            aria-selected={floor.id === selectedFloor.id}
            className={floor.id === selectedFloor.id ? "floor-tab is-active" : "floor-tab"}
            key={floor.id}
            onClick={() => chooseFloor(floor.id)}
            role="tab"
            type="button"
          >
            <span>0{floor.level + 1}</span>
            {floor.name}
          </button>
        ))}
      </div>

      <div className="browser-toolbar">
        <label className="search-field">
          <span>Search this floor</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Room, equipment, or area"
            type="search"
            value={query}
          />
        </label>
        <div className="filter-group" aria-label="Filter spaces">
          {(["all", "bookable", "occupancy"] as const).map((option) => (
            <button
              className={filter === option ? "filter-button is-active" : "filter-button"}
              key={option}
              onClick={() => setFilter(option)}
              type="button"
            >
              {option === "all" ? "Everything" : option === "bookable" ? "Bookable" : "Open areas"}
            </button>
          ))}
        </div>
      </div>

      <div className="browser-grid">
        <div className="map-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Live floor guide</p>
              <h2>{selectedFloor.name}</h2>
            </div>
            <p>{selectedFloor.summary}</p>
          </div>
          <div className="map-frame">
            <Image
              alt={`${selectedFloor.name} map of Hagfors Center`}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 65vw"
              src={selectedFloor.mapImagePath}
            />
            {visibleSpaces.map((space) => (
              <button
                aria-label={`Select ${space.name}, ${space.activeCheckIns ?? 0} people currently here`}
                className={`map-marker marker-${space.occupancy} ${space.kind === "occupancy" ? "heat-marker" : ""} ${space.id === selectedSpaceId ? "is-selected" : ""}`}
                key={space.id}
                onClick={() => setSelectedSpaceId(space.id)}
                style={{
                  left: `${space.mapRegion.x}%`,
                  top: `${space.mapRegion.y}%`,
                  width: `${space.mapRegion.width}%`,
                  height: `${space.mapRegion.height}%`,
                }}
                type="button"
              >
                <span>{space.name}</span>
              </button>
            ))}
          </div>
          <div className="map-legend" aria-label="Occupancy legend">
            {Object.entries(occupancyLabels).map(([level, label]) => (
              <span key={level}><i className={`legend-dot marker-${level}`} />{label}</span>
            ))}
          </div>
        </div>

        <aside className="space-panel">
          <div className="panel-heading compact">
            <div>
              <p className="eyebrow">Spaces on this floor</p>
              <h2>{visibleSpaces.length} found</h2>
            </div>
          </div>
          <div className="space-list">
            {visibleSpaces.length ? visibleSpaces.map((space) => (
              <SpaceRow
                isSelected={space.id === selectedSpaceId}
                key={space.id}
                onSelect={() => setSelectedSpaceId(space.id)}
                space={space}
              />
            )) : <p className="empty-state">Nothing matches that search on this floor.</p>}
          </div>
          {selectedSpace ? <SpaceDetail space={selectedSpace} /> : null}
        </aside>
      </div>
    </section>
  );
}

function SpaceRow({ isSelected, onSelect, space }: { isSelected: boolean; onSelect: () => void; space: BrowseSpace }) {
  return (
    <button className={isSelected ? "space-row is-selected" : "space-row"} onClick={onSelect} type="button">
      <span className={`space-status marker-${space.occupancy}`} />
      <span className="space-row-copy"><strong>{space.name}</strong><small>{space.kind === "bookable" ? `${space.capacity} seats` : `${space.activeCheckIns ?? 0} here now`}</small></span>
      <span className="space-level">{occupancyLabels[space.occupancy]}</span>
    </button>
  );
}

function SpaceDetail({ space }: { space: BrowseSpace }) {
  return (
    <div className="space-detail">
      {space.imagePath ? <Image alt="" height={120} src={space.imagePath} width={180} /> : null}
      <p className="eyebrow">{space.kind === "bookable" ? "Bookable room" : "Informal occupancy area"}</p>
      <h3>{space.name}</h3>
      <p>{space.description}</p>
      {space.kind === "occupancy" ? <p className="presence-count"><strong>{space.activeCheckIns ?? 0}</strong> anonymous check-ins currently count toward this area.</p> : null}
      <div className="equipment-list">{space.equipment.map((item) => <span key={item}>{item}</span>)}</div>
      {space.kind === "bookable" ? <BookingWidget space={space} /> : <Link className="detail-action" href={`/check-in?area=${space.id}`}>Check in at this area</Link>}
    </div>
  );
}
