export const GOVERNORATES = [
    { id: 'cairo', name: 'Cairo', xpRequired: 0, lat: 30.0444, lng: 31.2357 },
    { id: 'alexandria', name: 'Alexandria', xpRequired: 0, lat: 31.2001, lng: 29.9187 },
    { id: 'giza', name: 'Giza', xpRequired: 200, lat: 30.0131, lng: 31.2089 },
    { id: 'luxor', name: 'Luxor', xpRequired: 500, lat: 25.6872, lng: 32.6396 },
    { id: 'aswan', name: 'Aswan', xpRequired: 1000, lat: 24.0889, lng: 32.8998 },
    { id: 'port_said', name: 'Port Said', xpRequired: 1500, lat: 31.2653, lng: 32.3019 },
    { id: 'suez', name: 'Suez', xpRequired: 2000, lat: 29.9668, lng: 32.5498 },
    { id: 'ismailia', name: 'Ismailia', xpRequired: 2500, lat: 30.6044, lng: 32.2723 },
    { id: 'damietta', name: 'Damietta', xpRequired: 3000, lat: 31.4175, lng: 31.8144 },
    { id: 'daqahliyah', name: 'Daqahliyah', xpRequired: 3500, lat: 31.0409, lng: 31.3785 },
    { id: 'sharqiyah', name: 'Sharqiyah', xpRequired: 4000, lat: 30.5877, lng: 31.502 },
    { id: 'qalyubiyah', name: 'Qalyubiyah', xpRequired: 4500, lat: 30.4591, lng: 31.1784 },
    { id: 'kafr_el_sheikh', name: 'Kafr El Sheikh', xpRequired: 5000, lat: 31.1107, lng: 30.9388 },
    { id: 'gharbiya', name: 'Gharbiya', xpRequired: 5500, lat: 30.7865, lng: 31.0004 },
    { id: 'monufiya', name: 'Monufiya', xpRequired: 6000, lat: 30.563, lng: 31.001 },
    { id: 'beheira', name: 'Beheira', xpRequired: 6500, lat: 31.0364, lng: 30.4694 },
    { id: 'matrouh', name: 'Matrouh', xpRequired: 7000, lat: 31.3543, lng: 27.2373 },
    { id: 'new_valley', name: 'New Valley', xpRequired: 8000, lat: 25.439, lng: 30.559 },
    { id: 'beni_suef', name: 'Beni Suef', xpRequired: 9000, lat: 29.0661, lng: 31.0994 },
    { id: 'fayoum', name: 'Fayoum', xpRequired: 10000, lat: 29.3084, lng: 30.8428 },
    { id: 'minya', name: 'Minya', xpRequired: 12000, lat: 28.11, lng: 30.75 },
    { id: 'assiut', name: 'Assiut', xpRequired: 14000, lat: 27.181, lng: 31.183 },
    { id: 'sohag', name: 'Sohag', xpRequired: 16000, lat: 26.557, lng: 31.695 },
    { id: 'qena', name: 'Qena', xpRequired: 18000, lat: 26.155, lng: 32.716 },
    { id: 'red_sea', name: 'Red Sea', xpRequired: 20000, lat: 27.257, lng: 33.812 },
    { id: 'sinai_north', name: 'North Sinai', xpRequired: 25000, lat: 31.132, lng: 33.803 },
    { id: 'sinai_south', name: 'South Sinai', xpRequired: 30000, lat: 28.236, lng: 33.625 },
];

export const isUnlocked = (gov, userXp) => {
    return (userXp || 0) >= gov.xpRequired;
};
