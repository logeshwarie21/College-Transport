// DATA: Buses & Routes - Tiruvannamalai district towns -> College (Tiruvannamalai Outer Bypass)
// NOTE: timings, driver names and phone numbers are sample values.
const BUS_DATA = [
    {
        id: 'BUS-01', number: 'Bus #01', routeName: 'Tiruvannamalai Town Shuttle', zone: 'Central',
        driver: 'Murugan K.', contact: '+91 90000 00001',
        start: 'Tiruvannamalai Central Bus Stand', destination: 'College Main Gate, Outer Bypass', status: 'On Time',
        stops: [
            { name: 'Central Bus Stand', time: '07:30 AM', mark: 'Main bus stand entrance' },
            { name: 'Arunachaleswarar Temple East Gate', time: '07:40 AM', mark: 'Near temple east tower' },
            { name: 'Tiruvannamalai Railway Station', time: '07:50 AM', mark: 'Station road bus shelter' },
            { name: 'College Main Gate (Outer Bypass)', time: '08:10 AM', mark: 'Campus' }
        ]
    },
    {
        id: 'BUS-05', number: 'Bus #05', routeName: 'Polur Express', zone: 'North',
        driver: 'Selvam R.', contact: '+91 90000 00005',
        start: 'Polur Bus Stand', destination: 'College Main Gate, Outer Bypass', status: 'On Time',
        stops: [
            { name: 'Polur Bus Stand', time: '06:45 AM', mark: 'Bus stand platform 1' },
            { name: 'Kelur', time: '07:00 AM', mark: 'Highway bus shelter' },
            { name: 'Vengikkal', time: '07:25 AM', mark: 'Main road junction' },
            { name: 'Outer Bypass Junction', time: '07:50 AM', mark: 'Bypass road signal' },
            { name: 'College Main Gate (Outer Bypass)', time: '08:05 AM', mark: 'Campus' }
        ]
    },
    {
        id: 'BUS-12', number: 'Bus #12', routeName: 'Chengam Route', zone: 'West',
        driver: 'Ramesh P.', contact: '+91 90000 00012',
        start: 'Chengam Bus Stand', destination: 'College Main Gate, Outer Bypass', status: 'Delayed',
        stops: [
            { name: 'Chengam Bus Stand', time: '06:40 AM', mark: 'Bus stand main entrance' },
            { name: 'Thandarampattu', time: '07:05 AM', mark: 'Near market junction' },
            { name: 'Somasipadi', time: '07:35 AM', mark: 'Highway bus shelter' },
            { name: 'Tiruvannamalai Bypass West', time: '07:50 AM', mark: 'Bypass west bus stop' },
            { name: 'College Main Gate (Outer Bypass)', time: '08:10 AM', mark: 'Campus' }
        ]
    },
    {
        id: 'BUS-08', number: 'Bus #08', routeName: 'Vettavalam Route', zone: 'South',
        driver: 'Karthikeyan S.', contact: '+91 90000 00008',
        start: 'Vettavalam Bus Stand', destination: 'College Main Gate, Outer Bypass', status: 'On Time',
        stops: [
            { name: 'Vettavalam Bus Stand', time: '06:55 AM', mark: 'Bus stand main entrance' },
            { name: 'Thurinjapuram', time: '07:20 AM', mark: 'Near main road bus stop' },
            { name: 'Adi Annamalai', time: '07:45 AM', mark: 'Near temple road junction' },
            { name: 'College Main Gate (Outer Bypass)', time: '08:05 AM', mark: 'Campus' }
        ]
    },
    {
        id: 'BUS-15', number: 'Bus #15', routeName: 'Arani Route', zone: 'East',
        driver: 'Anbu Raj', contact: '+91 90000 00015',
        start: 'Arani Fort Bus Terminus', destination: 'College Main Gate, Outer Bypass', status: 'In Maintenance',
        stops: [
            { name: 'Arani Fort Bus Terminus', time: '06:30 AM', mark: 'Platform 1' },
            { name: 'Arani Market', time: '06:42 AM', mark: 'Near market entrance' },
            { name: 'Tiruvannamalai Bypass East', time: '07:45 AM', mark: 'Bypass east bus stop' },
            { name: 'College Main Gate (Outer Bypass)', time: '08:05 AM', mark: 'Campus' }
        ]
    },
    {
        id: 'BUS-18', number: 'Bus #18', routeName: 'Vandavasi - Chetpet Link', zone: 'East',
        driver: 'Suresh Kumar', contact: '+91 90000 00018',
        start: 'Vandavasi Bus Stand', destination: 'College Main Gate, Outer Bypass', status: 'On Time',
        stops: [
            { name: 'Vandavasi Bus Stand', time: '06:20 AM', mark: 'Bus stand main entrance' },
            { name: 'Desur', time: '06:40 AM', mark: 'Main road bus stop' },
            { name: 'Chetpet', time: '07:00 AM', mark: 'Chetpet bus stand' },
            { name: 'Kilpennathur', time: '07:30 AM', mark: 'Near main junction' },
            { name: 'College Main Gate (Outer Bypass)', time: '08:00 AM', mark: 'Campus' }
        ]
    }
];

