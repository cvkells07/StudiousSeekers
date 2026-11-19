import React, { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const API_URL = 'http://127.0.0.1:8000/spots';
const EMPTY_SPOT = {
  name: '',
  description: '',
  building: '',
  quiet_level: 'quiet',
  has_outlets: false,
  capacity: 'solo',
  hours: '',
  tags: '',
};
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN?.trim();
const HAS_VALID_MAPBOX_TOKEN = MAPBOX_TOKEN?.startsWith('pk.');

const BUILDING_COORDINATES = {
  'Marston Science Library': [-82.3457, 29.6467],
  'Library West': [-82.3439, 29.6486],
  'Honors Village': [-82.347, 29.641],
  'J. Wayne Reitz Union': [-82.3471, 29.6467],
  'Reitz Union': [-82.3471, 29.6467],
  'Newell Hall': [-82.3437, 29.6491],
  'Norman Hall': [-82.349, 29.648],
  'Communicore Building': [-82.345, 29.638],
  'Malachowsky Hall': [-82.344, 29.644],
};

function getSpotCoordinates(spot) {
  const longitude = Number(spot.longitude);
  const latitude = Number(spot.latitude);

  if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
    return [longitude, latitude];
  }

  const building = Object.keys(BUILDING_COORDINATES)
    .find((name) => spot.building.startsWith(name));

  return BUILDING_COORDINATES[building] || [-82.34772, 29.64604];
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

function MapView({ spots, darkMode }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (!HAS_VALID_MAPBOX_TOKEN) return undefined;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [-82.34669, 29.64505],
      zoom: 15.51,
      bearing: 0,
      pitch: 0,
      config: {
        basemap: {
          lightPreset: darkMode ? 'dusk' : 'day',
          show3dFacades: true,
          showLandmarkIcons: true,
          showIndoor: true,
          showHdRoads: true,
          showPlaceLabels: true,
          showPointOfInterestLabels: true,
          showRoadLabels: true,
          showTransitLabels: true,
        },
      },
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !HAS_VALID_MAPBOX_TOKEN) return;
    map.current.setConfigProperty('basemap', 'lightPreset', darkMode ? 'dusk' : 'day');
  }, [darkMode]);

  useEffect(() => {
    if (!map.current || !HAS_VALID_MAPBOX_TOKEN) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = spots.map((spot) => {
      const popupContent = document.createElement('div');
      popupContent.className = 'map-popup';
      popupContent.innerHTML = `
        <strong></strong>
        <span></span>
        <small></small>
        <small></small>
      `;
      popupContent.querySelector('strong').textContent = spot.name;
      popupContent.querySelector('span').textContent = spot.building;
      popupContent.querySelector('small').textContent = `${spot.quiet_level} · ${spot.capacity}`;
      popupContent.querySelectorAll('small')[1].textContent = spot.has_outlets
        ? 'Outlets available'
        : 'No outlets';

      return new mapboxgl.Marker({ color: '#d47b45' })
        .setLngLat(getSpotCoordinates(spot))
        .setPopup(new mapboxgl.Popup({ offset: 18 }).setDOMContent(popupContent))
        .addTo(map.current);
    });
  }, [spots]);

  return (
    <div className="map-shell">
      <div className="map-intro">
        <div>
          <p className="eyebrow">Campus map</p>
          <h2>Find a spot near you</h2>
        </div>
        <p className="map-help">Select a marker to preview a study spot.</p>
      </div>
      {!HAS_VALID_MAPBOX_TOKEN ? (
        <div className="map-token-message">
          Add <code>VITE_MAPBOX_TOKEN</code> to <code>demo/.env</code> to load the map.
        </div>
      ) : (
        <div ref={mapContainer} className="map-canvas mapbox-canvas" aria-label="Map of study spots across campus" />
      )}
      <p className="map-count">{spots.length} study spots shown</p>
    </div>
  );
}

