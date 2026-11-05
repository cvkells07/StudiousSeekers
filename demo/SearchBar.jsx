import React, { useState } from 'react';

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    quiet_level: '',
    has_outlets: '',
    capacity: '',
    time_range: 'any',
    sort_by: 'upvotes_desc'
  });

  const handleSearchClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Search Query:', searchQuery);
    console.log('Filters:', filters);
    setIsExpanded(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.mapBackground}>
        <div style={styles.mapPlaceholder}>
          <p style={styles.mapText}>Campus Map</p>
        </div>
      </div>

      <div style={styles.searchContainer}>
        <div 
          style={isExpanded ? styles.searchBarExpanded : styles.searchBarCollapsed}
          onClick={handleSearchClick}
        >
          <div style={styles.searchContent}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search study spots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <span style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</span>
          </div>

          {isExpanded && (
            <div style={styles.filtersPanel} onClick={(e) => e.stopPropagation()}>
              <div style={styles.filterSection}>
                <h4 style={styles.filterTitle}>Quiet Level</h4>
                <div style={styles.filterOptions}>
                  {['silent', 'quiet', 'moderate', 'loud'].map(level => (
                    <label key={level} style={styles.filterOption}>
                      <input
                        type="radio"
                        name="quiet_level"
                        value={level}
                        checked={filters.quiet_level === level}
                        onChange={(e) => handleFilterChange('quiet_level', e.target.value)}
                      />
                      <span style={styles.optionLabel}>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={styles.filterSection}>
                <h4 style={styles.filterTitle}>Outlets</h4>
                <div style={styles.filterOptions}>
                  <label style={styles.filterOption}>
                    <input
                      type="radio"
                      name="has_outlets"
                      value="true"
                      checked={filters.has_outlets === 'true'}
                      onChange={(e) => handleFilterChange('has_outlets', e.target.value)}
                    />
                    <span style={styles.optionLabel}>Yes</span>
                  </label>
                  <label style={styles.filterOption}>
                    <input
                      type="radio"
                      name="has_outlets"
                      value="false"
                      checked={filters.has_outlets === 'false'}
                      onChange={(e) => handleFilterChange('has_outlets', e.target.value)}
                    />
                    <span style={styles.optionLabel}>No</span>
                  </label>
                </div>
              </div>

              <div style={styles.filterSection}>
                <h4 style={styles.filterTitle}>Capacity</h4>
                <div style={styles.filterOptions}>
                  {['solo', 'small', 'large'].map(cap => (
                    <label key={cap} style={styles.filterOption}>
                      <input
                        type="radio"
                        name="capacity"
                        value={cap}
                        checked={filters.capacity === cap}
                        onChange={(e) => handleFilterChange('capacity', e.target.value)}
                      />
                      <span style={styles.optionLabel}>{cap.charAt(0).toUpperCase() + cap.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={styles.filterSection}>
                <h4 style={styles.filterTitle}>Time Range</h4>
                <div style={styles.timeRangeFilter}>
                  <select
                    style={styles.timeSelect}
                    value={filters.time_range}
                    onChange={(e) => handleFilterChange('time_range', e.target.value)}
                  >
                    <option value="any">Any time</option>
                    <option value="morning">Morning (6am - 12pm)</option>
                    <option value="afternoon">Afternoon (12pm - 6pm)</option>
                    <option value="evening">Evening (6pm - 12am)</option>
                    <option value="night">Night (12am - 6am)</option>
                  </select>
                </div>
              </div>

              <div style={styles.filterSection}>
                <h4 style={styles.filterTitle}>Sort By</h4>
                <div style={styles.filterOptions}>
                  <label style={styles.filterOption}>
                    <input
                      type="radio"
                      name="sort_by"
                      value="upvotes_desc"
                      checked={filters.sort_by === 'upvotes_desc'}
                      onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    />
                    <span style={styles.optionLabel}>Upvotes (High to Low)</span>
                  </label>
                  <label style={styles.filterOption}>
                    <input
                      type="radio"
                      name="sort_by"
                      value="upvotes_asc"
                      checked={filters.sort_by === 'upvotes_asc'}
                      onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    />
                    <span style={styles.optionLabel}>Upvotes (Low to High)</span>
                  </label>
                </div>
              </div>

              <div style={styles.buttonContainer}>
                <button style={styles.applyButton} onClick={handleSubmit}>
                  Apply Filters
                </button>
                <button 
                  style={styles.clearButton} 
                  onClick={() => {
                    setFilters({
                      quiet_level: '',
                      has_outlets: '',
                      capacity: '',
                      time_range: 'any',
                      sort_by: 'upvotes_desc'
                    });
                    setSearchQuery('');
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
  },
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e0e0e0',
    filter: 'blur(8px)',
    zIndex: 0,
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  mapText: {
    fontSize: '48px',
    color: 'white',
    fontWeight: 'bold',
    opacity: 0.3,
  },
  searchContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
    width: '90%',
    maxWidth: '600px',
  },
  searchBarCollapsed: {
    backgroundColor: 'white',
    borderRadius: '50px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    padding: '16px 24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  searchBarExpanded: {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    padding: '20px 24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  searchContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  searchIcon: {
    fontSize: '20px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    padding: '8px 0',
  },
  expandIcon: {
    fontSize: '14px',
    color: '#666',
  },
  filtersPanel: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  filterSection: {
    marginBottom: '20px',
  },
  filterTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  filterOptions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  filterOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  optionLabel: {
    fontSize: '14px',
    color: '#555',
  },
  timeRangeFilter: {
    display: 'flex',
    alignItems: 'center',
  },
  timeSelect: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  applyButton: {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  clearButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default SearchBar;
