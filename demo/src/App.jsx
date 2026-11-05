import React, { useEffect, useMemo, useState } from 'react';

const API_URL = 'http://127.0.0.1:8000/spots';

const BUILDINGS = {
  'Marston Science Library': { left: 28, top: 34, shortName: 'Marston' },
  'Library West': { left: 60, top: 24, shortName: 'Library West' },
  'Honors Village': { left: 77, top: 64, shortName: 'Honors Village' },
  'J. Wayne Reitz Union': { left: 43, top: 70, shortName: 'Reitz Union' },
  'Reitz Union': { left: 43, top: 70, shortName: 'Reitz Union' },
  'Newell Hall': { left: 67, top: 48, shortName: 'Newell Hall' },
  'Norman Hall': { left: 20, top: 68, shortName: 'Norman Hall' },
  'Communicore Building': { left: 82, top: 30, shortName: 'Health Science Center' },
  'Malachowsky Hall': { left: 54, top: 52, shortName: 'Malachowsky Hall' },
};

function getBuildingPosition(spot, index) {
  const building = Object.keys(BUILDINGS).find((name) => spot.building.startsWith(name));
  const position = BUILDINGS[building] || { left: 50, top: 50, shortName: spot.building };
  const offset = (index % 3 - 1) * 2.5;
  return { ...position, left: position.left + offset, top: position.top + offset };
}

function SpotSummary({ spot, compact = false }) {
  return (
    <div className={compact ? 'spot-summary compact' : 'spot-summary'}>
      <strong>{spot.name}</strong>
      <span>{spot.building}</span>
      <div className="summary-tags">
        <span>{spot.quiet_level}</span>
        <span>{spot.has_outlets ? 'Outlets' : 'No outlets'}</span>
        <span>{spot.capacity}</span>
      </div>
      <small>Open {spot.hours}</small>
    </div>
  );
}

function Filters({ filters, setFilters, onClear }) {
  const update = (key, value, checked) => {
    setFilters((current) => ({
      ...current,
      [key]: checked ? [...current[key], value] : current[key].filter((item) => item !== value),
    }));
  };

  return (
    <div className="filters-panel">
      <div>
        <h2>Quiet level</h2>
        <div className="filter-options">
          {['silent', 'quiet', 'moderate', 'loud'].map((level) => (
            <label key={level}><input type="checkbox" checked={filters.quiet.includes(level)} onChange={(event) => update('quiet', level, event.target.checked)} /> {level}</label>
          ))}
        </div>
      </div>
      <div>
        <h2>Outlets</h2>
        <div className="filter-options">
          {['true', 'false'].map((value) => (
            <label key={value}><input type="radio" name="outlets" checked={filters.outlets === value} onChange={() => setFilters({ ...filters, outlets: value })} /> {value === 'true' ? 'Yes' : 'No'}</label>
          ))}
          <label><input type="radio" name="outlets" checked={!filters.outlets} onChange={() => setFilters({ ...filters, outlets: '' })} /> Any</label>
        </div>
      </div>
      <div>
        <h2>Capacity</h2>
        <div className="filter-options">
          {['solo', 'small', 'large'].map((capacity) => (
            <label key={capacity}><input type="checkbox" checked={filters.capacity.includes(capacity)} onChange={(event) => update('capacity', capacity, event.target.checked)} /> {capacity}</label>
          ))}
        </div>
      </div>
      <button className="clear-button" type="button" onClick={onClear}>Clear filters</button>
    </div>
  );
}

function MapView({ spots }) {
  const [activeSpot, setActiveSpot] = useState(null);
  return (
    <div className="map-shell">
      <div className="map-intro">
        <div>
          <p className="eyebrow">Campus map</p>
          <h2>Find a spot near you</h2>
        </div>
        <p className="map-help">Hover or focus a dot to preview a study spot.</p>
      </div>
      <div className="map-canvas" aria-label="Map of study spots across campus">
        <div className="map-road road-one" />
        <div className="map-road road-two" />
        <div className="map-water" />
        {spots.map((spot, index) => {
          const position = getBuildingPosition(spot, index);
          const isActive = activeSpot?.id === spot.id;
          return (
            <div className="map-marker" key={spot.id} style={{ left: `${position.left}%`, top: `${position.top}%` }}>
              {isActive && <SpotSummary spot={spot} compact />}
              <button
                className={`spot-dot ${isActive ? 'active' : ''}`}
                type="button"
                aria-label={`Preview ${spot.name}`}
                onMouseEnter={() => setActiveSpot(spot)}
                onMouseLeave={() => setActiveSpot(null)}
                onFocus={() => setActiveSpot(spot)}
                onBlur={() => setActiveSpot(null)}
              />
              <span className="map-label">{position.shortName}</span>
            </div>
          );
        })}
        <div className="map-compass" aria-hidden="true">N<br /><span>↑</span></div>
      </div>
      <p className="map-count">{spots.length} study spots shown</p>
    </div>
  );
}

