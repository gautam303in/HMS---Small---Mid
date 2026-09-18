/**
 * Standardized Master Dropdown Datasets for The Grand Azure HMS
 */

export interface DropdownOption {
  value: string;
  label: string;
  code?: string;
  extra?: string;
}

// 36 Indian States & Union Territories with official GST State Codes
export const INDIAN_STATES: DropdownOption[] = [
  { value: 'Goa', label: 'Goa (30)', code: '30' },
  { value: 'Maharashtra', label: 'Maharashtra (27)', code: '27' },
  { value: 'Karnataka', label: 'Karnataka (29)', code: '29' },
  { value: 'Delhi', label: 'Delhi NCR (07)', code: '07' },
  { value: 'Gujarat', label: 'Gujarat (24)', code: '24' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu (33)', code: '33' },
  { value: 'Kerala', label: 'Kerala (32)', code: '32' },
  { value: 'Telangana', label: 'Telangana (36)', code: '36' },
  { value: 'Rajasthan', label: 'Rajasthan (08)', code: '08' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh (09)', code: '09' },
  { value: 'West Bengal', label: 'West Bengal (19)', code: '19' },
  { value: 'Punjab', label: 'Punjab (03)', code: '03' },
  { value: 'Haryana', label: 'Haryana (06)', code: '06' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh (23)', code: '23' },
  { value: 'Andhra Pradesh', label: 'Andhra Pradesh (37)', code: '37' },
  { value: 'Bihar', label: 'Bihar (10)', code: '10' },
  { value: 'Chandigarh', label: 'Chandigarh (04)', code: '04' },
  { value: 'Chhattisgarh', label: 'Chhattisgarh (22)', code: '22' },
  { value: 'Himachal Pradesh', label: 'Himachal Pradesh (02)', code: '02' },
  { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir (01)', code: '01' },
  { value: 'Jharkhand', label: 'Jharkhand (20)', code: '20' },
  { value: 'Ladakh', label: 'Ladakh (38)', code: '38' },
  { value: 'Odisha', label: 'Odisha (21)', code: '21' },
  { value: 'Puducherry', label: 'Puducherry (34)', code: '34' },
  { value: 'Uttarakhand', label: 'Uttarakhand (05)', code: '05' },
  { value: 'Assam', label: 'Assam (18)', code: '18' },
  { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh (12)', code: '12' },
  { value: 'Manipur', label: 'Manipur (14)', code: '14' },
  { value: 'Meghalaya', label: 'Meghalaya (17)', code: '17' },
  { value: 'Mizoram', label: 'Mizoram (15)', code: '15' },
  { value: 'Nagaland', label: 'Nagaland (13)', code: '13' },
  { value: 'Sikkim', label: 'Sikkim (11)', code: '11' },
  { value: 'Tripura', label: 'Tripura (16)', code: '16' },
  { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar (35)', code: '35' },
  { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra & Nagar Haveli and Daman & Diu (26)', code: '26' },
  { value: 'Lakshadweep', label: 'Lakshadweep (31)', code: '31' },
  { value: 'Other / International', label: 'Other Territory / International (97)', code: '97' }
];

// Hospitality & Hotel Inventory Units
export const INVENTORY_UNITS: DropdownOption[] = [
  { value: 'pcs', label: 'pcs (Pieces)' },
  { value: 'kg', label: 'kg (Kilograms)' },
  { value: 'g', label: 'g (Grams)' },
  { value: 'ltr', label: 'ltr (Litres)' },
  { value: 'ml', label: 'ml (Millilitres)' },
  { value: 'box', label: 'box (Boxes)' },
  { value: 'pack', label: 'pack (Packs)' },
  { value: 'roll', label: 'roll (Rolls)' },
  { value: 'set', label: 'set (Sets)' },
  { value: 'bottles', label: 'bottles (Bottles)' },
  { value: 'cans', label: 'cans (Cans)' },
  { value: 'canisters', label: 'canisters (Canisters)' },
  { value: 'bundle', label: 'bundle (Bundles)' },
  { value: 'meter', label: 'meter (Meters)' },
  { value: 'pair', label: 'pair (Pairs)' },
  { value: 'dozen', label: 'dozen (Dozens)' }
];

// Nationalities for Guest Check-in & KYC
export const NATIONALITIES: DropdownOption[] = [
  { value: 'India', label: 'India' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'France', label: 'France' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'Russia', label: 'Russia' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Other', label: 'Other' }
];

// Hospitality Staff Roles
export const STAFF_ROLES: DropdownOption[] = [
  { value: 'Front Desk Agent', label: 'Front Desk Agent' },
  { value: 'Front Desk Lead', label: 'Front Desk Lead' },
  { value: 'Concierge Specialist', label: 'Concierge Specialist' },
  { value: 'Duty Manager', label: 'Duty Manager' },
  { value: 'General Manager', label: 'General Manager' },
  { value: 'Housekeeping Attendant', label: 'Housekeeping Attendant' },
  { value: 'Housekeeping Supervisor', label: 'Housekeeping Supervisor' },
  { value: 'Executive Chef', label: 'Executive Chef' },
  { value: 'Sous Chef', label: 'Sous Chef' },
  { value: 'F&B Server', label: 'F&B Server' },
  { value: 'Bartender', label: 'Bartender' },
  { value: 'Maintenance Technician', label: 'Maintenance Technician' },
  { value: 'Chief Engineer', label: 'Chief Engineer' },
  { value: 'Security Guard', label: 'Security Guard' },
  { value: 'Financial Accountant', label: 'Financial Accountant' }
];

// Hotel Departments
export const STAFF_DEPARTMENTS: DropdownOption[] = [
  { value: 'Front Office', label: 'Front Office' },
  { value: 'Housekeeping', label: 'Housekeeping' },
  { value: 'Food & Beverage', label: 'Food & Beverage' },
  { value: 'Maintenance & Engineering', label: 'Maintenance & Engineering' },
  { value: 'Security & Safety', label: 'Security & Safety' },
  { value: 'Finance & Accounts', label: 'Finance & Accounts' },
  { value: 'Management & Admin', label: 'Management & Admin' }
];

// Staff Shifts
export const STAFF_SHIFTS: DropdownOption[] = [
  { value: 'Morning (07:00 - 15:30)', label: 'Morning (07:00 - 15:30)' },
  { value: 'Afternoon (15:00 - 23:30)', label: 'Afternoon (15:00 - 23:30)' },
  { value: 'Night (23:00 - 07:30)', label: 'Night (23:00 - 07:30)' },
  { value: 'General (09:00 - 18:00)', label: 'General (09:00 - 18:00)' },
  { value: 'Split Shift (11:00 - 15:00 & 19:00 - 23:00)', label: 'Split Shift (11:00-15:00 & 19:00-23:00)' }
];

// POS Kitchen Preparation Times
export const MENU_PREP_TIMES: DropdownOption[] = [
  { value: '5 mins', label: '5 mins (Quick Snack / Beverage)' },
  { value: '10 mins', label: '10 mins' },
  { value: '15 mins', label: '15 mins (Standard Appetizer)' },
  { value: '20 mins', label: '20 mins (Main Course)' },
  { value: '25 mins', label: '25 mins' },
  { value: '30 mins', label: '30 mins (Gourmet / Grill)' },
  { value: '45 mins', label: '45 mins (Special Order)' },
  { value: '60 mins', label: '60 mins (Slow Cooked / Banquet)' }
];

// Booking Channels / Sources
export const BOOKING_CHANNELS: DropdownOption[] = [
  { value: 'Direct', label: 'Direct Front Desk / Web' },
  { value: 'Booking.com', label: 'Booking.com' },
  { value: 'Airbnb', label: 'Airbnb' },
  { value: 'Expedia', label: 'Expedia' },
  { value: 'MakeMyTrip', label: 'MakeMyTrip' },
  { value: 'Agoda', label: 'Agoda' },
  { value: 'Corporate Travel', label: 'Corporate Travel / Direct Invoice' }
];

// Currencies
export const SUPPORTED_CURRENCIES: DropdownOption[] = [
  { value: 'INR', label: 'INR - Indian Rupee (₹)', code: '₹' },
  { value: 'USD', label: 'USD - US Dollar ($)', code: '$' },
  { value: 'EUR', label: 'EUR - Euro (€)', code: '€' },
  { value: 'GBP', label: 'GBP - British Pound (£)', code: '£' },
  { value: 'AED', label: 'AED - UAE Dirham (د.إ)', code: 'د.إ' },
  { value: 'SGD', label: 'SGD - Singapore Dollar (S$)', code: 'S$' }
];

// Timezones
export const TIMEZONES: DropdownOption[] = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST +5:30)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST +4:00)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'America/New_York', label: 'America/New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los Angeles (PST/PDT)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT +8:00)' }
];

// HSN / SAC Hospitality Codes
export const HSN_SAC_CODES: DropdownOption[] = [
  { value: '996311', label: '996311 - Room Accommodation Services (Hotels, Inns, Guest Houses)' },
  { value: '996331', label: '996331 - Restaurant & Food/Beverage Catering Services' },
  { value: '996322', label: '996322 - Banquet Hall, Exhibition & Convention Leasing Services' },
  { value: '999799', label: '999799 - Other Miscellaneous Hospitality & Laundry Services' }
];