// Pickup points are derived from the bus stops (every stop except the campus terminal)
function fmtTime(mins) {
    const h = Math.floor(mins / 60), m = mins % 60;
    return `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

const PICKUP_POINTS = BUS_DATA.flatMap(bus => {
    const pickups = bus.stops.slice(0, -1);
    return pickups.map((s, i) => ({
        location: s.name, zone: bus.zone, bus: bus.number, morning: s.time,
        evening: fmtTime(16 * 60 + 30 + 12 * (pickups.length - i)), landmark: s.mark
    }));
});

// State Variables
let currentTab = 'dashboard';
let calcTerm = 'semester';
let animationFrameId = null;
let simProgress = 0; // 0 to 1

// Initialize Page
window.addEventListener('DOMContentLoaded', () => {
    renderRoutes();
    renderPickups();
    populateSimulatorOptions();
    calculateFee();
    initTrackerSimulation();
});

// Theme Toggle
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
}

// Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

// Tab Switching
function switchTab(tabId) {
    currentTab = tabId;
    const sections = ['dashboard', 'routes', 'pickups', 'tracker', 'calculator', 'contacts'];
    sections.forEach(sec => {
        const el = document.getElementById(`section-${sec}`);
        if (el) el.classList.add('hidden');

        const navBtn = document.getElementById(`nav-${sec}`);
        if (navBtn) {
            navBtn.className = 'nav-btn px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors';
        }
    });

    const activeSection = document.getElementById(`section-${tabId}`);
    if (activeSection) activeSection.classList.remove('hidden');

    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
        activeBtn.className = 'nav-btn px-3 py-2 rounded-lg transition-colors text-brand-600 dark:text-sky-400 bg-brand-50 dark:bg-slate-800 font-bold';
    }

    if (tabId === 'tracker') {
        setTimeout(initTrackerSimulation, 100);
    }
}

// Render Bus Routes Grid
function renderRoutes() {
    const grid = document.getElementById('routesGrid');
    const search = document.getElementById('routesSearch').value.toLowerCase();
    const zoneFilter = document.getElementById('routesZoneFilter').value;
    const statusFilter = document.getElementById('routesStatusFilter').value;

    const filtered = BUS_DATA.filter(bus => {
        const matchesSearch = bus.number.toLowerCase().includes(search) || 
                              bus.routeName.toLowerCase().includes(search) ||
                              bus.driver.toLowerCase().includes(search) ||
                              bus.start.toLowerCase().includes(search) ||
                              bus.stops.some(s => s.name.toLowerCase().includes(search));
        const matchesZone = zoneFilter === 'ALL' || bus.zone === zoneFilter;
        const matchesStatus = statusFilter === 'ALL' || bus.status === statusFilter;
        return matchesSearch && matchesZone && matchesStatus;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400">No matching bus routes found.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(bus => {
        const statusBadge = bus.status === 'On Time' 
            ? '<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-circle-check mr-1"></i>On Time</span>'
            : bus.status === 'Delayed'
            ? '<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"><i class="fa-solid fa-clock mr-1"></i>Delayed</span>'
            : '<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"><i class="fa-solid fa-wrench mr-1"></i>Maintenance</span>';

        return `
            <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-bold px-2.5 py-1 bg-brand-50 dark:bg-slate-700 text-brand-600 dark:text-sky-300 rounded-lg">${bus.number}</span>
                        ${statusBadge}
                    </div>
                    <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-1">${bus.routeName}</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-4"><i class="fa-solid fa-map-pin text-brand-500 mr-1"></i>${bus.start} &rarr; ${bus.destination}</p>

                    <div class="space-y-2 text-xs border-t border-slate-100 dark:border-slate-700/60 pt-3">
                        <div class="flex justify-between"><span class="text-slate-400">Driver:</span> <span class="font-semibold text-slate-700 dark:text-slate-300">${bus.driver}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Phone:</span> <span class="font-semibold text-slate-700 dark:text-slate-300">${bus.contact}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Total Stops:</span> <span class="font-semibold text-slate-700 dark:text-slate-300">${bus.stops.length - 1} Pickup Points</span></div>
                    </div>
                </div>

                <div class="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex space-x-2">
                    <button onclick="openRouteModal('${bus.id}')" class="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all">View Timeline</button>
                    <button onclick="switchTab('tracker'); selectBusInSim('${bus.id}')" class="px-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all" title="Track Live"><i class="fa-solid fa-satellite-dish"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

// Render Pickups Table
function renderPickups() {
    const body = document.getElementById('pickupsTableBody');
    const search = document.getElementById('pickupSearch').value.toLowerCase();
    const shiftFilter = document.getElementById('pickupShiftFilter').value;

    const filtered = PICKUP_POINTS.filter(p => {
        const matchesSearch = p.location.toLowerCase().includes(search) || 
                              p.landmark.toLowerCase().includes(search) ||
                              p.zone.toLowerCase().includes(search) ||
                              p.bus.toLowerCase().includes(search);
        return matchesSearch;
    });

    // Shift filter decides which timing column is shown
    const showMorning = shiftFilter !== 'Evening';
    const showEvening = shiftFilter !== 'Morning';

    if (filtered.length === 0) {
        body.innerHTML = `<tr><td colspan="7" class="px-6 py-8 text-center text-slate-400">No matching pickup stops found.</td></tr>`;
        return;
    }

    body.innerHTML = filtered.map(p => `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="px-6 py-4 font-semibold text-slate-900 dark:text-white">${p.location}</td>
            <td class="px-6 py-4"><span class="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">${p.zone} Zone</span></td>
            <td class="px-6 py-4 font-bold text-brand-600 dark:text-sky-400">${p.bus}</td>
            <td class="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">${showMorning ? p.morning : '&mdash;'}</td>
            <td class="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">${showEvening ? p.evening : '&mdash;'}</td>
            <td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">${p.landmark}</td>
            <td class="px-6 py-4 text-right">
                <button onclick="switchTab('routes')" class="text-xs text-brand-600 dark:text-sky-400 font-bold hover:underline">View Bus</button>
            </td>
        </tr>
    `).join('');
}

// Modal Handler
function openRouteModal(busId) {
    const bus = BUS_DATA.find(b => b.id === busId);
    if (!bus) return;

    document.getElementById('modalBusTitle').innerText = `${bus.number} - ${bus.routeName}`;
    document.getElementById('modalRouteSubtitle').innerText = `Driver: ${bus.driver} (${bus.contact})`;

    const timeline = document.getElementById('modalTimelineBody');
    timeline.innerHTML = `
        <div class="relative pl-6 border-l-2 border-brand-500 space-y-6">
            ${bus.stops.map((stop, idx) => `
                <div class="relative">
                    <span class="absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-brand-500 bg-white dark:bg-slate-800"></span>
                    <div class="flex justify-between items-baseline">
                        <h4 class="font-bold text-slate-900 dark:text-white text-sm">${stop.name}</h4>
                        <span class="text-xs font-mono font-semibold text-brand-600 dark:text-sky-400 bg-brand-50 dark:bg-slate-700 px-2 py-0.5 rounded">${stop.time}</span>
                    </div>
                    <p class="text-xs text-slate-400 mt-0.5">${idx === 0 ? 'Starting Point' : idx === bus.stops.length - 1 ? 'Campus Terminal' : 'Intermediate Pickup Point'}</p>
                </div>
            `).join('')}
        </div>
    `;

    document.getElementById('routeModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('routeModal').classList.add('hidden');
}

// Hero Search Integration
function handleHeroSearch(e) {
    if (e.key === 'Enter') executeHeroSearch();
}

function executeHeroSearch() {
    const query = document.getElementById('heroSearchInput').value.trim();
    if (!query) return;

    // Redirect to routes tab and set filter
    switchTab('routes');
    document.getElementById('routesSearch').value = query;
    renderRoutes();
}

// Populate Simulator Dropdown
function populateSimulatorOptions() {
    const sel = document.getElementById('simulatorBusSelect');
    sel.innerHTML = BUS_DATA.map(b => `<option value="${b.id}">${b.number} - ${b.routeName}</option>`).join('');
}

function selectBusInSim(busId) {
    const sel = document.getElementById('simulatorBusSelect');
    sel.value = busId;
    initTrackerSimulation();
}

function resetSimulation() {
    simProgress = 0;
}

// Canvas Simulation Logic
function initTrackerSimulation() {
    const busId = document.getElementById('simulatorBusSelect').value;
    const bus = BUS_DATA.find(b => b.id === busId) || BUS_DATA[0];

    // Update Sidebar Info
    document.getElementById('simBusTitle').innerText = `${bus.number} Info`;
    document.getElementById('simRouteName').innerText = bus.routeName;
    document.getElementById('simDriverName').innerText = `${bus.driver} (${bus.contact})`;

    const stopList = document.getElementById('simStopList');
    stopList.innerHTML = bus.stops.map((s, idx) => `
        <div class="relative">
            <span id="sim-dot-${idx}" class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">${s.name}</p>
            <p class="text-[10px] text-slate-400">${s.time}</p>
        </div>
    `).join('');

    // Canvas Drawing Loop Setup
    const canvas = document.getElementById('trackerCanvas');
    const ctx = canvas.getContext('2d');

    // Set Resolution
const width = canvas.parentElement.clientWidth || 600;
const height = canvas.parentElement.clientHeight || 350;

canvas.width = width * window.devicePixelRatio;
canvas.height = height * window.devicePixelRatio;

    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 60;
        const w = canvas.width - padding * 2;
        const h = canvas.height - padding * 2;

        // Define Path Points (S-Curve Loop)
        const points = bus.stops.map((_, i) => {
            const ratio = i / (bus.stops.length - 1);
            const x = padding + ratio * w;
            const y = padding + (Math.sin(ratio * Math.PI * 2) * (h / 3)) + (h / 2);
            return { x, y };
        });

        // Draw Track Line
        ctx.beginPath();
        ctx.lineWidth = 6 * window.devicePixelRatio;
        ctx.strokeStyle = '#334155';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        points.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        // Draw Active Progress Path
        ctx.beginPath();
        ctx.lineWidth = 6 * window.devicePixelRatio;
        ctx.strokeStyle = '#0284c7';
        
        const currSegment = simProgress * (points.length - 1);
        const activeIdx = Math.floor(currSegment);
        const subProgress = currSegment - activeIdx;

        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < activeIdx; i++) {
            ctx.lineTo(points[i + 1].x, points[i + 1].y);
        }
        if (activeIdx < points.length - 1) {
            const currPt = points[activeIdx];
            const nextPt = points[activeIdx + 1];
            const interpX = currPt.x + (nextPt.x - currPt.x) * subProgress;
            const interpY = currPt.y + (nextPt.y - currPt.y) * subProgress;
            ctx.lineTo(interpX, interpY);
        }
        ctx.stroke();

        // Draw Stop Nodes
        points.forEach((pt, idx) => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 8 * window.devicePixelRatio, 0, Math.PI * 2);
            ctx.fillStyle = idx <= activeIdx ? '#38bdf8' : '#64748b';
            ctx.fill();
            ctx.lineWidth = 2 * window.devicePixelRatio;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Update UI stop dots
            const dot = document.getElementById(`sim-dot-${idx}`);
            if (dot) {
                if (idx <= activeIdx) dot.className = 'absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-400 ring-2 ring-sky-200';
                else dot.className = 'absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600';
            }
        });

        // Calculate Bus Marker Position
        let busX = points[0].x;
        let busY = points[0].y;
        if (activeIdx < points.length - 1) {
            const currPt = points[activeIdx];
            const nextPt = points[activeIdx + 1];
            busX = currPt.x + (nextPt.x - currPt.x) * subProgress;
            busY = currPt.y + (nextPt.y - currPt.y) * subProgress;
        } else {
            busX = points[points.length - 1].x;
            busY = points[points.length - 1].y;
        }

        // Draw Bus Marker
        ctx.beginPath();
        ctx.arc(busX, busY, 14 * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.lineWidth = 3 * window.devicePixelRatio;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Bus Icon/Text on Map
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${10 * window.devicePixelRatio}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BUS', busX, busY);

        // Update ETA Label
        const remainingMins = Math.max(1, Math.round((1 - simProgress) * 15));
        document.getElementById('simNextEta').innerText = `${remainingMins} mins`;

        // Increment Animation Progress Loop
        simProgress += 0.0015;
        if (simProgress > 1) simProgress = 0;

        animationFrameId = requestAnimationFrame(draw);
    }

    draw();
}