function App() {
  const [spots, setSpots] = useState([]);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('list');
  const [filters, setFilters] = useState({ quiet: [], capacity: [], outlets: '' });
  const [sort, setSort] = useState('upvotes_desc');
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState('Loading study spots...');

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`The API returned ${response.status}.`);
        return response.json();
      })
      .then((payload) => {
        const loadedSpots = Array.isArray(payload) ? payload : payload.spots;
        if (!Array.isArray(loadedSpots)) throw new Error('The API response did not contain a spots array.');
        setSpots(loadedSpots);
        setStatus('');
      })
      .catch((error) => setStatus(`Unable to load study spots. ${error.message} Start the API at ${API_URL}.`));
  }, []);

  const filteredSpots = useMemo(() => spots
    .filter((spot) => {
      const searchable = `${spot.name} ${spot.building} ${(spot.tags || []).join(' ')}`.toLowerCase();
      return (!query || searchable.includes(query.toLowerCase()))
        && (!filters.quiet.length || filters.quiet.includes(spot.quiet_level))
        && (!filters.capacity.length || filters.capacity.includes(spot.capacity))
        && (!filters.outlets || String(spot.has_outlets) === filters.outlets);
    })
    .sort((a, b) => sort === 'upvotes_asc' ? a.upvotes - b.upvotes : b.upvotes - a.upvotes), [spots, query, filters, sort]);

  const clearFilters = () => {
    setFilters({ quiet: [], capacity: [], outlets: '' });
    setQuery('');
    setSort('upvotes_desc');
  };

  return (
    <main className="container">
      <header className="page-header">
        <p className="eyebrow">UF campus guide</p>
        <h1>Study somewhere that fits.</h1>
        <p className="subtitle">Explore quiet corners, collaborative tables, and everything in between.</p>
      </header>

      <nav className="tabs" aria-label="Study spot views">
        <button className={tab === 'list' ? 'selected' : ''} type="button" onClick={() => setTab('list')}>☷ <span>List view</span></button>
        <button className={tab === 'map' ? 'selected' : ''} type="button" onClick={() => setTab('map')}>⌖ <span>Map view</span></button>
      </nav>

      <section className="toolbar" aria-label="Study spot filters">
        <div className="search-card">
          <div className="search-row"><span className="search-icon" aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search study spots or buildings..." aria-label="Search study spots" /><button className="expand-button" type="button" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>{showFilters ? '⌃' : '⌄'}</button></div>
          {showFilters && <Filters filters={filters} setFilters={setFilters} onClear={clearFilters} />}
        </div>
        <label className="sort-card">Sort by
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort study spots">
            <option value="upvotes_desc">Upvotes: high to low</option>
            <option value="upvotes_asc">Upvotes: low to high</option>
          </select>
        </label>
      </section>

      {status ? <div className="status error">{status}</div> : tab === 'map' ? <MapView spots={filteredSpots} /> : (
        <section className="results" aria-live="polite">
          <div className="results-header"><h2>Study spots</h2><span>{filteredSpots.length} of {spots.length} spots</span></div>
          {filteredSpots.length ? <div className="spots-container">{filteredSpots.map((spot) => <article className="spot-card" key={spot.id}><div className="spot-header"><div><h3>{spot.name}</h3><p>{spot.building}</p></div><div className="spot-upvotes">▲ {spot.upvotes}</div></div><div className="spot-details"><span>{spot.quiet_level}</span><span>{spot.has_outlets ? 'Outlets' : 'No outlets'}</span><span>{spot.capacity}</span>{(spot.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div><p className="spot-hours">Hours: {spot.hours}</p></article>)}</div> : <div className="status">No study spots match these filters.</div>}
        </section>
      )}
    </main>
  );
}

export default App;
