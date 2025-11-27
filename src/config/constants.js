// src/config/constants.js

// IMPORTANT: Update the API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * 🗺️ ALL_LOCATIONS_MAP
 * Maps location keys (for internal logic) to their display names (for UI).
 */
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
    // Seat numbers are dynamic and are handled via USER_LOCATIONS_DATA, 
    // but the following are mapped for consistency:
    'Seat_10': 'Seat 10',
    'Seat_12': 'Seat 12',
    'Seat_20': 'Seat 20',
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
    'Others'
];


/**
 * 👥 USER LOCATION DATA
 */
export const USER_LOCATIONS_DATA = [
    { name: 'Ajay', location: 'Seat_A1', access: 'Confrence' },
    { name: 'Tannu', location: 'Seat_A2', access: 'Own seat' },
    { name: 'Lovekush', location: 'Seat_A3', access: 'Own seat' },
    { name: 'Ansh', location: 'Seat_A4', access: 'Own seat' },
    { name: 'Vanshika', location: 'Seat_A5', access: 'Own seat' },
    { name: 'Sonu', location: 'Seat_A6', access: 'Confrence' },
    { name: 'Khushi', location: 'Seat_A7', access: 'Confrence' },
    { name: 'Sneha', location: 'Reception', access: 'Own seat' },
    { name: 'Muskan', location: 'Seat_A8', access: 'Own seat' },
    { name: 'Nikita', location: 'Seat_A9', access: 'Own seat' },
    { name: 'Saloni', location: 'Seat_A10', access: 'Own seat' },
    { name: 'Babita', location: 'Reception', access: 'Own seat' },
    { name: 'Monu', location: 'Seat_A11', access: 'Own seat' },
    { name: 'Sourabh', location: 'Seat_A12', access: 'Own seat' },
    { name: 'Gurmeet', location: 'Maven_Area', access: 'Confrence' },
    { name: 'Sneha Lathwal', location: 'Seat_A13', access: 'Own seat' },
    { name: 'Vanshika Jagga', location: 'Seat_A14', access: 'Own seat' },
    { name: 'Nisha', location: 'Reception', access: 'Pod room/Confrence' },
    { name: 'Suhana', location: 'Seat_10', access: 'All' },
    { name: 'Ketan', location: 'Ketan_Cabin', access: 'All' },
    { name: 'Bhavishya', location: 'Bhavishya_Cabin', access: 'All' },
    { name: 'Satish', location: 'Seat_12', access: 'Own seat' },
    { name: 'Sahil', location: 'Seat_20', access: 'Own seat/Confrence' },
    { name: 'Diwakar', location: 'Diwakar_Sir_Cabin', access: 'All' },
    { name: 'Sharma Sir', location: 'Sharma_Sir_Office', access: 'All' },
    { name: 'Ritesh Sir', location: 'Ritesh_Sir_Cabin', access: 'All' },
];

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


// Other constants remain the same
export const COFFEE_TYPES = ["Black", "Milk", "Simple", "Cold"];
export const TEA_TYPES = ["Black", "Milk", "Green"];
export const MILK_TYPES = ["Hot", "Cold"];
export const WATER_TYPES = ["Warm", "Cold", "Hot", "Lemon"];
export const SUGAR_LEVELS = [0, 1, 2, 3];
export const TABLE_NUMBERS = Array.from({ length: 25 }, (_, i) => i + 1);

// New constant for Add-Ons that support multiple selections
export const ADD_ONS = [
    "Ginger",
    "Cloves",
    "Fennel Seeds",
    "Cardamom",
    "Cinnamon",
];