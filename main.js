import './style.css'

const mockData = {
  stop: "Main Bazaar (Stop 102)",
  directions: ["Station Rd", "College", "Market", "Bus Depot", "Mall Circle"],
  buses: [
    {
      number: "12",
      route: ["Main Bazaar", "Station Rd", "College", "Market"],
      eta: "3 min",
      crowd: "Medium",
      speed: "32 km/h",
      position: "Between Main Bazaar and Station Rd",
      nextStop: "Station Rd",
      status: "On Time"
    },
    {
      number: "45",
      route: ["Main Bazaar", "Station Rd", "Market", "Bus Depot"],
      eta: "9 min",
      crowd: "Low",
      speed: "28 km/h",
      position: "Leaving Main Bazaar",
      nextStop: "Station Rd",
      status: "Slight Delay"
    },
    {
      number: "22",
      route: ["Main Bazaar", "College", "Market"],
      eta: "17 min",
      crowd: "High",
      speed: "25 km/h",
      position: "College",
      nextStop: "Market",
      status: "On Time"
    },
    {
      number: "30",
      route: ["Main Bazaar", "Mall Circle"],
      eta: "22 min",
      crowd: "Medium",
      speed: "30 km/h",
      position: "Between Station Rd and Mall Circle",
      nextStop: "Mall Circle",
      status: "On Time"
    },
    {
      number: "55",
      route: ["Main Bazaar", "Station Rd", "College"],
      eta: "28 min",
      crowd: "Overcrowded",
      speed: "20 km/h",
      position: "Station Rd",
      nextStop: "College",
      status: "Delayed"
    }
  ],
  stations: [
    { name: "Main Bazaar", arrivals: ["Bus 12 in 3m", "Bus 45 in 9m", "Bus 22 in 17m"] },
    { name: "Station Rd", arrivals: ["Bus 55 in 10m", "Bus 12 in 15m"] },
    { name: "College", arrivals: ["Bus 22 in 17m", "Bus 55 in 28m"] },
    { name: "Market", arrivals: ["Bus 12 in 22m"] },
    { name: "Bus Depot", arrivals: ["Bus 45 in 25m"] },
    { name: "Mall Circle", arrivals: ["Bus 30 in 22m"] }
  ]
};

let selectedDirection = null;
let currentView = 'busListView';

function init() {
  populateDirections();
  setupEventListeners();
  showModal('welcomeModal');
}

function populateDirections() {
  const directionSelect = document.getElementById('directionSelect');
  mockData.directions.forEach(direction => {
    const option = document.createElement('option');
    option.value = direction;
    option.textContent = direction;
    directionSelect.appendChild(option);
  });
}

function setupEventListeners() {
  document.getElementById('directionSelect').addEventListener('change', handleDirectionSelect);
  document.getElementById('manualSearch').addEventListener('input', handleManualSearch);
  document.getElementById('continueBtn').addEventListener('click', handleContinue);
  document.getElementById('searchBtn').addEventListener('click', () => showModal('searchModal'));
  const closeSearch = document.getElementById('closeSearchModal');
  if (closeSearch) closeSearch.addEventListener('click', () => hideModal('searchModal'));
  const closeInfo = document.getElementById('closeInfoModal');
  if (closeInfo) closeInfo.addEventListener('click', () => hideModal('infoModal'));
  const closeStation = document.getElementById('closeStationModal');
  if (closeStation) closeStation.addEventListener('click', () => hideModal('stationModal'));
  document.getElementById('stationSearch').addEventListener('input', handleStationSearch);

  // back button exists inside the live tracking view
  const backBtn = document.getElementById('backBtn');
  if (backBtn) backBtn.addEventListener('click', () => {
    showView('busListView');
  });
}

function handleDirectionSelect(e) {
  const direction = e.target.value;
  if (direction) {
    selectedDirection = direction;
    document.getElementById('continueBtn').disabled = false;
    document.getElementById('manualSearch').value = '';
    document.getElementById('searchResults').classList.remove('active');
  }
}

function handleManualSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const searchResults = document.getElementById('searchResults');

  if (searchTerm.length === 0) {
    searchResults.classList.remove('active');
    return;
  }

  const filteredStations = mockData.stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm)
  );

  if (filteredStations.length > 0) {
    searchResults.innerHTML = filteredStations.map(station => `
      <div class="search-result-item" data-station="${station.name}">
        ${station.name}
      </div>
    `).join('');
    searchResults.classList.add('active');

    searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        selectedDirection = item.dataset.station;
        document.getElementById('manualSearch').value = item.dataset.station;
        searchResults.classList.remove('active');
        document.getElementById('directionSelect').value = '';
        document.getElementById('continueBtn').disabled = false;
      });
    });
  } else {
    searchResults.innerHTML = '<div class="search-result-item">No stations found</div>';
    searchResults.classList.add('active');
  }
}

function handleStationSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const searchResults = document.getElementById('stationSearchResults');

  if (searchTerm.length === 0) {
    searchResults.classList.remove('active');
    return;
  }

  const filteredStations = mockData.stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm)
  );

  if (filteredStations.length > 0) {
    searchResults.innerHTML = filteredStations.map(station => `
      <div class="search-result-item" data-station="${station.name}">
        ${station.name}
      </div>
    `).join('');
    searchResults.classList.add('active');

    searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        selectedDirection = item.dataset.station;
        hideModal('searchModal');
        loadBusList();
      });
    });
  } else {
    searchResults.innerHTML = '<div class="search-result-item">No stations found</div>';
    searchResults.classList.add('active');
  }
}

function handleContinue() {
  if (selectedDirection) {
    hideModal('welcomeModal');
    loadBusList();
  }
}

function loadBusList() {
  const filteredBuses = mockData.buses.filter(bus =>
    bus.route.includes(selectedDirection)
  );

  const routeTitle = document.getElementById('routeTitle');
  routeTitle.textContent = `Buses from ${mockData.stop} → ${selectedDirection}`;

  const busList = document.getElementById('busList');

  if (filteredBuses.length === 0) {
    busList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🚌</div>
        <div class="empty-state-text">No buses available right now for this direction.</div>
      </div>
    `;
  } else {
    // Use the global index from mockData.buses for stable IDs
    busList.innerHTML = filteredBuses.map(bus => {
      const globalIndex = mockData.buses.indexOf(bus);
      return createBusCard(bus, globalIndex);
    }).join('');

    // Attach listeners using the same global indexes
    filteredBuses.forEach(bus => {
      const globalIndex = mockData.buses.indexOf(bus);
      const viewInfoBtn = document.getElementById(`viewInfo-${globalIndex}`);
      const trackLiveBtn = document.getElementById(`trackLive-${globalIndex}`);

      if (viewInfoBtn) {
        viewInfoBtn.addEventListener('click', () => showBusInfo(bus));
      }
      if (trackLiveBtn) {
        trackLiveBtn.addEventListener('click', () => showLiveTracking(bus));
      }
    });
  }

  showView('busListView');
}

function createBusCard(bus, index) {
  const crowdClass = bus.crowd.toLowerCase().replace(/\s+/g, '-');

  return `
    <div class="bus-card">
      <div class="bus-header">
        <div class="bus-number">Bus ${bus.number}</div>
        <div class="eta">${bus.eta}</div>
      </div>
      <div class="bus-route">${bus.route.join(' → ')}</div>
      <div class="bus-info">
        <span class="badge ${crowdClass}">${bus.crowd}</span>
      </div>
      <div class="bus-actions">
        <button id="viewInfo-${index}" class="outline-btn">View Info</button>
        <button id="trackLive-${index}" class="secondary-btn">Track Live</button>
      </div>
    </div>
  `;
}

function showBusInfo(bus) {
  const modal = document.getElementById('infoModal');
  const title = document.getElementById('infoModalTitle');
  const content = document.getElementById('infoModalContent');

  title.textContent = `Bus ${bus.number} Information`;

  const crowdClass = bus.crowd.toLowerCase().replace(/\s+/g, '-');

  content.innerHTML = `
    <div class="info-detail">
      <span class="label">Route:</span>
      <span class="value">${bus.route.join(' → ')}</span>
    </div>
    <div class="info-detail">
      <span class="label">ETA:</span>
      <span class="value">${bus.eta}</span>
    </div>
    <div class="info-detail">
      <span class="label">Current Speed:</span>
      <span class="value">${bus.speed}</span>
    </div>
    <div class="info-detail">
      <span class="label">Current Position:</span>
      <span class="value">${bus.position}</span>
    </div>
    <div class="info-detail">
      <span class="label">Next Stop:</span>
      <span class="value">${bus.nextStop}</span>
    </div>
    <div class="info-detail">
      <span class="label">Crowd Level:</span>
      <span class="value"><span class="badge ${crowdClass}">${bus.crowd}</span></span>
    </div>
    <div class="info-detail">
      <span class="label">Status:</span>
      <span class="value">${bus.status}</span>
    </div>
  `;

  showModal('infoModal');
}

function showLiveTracking(bus) {
  const title = document.getElementById('trackingTitle');
  title.textContent = `Live Tracking – Bus ${bus.number}`;

  const etaDisplay = document.getElementById('etaDisplay');
  const speedDisplay = document.getElementById('speedDisplay');
  const nextStopDisplay = document.getElementById('nextStopDisplay');
  const crowdDisplay = document.getElementById('crowdDisplay');
  const statusDisplay = document.getElementById('statusDisplay');

  etaDisplay.textContent = bus.eta;
  speedDisplay.textContent = bus.speed;
  nextStopDisplay.textContent = bus.nextStop;

  const crowdClass = bus.crowd.toLowerCase().replace(/\s+/g, '-');
  crowdDisplay.className = `badge ${crowdClass}`;
  crowdDisplay.textContent = bus.crowd;

  statusDisplay.textContent = bus.status;

  renderRouteMap(bus);
  showView('liveTrackingView');
}

function renderRouteMap(bus) {
  const routeMap = document.getElementById('routeMap');
  const currentStation = mockData.stop.split(' (')[0];

  // Compute bus position index (may be fractional if "between X and Y")
  const busPositionIndex = getBusPositionIndex(bus);

  const stationsHTML = bus.route.map((station, index) => {
    const isCurrent = station === currentStation;
    // if busPositionIndex is fractional, mark near station if within 0.5
    const isBusPosition = Math.abs(index - busPositionIndex) < 0.5;

    return `
      <div class="station-marker">
        ${isBusPosition ? '<div class="bus-icon">🚌</div>' : ''}
        <div class="station-dot ${isCurrent ? 'current' : ''}" data-station="${station}"></div>
        <div class="station-label ${isCurrent ? 'current' : ''}">${station}${isCurrent ? ' (You are here)' : ''}</div>
      </div>
    `;
  }).join('');

  const lineHeight = bus.route.length * 80;

  routeMap.innerHTML = `
    <div class="route-line" style="height: ${lineHeight}px;">
      ${stationsHTML}
    </div>
  `;

  // Use event.currentTarget to avoid clicks on inner icon missing dataset
  routeMap.querySelectorAll('.station-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      const stationName = e.currentTarget.dataset.station;
      showStationInfo(stationName);
    });
  });
}

function getBusPositionIndex(bus) {
  const position = (bus.position || '').toLowerCase();

  // If "between X and Y", try to extract X and find its index
  if (position.includes('between')) {
    // attempt to parse "between X and Y"
    const betweenMatch = position.match(/between\s+(.+?)\s+(?:and|&)\s+(.+)/i);
    if (betweenMatch) {
      const a = betweenMatch[1].trim();
      const b = betweenMatch[2].trim();
      const idxA = bus.route.findIndex(r => r.toLowerCase().includes(a));
      const idxB = bus.route.findIndex(r => r.toLowerCase().includes(b));
      if (idxA !== -1 && idxB !== -1) {
        return (idxA + idxB) / 2; // fractional position between two stops
      }
      if (idxA !== -1) return idxA + 0.5;
      if (idxB !== -1) return Math.max(0, idxB - 0.5);
    }
    // fallback: mark near first matched station
    for (let i = 0; i < bus.route.length; i++) {
      if (position.includes(bus.route[i].toLowerCase())) {
        return i + 0.5;
      }
    }
    return 0.5;
  }

  // If "leaving X" -> mark near X (slightly after)
  if (position.includes('leaving')) {
    for (let i = 0; i < bus.route.length; i++) {
      if (position.includes(bus.route[i].toLowerCase())) {
        return i + 0.2;
      }
    }
  }

  // exact match to station
  for (let i = 0; i < bus.route.length; i++) {
    if (position.includes(bus.route[i].toLowerCase())) {
      return i;
    }
  }

  // default to first stop
  return 0;
}

function showStationInfo(stationName) {
  const station = mockData.stations.find(s => s.name === stationName);

  if (!station) return;

  const modal = document.getElementById('stationModal');
  const title = document.getElementById('stationModalTitle');
  const content = document.getElementById('stationModalContent');

  title.textContent = stationName;

  content.innerHTML = `
    <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Incoming Buses</h3>
    ${station.arrivals.map(arrival => `
      <div class="info-detail">
        <span class="value">${arrival}</span>
      </div>
    `).join('')}
  `;

  showModal('stationModal');
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('hidden');
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('hidden');
}

function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.add('hidden');
  });
  const viewEl = document.getElementById(viewId);
  if (viewEl) viewEl.classList.remove('hidden');
  currentView = viewId;
}

init();
