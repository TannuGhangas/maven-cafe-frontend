// src/config/constants.js

// IMPORTANT: Update the API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Constants for order selection
export const LOCATIONS = [
    "Sharma Sir Cabin", "Ritesh Sir Cabin", "Bhavishya cabin", 
    "Ketan cabin", "Conference Room", "Podroom 1", 
    "Podroom 2", "Reception", "Maven", "Others"
];

export const COFFEE_TYPES = ["Black Coffee", "Milk Coffee", "Simple Coffee"];
export const TEA_TYPES = ["Black Tea", "Milk Tea", "Green Tea", "Ginger Tea", "Masala Tea"];
export const MILK_TYPES = ["Hot", "Cold", "Flavored"];
export const WATER_TYPES = ["Hot", "Cold", "Sparkling"];
export const SUGAR_LEVELS = [0, 1, 2, 3];
export const TABLE_NUMBERS = Array.from({ length: 25 }, (_, i) => i + 1);