// src/config/constants.js

// IMPORTANT: Update the API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * 🗺️ ALL_LOCATIONS_MAP
 * Maps location keys (for internal logic) to their display names (for UI).
 */
const seatMap = {};
for (let i = 1; i <= 25; i++) {
    seatMap[`Seat_${i}`] = `Seat ${i}`;
}

export const ALL_LOCATIONS_MAP = {
    'Confrence': 'Conference Room',
    'Pod_Room': 'Pod Room',
    'Reception': 'Reception',
    'Maven_Area': 'Maven',
    'Sharma_Sir_Office': 'Sharma Sir Office',
    'Ritesh_Sir_Cabin': 'Ritesh Sir Cabin',
    'Bhavishya_Cabin': 'Bhavishya Cabin',
    'Ketan_Cabin': 'Ketan Cabin',
    'Diwakar_Sir_Cabin': 'Diwakar Sir Cabin',
    'Others': 'Others',
    ...seatMap,
};

// Global locations available for selection when user access permits ('All')
export const GLOBAL_LOCATIONS = [
    'Confrence',
    'Pod_Room',
    'Reception',
    'Maven_Area',
    'Sharma_Sir_Office',
    'Ritesh_Sir_Cabin',
    'Bhavishya_Cabin',
    'Ketan_Cabin',
    'Diwakar_Sir_Cabin',
    'Others',
    ...Array.from({ length: 25 }, (_, i) => `Seat_${i + 1}`)
];


/**
 * 👥 USER LOCATION DATA
 */
export const USER_LOCATIONS_DATA = (() => {
    try {
        const saved = localStorage.getItem('adminLocations');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Ajay', location: 'Seat_7', access: 'Confrence' },
            { id: 2, name: 'Tannu', location: 'Seat_8', access: 'Own seat' },
            { id: 3, name: 'Lovekush', location: 'Seat_6', access: 'Own seat' },
            { id: 4, name: 'Ansh', location: 'Seat_5', access: 'Own seat' },
            { id: 5, name: 'Vanshika', location: 'Seat_4', access: 'Own seat' },
            { id: 6, name: 'Sonu', location: 'Seat_3', access: 'Confrence' },
            { id: 7, name: 'Khushi', location: 'Seat_15', access: 'Confrence' },
            { id: 8, name: 'Sneha', location: 'Reception', access: 'Own seat' },
            { id: 9, name: 'Muskan', location: 'Seat_11', access: 'Own seat' },
            { id: 10, name: 'Nikita', location: 'Seat_16', access: 'Own seat' },
            { id: 11, name: 'Saloni', location: 'Seat_14', access: 'Own seat' },
            { id: 12, name: 'Babita', location: 'Reception', access: 'Own seat' },
            { id: 13, name: 'Monu', location: 'Seat_1', access: 'Own seat' },
            { id: 14, name: 'Sourabh', location: 'Seat_2', access: 'Own seat' },
            { id: 15, name: 'Gurmeet', location: 'Maven_Area', access: 'Confrence' },
            { id: 16, name: 'Sneha Lathwal', location: 'Maven_Area', access: 'Own seat' },
            { id: 17, name: 'Vanshika Jagga', location: 'Maven_Area', access: 'Own seat' },
            { id: 18, name: 'Nisha', location: 'Reception', access: 'Pod room/Confrence' },
            { id: 19, name: 'Suhana', location: 'Seat_10', access: 'All' },
            { id: 20, name: 'Ketan', location: 'Ketan_Cabin', access: 'All' },
            { id: 21, name: 'Bhavishya', location: 'Bhavishya_Cabin', access: 'All' },
            { id: 22, name: 'Satish', location: 'Seat_12', access: 'Own seat' },
            { id: 23, name: 'Sahil', location: 'Seat_20', access: 'Own seat/Confrence' },
            { id: 24, name: 'Diwakar', location: 'Diwakar_Sir_Cabin', access: 'All' },
            { id: 25, name: 'Sharma Sir', location: 'Sharma_Sir_Office', access: 'All' },
            { id: 26, name: 'Ritesh Sir', location: 'Ritesh_Sir_Cabin', access: 'All' },
        ];
    } catch {
        return [
            { id: 1, name: 'Ajay', location: 'Seat_7', access: 'Confrence' },
            { id: 2, name: 'Tannu', location: 'Seat_8', access: 'Own seat' },
            { id: 3, name: 'Lovekush', location: 'Seat_6', access: 'Own seat' },
            { id: 4, name: 'Ansh', location: 'Seat_5', access: 'Own seat' },
            { id: 5, name: 'Vanshika', location: 'Seat_4', access: 'Own seat' },
            { id: 6, name: 'Sonu', location: 'Seat_3', access: 'Confrence' },
            { id: 7, name: 'Khushi', location: 'Seat_15', access: 'Confrence' },
            { id: 8, name: 'Sneha', location: 'Reception', access: 'Own seat' },
            { id: 9, name: 'Muskan', location: 'Seat_11', access: 'Own seat' },
            { id: 10, name: 'Nikita', location: 'Seat_16', access: 'Own seat' },
            { id: 11, name: 'Saloni', location: 'Seat_14', access: 'Own seat' },
            { id: 12, name: 'Babita', location: 'Reception', access: 'Own seat' },
            { id: 13, name: 'Monu', location: 'Seat_1', access: 'Own seat' },
            { id: 14, name: 'Sourabh', location: 'Seat_2', access: 'Own seat' },
            { id: 15, name: 'Gurmeet', location: 'Maven_Area', access: 'Confrence' },
            { id: 16, name: 'Sneha Lathwal', location: 'Maven_Area', access: 'Own seat' },
            { id: 17, name: 'Vanshika Jagga', location: 'Maven_Area', access: 'Own seat' },
            { id: 18, name: 'Nisha', location: 'Reception', access: 'Pod room/Confrence' },
            { id: 19, name: 'Suhana', location: 'Seat_10', access: 'All' },
            { id: 20, name: 'Ketan', location: 'Ketan_Cabin', access: 'All' },
            { id: 21, name: 'Bhavishya', location: 'Bhavishya_Cabin', access: 'All' },
            { id: 22, name: 'Satish', location: 'Seat_12', access: 'Own seat' },
            { id: 23, name: 'Sahil', location: 'Seat_20', access: 'Own seat/Confrence' },
            { id: 24, name: 'Diwakar', location: 'Diwakar_Sir_Cabin', access: 'All' },
            { id: 25, name: 'Sharma Sir', location: 'Sharma_Sir_Office', access: 'All' },
            { id: 26, name: 'Ritesh Sir', location: 'Ritesh_Sir_Cabin', access: 'All' },
        ];
    }
})();