// Fee Calculator Logic
function setCalcTerm(term) {
    calcTerm = term;
    const b1 = document.getElementById('btnTerm1');
    const b2 = document.getElementById('btnTerm2');

    if (term === 'semester') {
        b1.className = 'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-sky-400';
        b2.className = 'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300';
    } else {
        b2.className = 'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-sky-400';
        b1.className = 'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300';
    }
    calculateFee();
}

function calculateFee() {
    const cat = document.getElementById('calcCategory').value;
    const distance = parseInt(document.getElementById('calcZone').value);

    let baseFare = 0;
    if (distance <= 10) baseFare = 3000;
    else if (distance <= 25) baseFare = 4500;
    else if (distance <= 40) baseFare = 6000;
    else baseFare = 7500;

    if (calcTerm === 'annual') {
        baseFare = baseFare * 2 * 0.9; // 10% annual discount
    }

    let discount = 0;
    if (cat === 'concession') discount = baseFare * 0.2;
    else if (cat === 'faculty') discount = baseFare * 0.15;

    const techFee = 200;
    const total = baseFare - discount + techFee;

    document.getElementById('calcBaseFare').innerText = `₹${baseFare.toFixed(2)}`;
    document.getElementById('calcDiscount').innerText = `-₹${discount.toFixed(2)}`;
    document.getElementById('calcTotal').innerText = `₹${total.toFixed(2)}`;
}

function printFeeReceipt() {
    const total = document.getElementById('calcTotal').innerText;
    const msg = `Campus Transport Pass Estimate\nTotal Payable: ${total}\nTerm: ${calcTerm.toUpperCase()}\n\nPlease present this estimate at the Transport Cell in Admin Block Room 102.`;
    
    // Temporary message box instead of alert
    const div = document.createElement('div');
    div.className = "fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 max-w-sm text-xs space-y-2";
    div.innerHTML = `
        <div class="flex justify-between items-center"><span class="font-bold text-sky-400">Estimate Summary</span><button onclick="this.parentElement.parentElement.remove()" class="text-slate-400">&times;</button></div>
        <p class="whitespace-pre-line text-slate-300">${msg}</p>
    `;
    document.body.appendChild(div);
    setTimeout(() => { if (div) div.remove(); }, 6000);
}