function App() {
  const [spots, setSpots] = useState([]);
  const [mapQuery, setMapQuery] = useState('');
  const [listQuery, setListQuery] = useState('');
  const [tab, setTab] = useState('map');
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({ quiet: [], capacity: [], outlets: '' });
  const [sort, setSort] = useState('upvotes_desc');
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState('Loading study spots...');
  const [showAddSpot, setShowAddSpot] = useState(false);
  const [newSpot, setNewSpot] = useState(EMPTY_SPOT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const query = tab === 'map' ? mapQuery : listQuery;
  const setQuery = tab === 'map' ? setMapQuery : setListQuery;

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
    setMapQuery('');
    setListQuery('');
    setSort('upvotes_desc');
  };

  const addSpot = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSpot,
          tags: newSpot.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'The study spot could not be added.');

      setSpots((currentSpots) => [payload, ...currentSpots]);
      setNewSpot(EMPTY_SPOT);
      setShowAddSpot(false);
      setSubmissionMessage('Study spot added.');
    } catch (error) {
      setSubmissionMessage(`Unable to add study spot. ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`container ${tab === 'map' ? 'map-mode' : ''} ${darkMode ? 'theme-dark' : ''}`}>
      <header className="page-header">
        <p className="eyebrow">UF campus guide</p>
        <h1>StudiousSeeker</h1>
        <p className="subtitle">Explore quiet corners, collaborative tables, and everything in between.</p>
        <button
          className="add-spot-toggle"
          type="button"
          onClick={() => { setShowAddSpot(!showAddSpot); setSubmissionMessage(''); }}
          aria-label={showAddSpot ? 'Close add study spot form' : 'Add a study spot'}
          aria-expanded={showAddSpot}
          aria-controls="add-spot-form"
          title={showAddSpot ? 'Close form' : 'Add a study spot'}
        >
          <span aria-hidden="true">{showAddSpot ? '×' : '+'}</span>
        </button>
      </header>

      {showAddSpot && (
        <form className="add-spot-form" id="add-spot-form" onSubmit={addSpot}>
          <div className="add-spot-heading">
            <div>
              <p className="eyebrow">Share with students</p>
              <h2>Add a study spot</h2>
            </div>
            <p className="form-note">The server assigns the spot ID and starts upvotes at 0.</p>
          </div>
          <div className="form-grid">
            <label>
              Spot name
              <input required maxLength="120" value={newSpot.name} onChange={(event) => setNewSpot({ ...newSpot, name: event.target.value })} />
            </label>
            <label>
              Building
              <input required maxLength="120" value={newSpot.building} onChange={(event) => setNewSpot({ ...newSpot, building: event.target.value })} />
            </label>
            <label className="form-wide">
              Description
              <textarea required maxLength="500" rows="3" value={newSpot.description} onChange={(event) => setNewSpot({ ...newSpot, description: event.target.value })} />
            </label>
            <label>
              Quiet level
              <select value={newSpot.quiet_level} onChange={(event) => setNewSpot({ ...newSpot, quiet_level: event.target.value })}>
                {['silent', 'quiet', 'moderate', 'loud'].map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
            </label>
            <label>
              Capacity
              <select value={newSpot.capacity} onChange={(event) => setNewSpot({ ...newSpot, capacity: event.target.value })}>
                {['solo', 'small', 'large'].map((capacity) => <option key={capacity} value={capacity}>{capacity}</option>)}
              </select>
            </label>
            <label>
              Hours
              <input required maxLength="120" placeholder="e.g. 8am-10pm or 24/7" value={newSpot.hours} onChange={(event) => setNewSpot({ ...newSpot, hours: event.target.value })} />
            </label>
            <label>
              Tags <span className="field-hint">(comma-separated, optional)</span>
              <input placeholder="e.g. quiet, group-friendly" value={newSpot.tags} onChange={(event) => setNewSpot({ ...newSpot, tags: event.target.value })} />
            </label>
            <label className="outlets-control">
              <input type="checkbox" checked={newSpot.has_outlets} onChange={(event) => setNewSpot({ ...newSpot, has_outlets: event.target.checked })} />
              Has outlets
            </label>
          </div>
          <div className="form-footer">
            <p className="form-note">Quiet level: silent, quiet, moderate, or loud. Capacity: solo, small, or large.</p>
            <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add spot'}</button>
          </div>
        </form>
      )}
      {submissionMessage && <p className={`submission-message ${submissionMessage.startsWith('Unable') ? 'error' : ''}`} role="status">{submissionMessage}</p>}

      <nav className="tabs" aria-label="Study spot views">
        <button className={tab === 'map' ? 'selected' : ''} type="button" onClick={() => setTab('map')}>🌐 <span>Map view</span></button>
        <button className={tab === 'list' ? 'selected' : ''} type="button" onClick={() => setTab('list')}>☷ <span>List view</span></button>
        <button
          className="theme-toggle"
          type="button"
          onClick={() => setDarkMode((current) => !current)}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={darkMode}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span aria-hidden="true">{darkMode ? '☀' : '☾'}</span>
          <span className="theme-label">{darkMode ? 'Light' : 'Dark'}</span>
        </button>
      </nav>

      <section className="toolbar" aria-label="Study spot filters">
        <div className="search-card">
          <div className="search-row">
            <span className="search-icon" aria-hidden="true">{tab === 'map' ? '⌖' : '⌕'}</span>
            <input
              key={tab}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder={tab === 'map' ? 'Search the map...' : 'Search study spots or buildings...'}
              aria-label={tab === 'map' ? 'Search the map' : 'Search study spots'}
            />
            <button className="expand-button" type="button" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>{showFilters ? '⌃' : '⌄'}</button>
          </div>
          {showFilters && <Filters filters={filters} setFilters={setFilters} onClear={clearFilters} />}
        </div>
        <label className="sort-card">Sort by
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort study spots">
            <option value="upvotes_desc">Upvotes: high to low</option>
            <option value="upvotes_asc">Upvotes: low to high</option>
          </select>
        </label>
      </section>

      {status ? <div className="status error">{status}</div> : tab === 'map' ? <MapView spots={filteredSpots} darkMode={darkMode} /> : (
        <section className="results" aria-live="polite">
          <div className="results-header"><h2>Study spots</h2><span>{filteredSpots.length} of {spots.length} spots</span></div>
{filteredSpots.length ? <div className="spots-container">{filteredSpots.map((spot) => <article className="spot-card" key={spot.id}>{spot.image && <img className="spot-image" src={spot.image} alt={spot.name} loading="lazy" />}<div className="spot-header"><div><h3>{spot.name}</h3><p>{spot.building}</p></div><div className="spot-upvotes">▲ {spot.upvotes}</div></div><p className="spot-description">{spot.description}</p><div className="spot-details"><span>{spot.quiet_level}</span><span>{spot.has_outlets ? 'Outlets' : 'No outlets'}</span><span>{spot.capacity}</span>{(spot.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div><p className="spot-hours">Hours: {spot.hours}</p></article>)}</div> : <div className="status">No study spots match these filters.</div>}
        </section>
      )}
    </main>
  );
}

export default App;