/**
 * 🔧 FUNCTION to determine allowed location options for a user.
 */
export const getAllowedLocations = (locationKey, accessType) => {
    const userLocationName = locationKey.startsWith('Seat_') ?
        `Seat ${locationKey.substring(5).replace('A','')}` :
        ALL_LOCATIONS_MAP[locationKey] || locationKey;

    let allowedOptions = [{ key: locationKey, name: userLocationName }];

    if (accessType === 'All') {
        const globalLocationsMap = {};
        GLOBAL_LOCATIONS.forEach(key => {
            if (key !== locationKey) {
                globalLocationsMap[key] = ALL_LOCATIONS_MAP[key];
            }
        });

        allowedOptions = allowedOptions.concat(
            Object.keys(globalLocationsMap).map(key => ({ key, name: globalLocationsMap[key] }))
        );

    } else if (accessType.includes(',')) {
        // Handle comma-separated locations
        const additionalLocations = accessType.split(',').map(loc => loc.trim());
        additionalLocations.forEach(loc => {
            if (loc !== locationKey && GLOBAL_LOCATIONS.includes(loc)) {
                allowedOptions.push({ key: loc, name: ALL_LOCATIONS_MAP[loc] });
            }
        });
    } else if (accessType.includes('Confrence')) {
        if (locationKey !== 'Confrence') {
              allowedOptions.push({ key: 'Confrence', name: ALL_LOCATIONS_MAP.Confrence });
        }

        if (accessType.includes('Pod room') && locationKey !== 'Pod_Room') {
            allowedOptions.push({ key: 'Pod_Room', name: ALL_LOCATIONS_MAP.Pod_Room });
        }
    }

    const uniqueKeys = new Set();
    return allowedOptions.filter(option => {
        if (!uniqueKeys.has(option.key)) {
            uniqueKeys.add(option.key);
            return true;
        }
        return false;
    });
};


// Dynamic menu constants that read from admin changes
const getMenuCategories = () => {
    try {
        const saved = localStorage.getItem('adminMenuCategories');
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

const categories = getMenuCategories();

export const COFFEE_TYPES = categories ? (categories.find(c => c.name === 'Coffee')?.items?.map(item => typeof item === 'string' ? { name: item, available: true } : { name: item.name || item, available: item.available !== false }) || [{ name: "Black", available: true }, { name: "Milk", available: true }, { name: "Simple", available: true }, { name: "Cold", available: true }]) : [{ name: "Black", available: true }, { name: "Milk", available: true }, { name: "Simple", available: true }, { name: "Cold", available: true }];
export const TEA_TYPES = categories ? (categories.find(c => c.name === 'Tea')?.items?.map(item => typeof item === 'string' ? { name: item, available: true } : { name: item.name || item, available: item.available !== false }) || [{ name: "Black", available: true }, { name: "Milk", available: true }, { name: "Green", available: true }]) : [{ name: "Black", available: true }, { name: "Milk", available: true }, { name: "Green", available: true }];
export const WATER_TYPES = categories ? (categories.find(c => c.name === 'Water')?.items?.map(item => typeof item === 'string' ? { name: item, available: true } : { name: item.name || item, available: item.available !== false }) || [{ name: "Warm", available: true }, { name: "Cold", available: true }, { name: "Hot", available: true }, { name: "Lemon", available: true }]) : [{ name: "Warm", available: true }, { name: "Cold", available: true }, { name: "Hot", available: true }, { name: "Lemon", available: true }];

export const SUGAR_LEVELS = (() => {
    try {
        const saved = localStorage.getItem('adminSugarLevels');
        return saved ? JSON.parse(saved) : [0, 1, 2, 3];
    } catch {
        return [0, 1, 2, 3];
    }
})();

export const ADD_ONS = (() => {
    try {
        const saved = localStorage.getItem('adminAddOns');
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.map(addOn => typeof addOn === 'string' ? { name: addOn, available: true } : { name: addOn.name || addOn, available: addOn.available !== false });
        }
    } catch {}
    return [
        { name: "Ginger", available: true },
    ];
})();

export const TABLE_NUMBERS = Array.from({ length: 25 }, (_, i) => i + 1);