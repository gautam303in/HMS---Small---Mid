/**
 * Dynamic Field Validation Engine for The Grand Azure HMS
 * Allows Admin to configure, test, and enforce custom validation rules per entity.
 */

export type ValidationPreset = 
  | 'none'
  | 'phone_india'
  | 'phone_intl'
  | 'email'
  | 'gstin_india'
  | 'pan_india'
  | 'aadhaar_india'
  | 'positive_number'
  | 'alphanumeric'
  | 'custom';

export interface FieldValidationRule {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  preset: ValidationPreset;
  customRegex?: string;
  errorMessage: string;
  enabled: boolean;
  helpText?: string;
}

export type EntityKey = 'guestCheckIn' | 'reservation' | 'hotelProfile' | 'inventorySku' | 'staffMember';

export type SystemValidationConfig = Record<EntityKey, FieldValidationRule[]>;

export const PRESET_PATTERNS: Record<ValidationPreset, { regex: RegExp | null; description: string; placeholder: string }> = {
  none: {
    regex: null,
    description: 'No format restrictions (Any text permitted)',
    placeholder: 'Any value'
  },
  phone_india: {
    regex: /^[6-9]\d{9}$/,
    description: '10-digit Indian Mobile number (starts with 6, 7, 8, or 9)',
    placeholder: '9876543210'
  },
  phone_intl: {
    regex: /^\+?[1-9]\d{6,14}$/,
    description: 'E.164 International Phone Number with optional +',
    placeholder: '+919876543210'
  },
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    description: 'Standard RFC-compliant email address',
    placeholder: 'guest@example.com'
  },
  gstin_india: {
    regex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    description: '15-character Indian Goods & Services Tax Identification Number (GSTIN)',
    placeholder: '27AAAAA0000A1Z5'
  },
  pan_india: {
    regex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    description: '10-character Indian Permanent Account Number (PAN)',
    placeholder: 'ABCDE1234F'
  },
  aadhaar_india: {
    regex: /^[2-9]{1}[0-9]{11}$/,
    description: '12-digit Indian Unique Identification (Aadhaar)',
    placeholder: '567890123456'
  },
  positive_number: {
    regex: /^\d+(\.\d+)?$/,
    description: 'Non-negative number or decimal amount',
    placeholder: '150.00'
  },
  alphanumeric: {
    regex: /^[a-zA-Z0-9\s-_]+$/,
    description: 'Alphanumeric characters, spaces, hyphens, and underscores only',
    placeholder: 'A-102'
  },
  custom: {
    regex: null,
    description: 'Custom Regular Expression defined by Admin',
    placeholder: 'Enter valid RegExp string'
  }
};

export const DEFAULT_VALIDATION_RULES: SystemValidationConfig = {
  guestCheckIn: [
    {
      id: 'g-1',
      fieldKey: 'guestName',
      fieldLabel: 'Guest Full Name',
      required: true,
      minLength: 2,
      maxLength: 80,
      preset: 'none',
      errorMessage: 'Guest Full Name is required (min 2 characters)',
      enabled: true
    },
    {
      id: 'g-2',
      fieldKey: 'guestEmail',
      fieldLabel: 'Guest Email Address',
      required: true,
      preset: 'email',
      errorMessage: 'Please enter a valid email address (e.g. guest@domain.com)',
      enabled: true
    },
    {
      id: 'g-3',
      fieldKey: 'guestPhone',
      fieldLabel: 'Guest Mobile Phone',
      required: true,
      preset: 'phone_intl',
      errorMessage: 'Please enter a valid phone number (e.g. +91 9876543210 or 10 digits)',
      enabled: true
    },
    {
      id: 'g-4',
      fieldKey: 'nationality',
      fieldLabel: 'Nationality / Country',
      required: true,
      preset: 'none',
      errorMessage: 'Nationality selection is mandatory for regulatory compliance',
      enabled: true
    },
    {
      id: 'g-5',
      fieldKey: 'guestState',
      fieldLabel: 'State / Union Territory',
      required: true,
      preset: 'none',
      errorMessage: 'State selection is required for GST invoicing and Police Record',
      enabled: true
    },
    {
      id: 'g-6',
      fieldKey: 'documentNumber',
      fieldLabel: 'KYC Document Number',
      required: true,
      minLength: 4,
      maxLength: 30,
      preset: 'none',
      errorMessage: 'A valid Government ID document number is required for check-in',
      enabled: true
    }
  ],
  reservation: [
    {
      id: 'r-1',
      fieldKey: 'guestName',
      fieldLabel: 'Guest Name',
      required: true,
      minLength: 2,
      preset: 'none',
      errorMessage: 'Guest name is required for reservation booking',
      enabled: true
    },
    {
      id: 'r-2',
      fieldKey: 'guestEmail',
      fieldLabel: 'Guest Email',
      required: true,
      preset: 'email',
      errorMessage: 'Valid contact email is required for booking confirmation voucher',
      enabled: true
    },
    {
      id: 'r-3',
      fieldKey: 'roomNumber',
      fieldLabel: 'Room Selection',
      required: true,
      preset: 'none',
      errorMessage: 'A room number must be assigned to this reservation',
      enabled: true
    },
    {
      id: 'r-4',
      fieldKey: 'checkInDate',
      fieldLabel: 'Check-In Date',
      required: true,
      preset: 'none',
      errorMessage: 'Valid check-in date is required',
      enabled: true
    },
    {
      id: 'r-5',
      fieldKey: 'checkOutDate',
      fieldLabel: 'Check-Out Date',
      required: true,
      preset: 'none',
      errorMessage: 'Valid check-out date is required',
      enabled: true
    }
  ],
  hotelProfile: [
    {
      id: 'h-1',
      fieldKey: 'name',
      fieldLabel: 'Property Legal Name',
      required: true,
      minLength: 3,
      preset: 'none',
      errorMessage: 'Property legal name is required (min 3 chars)',
      enabled: true
    },
    {
      id: 'h-2',
      fieldKey: 'gstin',
      fieldLabel: 'GSTIN Number (Tax ID)',
      required: true,
      preset: 'gstin_india',
      errorMessage: 'Must be a valid 15-character Indian GSTIN (e.g. 27AAAAA0000A1Z5)',
      enabled: true
    },
    {
      id: 'h-3',
      fieldKey: 'hsnSacCode',
      fieldLabel: 'HSN/SAC Code',
      required: true,
      minLength: 6,
      maxLength: 8,
      preset: 'positive_number',
      errorMessage: 'HSN/SAC code must be at least 6 digits (e.g. 996311)',
      enabled: true
    },
    {
      id: 'h-4',
      fieldKey: 'contactEmail',
      fieldLabel: 'General Manager / Contact Email',
      required: true,
      preset: 'email',
      errorMessage: 'Valid official property contact email is required',
      enabled: true
    }
  ],
  inventorySku: [
    {
      id: 'i-1',
      fieldKey: 'name',
      fieldLabel: 'Item SKU Name',
      required: true,
      minLength: 2,
      preset: 'none',
      errorMessage: 'Inventory item name is required',
      enabled: true
    },
    {
      id: 'i-2',
      fieldKey: 'category',
      fieldLabel: 'Inventory Category',
      required: true,
      preset: 'none',
      errorMessage: 'Category selection is required',
      enabled: true
    },
    {
      id: 'i-3',
      fieldKey: 'unit',
      fieldLabel: 'Unit of Measure',
      required: true,
      preset: 'none',
      errorMessage: 'Measurement unit is required',
      enabled: true
    },
    {
      id: 'i-4',
      fieldKey: 'currentStock',
      fieldLabel: 'Current Stock Count',
      required: true,
      minValue: 0,
      preset: 'positive_number',
      errorMessage: 'Current stock must be zero or a positive number',
      enabled: true
    },
    {
      id: 'i-5',
      fieldKey: 'minThreshold',
      fieldLabel: 'Minimum Alert Threshold',
      required: true,
      minValue: 1,
      preset: 'positive_number',
      errorMessage: 'Alert threshold must be at least 1',
      enabled: true
    },
    {
      id: 'i-6',
      fieldKey: 'unitCost',
      fieldLabel: 'Unit Cost Price (₹)',
      required: true,
      minValue: 0.01,
      preset: 'positive_number',
      errorMessage: 'Unit cost price must be greater than 0',
      enabled: true
    },
    {
      id: 'i-7',
      fieldKey: 'supplier',
      fieldLabel: 'Primary Supplier Vendor',
      required: true,
      minLength: 2,
      preset: 'none',
      errorMessage: 'Supplier vendor name is required',
      enabled: true
    }
  ],
  staffMember: [
    {
      id: 's-1',
      fieldKey: 'name',
      fieldLabel: 'Staff Full Name',
      required: true,
      minLength: 2,
      preset: 'none',
      errorMessage: 'Staff full name is required',
      enabled: true
    },
    {
      id: 's-2',
      fieldKey: 'role',
      fieldLabel: 'Designation / Role',
      required: true,
      preset: 'none',
      errorMessage: 'Staff role is required',
      enabled: true
    },
    {
      id: 's-3',
      fieldKey: 'department',
      fieldLabel: 'Department',
      required: true,
      preset: 'none',
      errorMessage: 'Department selection is required',
      enabled: true
    },
    {
      id: 's-4',
      fieldKey: 'phone',
      fieldLabel: 'Mobile Phone Number',
      required: true,
      preset: 'phone_intl',
      errorMessage: 'Valid contact phone number is required',
      enabled: true
    },
    {
      id: 's-5',
      fieldKey: 'email',
      fieldLabel: 'Official / Personal Email',
      required: true,
      preset: 'email',
      errorMessage: 'Valid email address is required',
      enabled: true
    }
  ]
};

const STORAGE_KEY = 'the_grand_azure_field_validations_v1';

/**
 * Load system validation rules from localStorage or fallback to defaults
 */
export function loadValidationRules(): SystemValidationConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults to ensure any new entity/field is never missing
      return {
        guestCheckIn: parsed.guestCheckIn || DEFAULT_VALIDATION_RULES.guestCheckIn,
        reservation: parsed.reservation || DEFAULT_VALIDATION_RULES.reservation,
        hotelProfile: parsed.hotelProfile || DEFAULT_VALIDATION_RULES.hotelProfile,
        inventorySku: parsed.inventorySku || DEFAULT_VALIDATION_RULES.inventorySku,
        staffMember: parsed.staffMember || DEFAULT_VALIDATION_RULES.staffMember
      };
    }
  } catch (err) {
    console.warn('[ValidationEngine] Failed to parse custom validation rules from storage, using defaults', err);
  }
  return JSON.parse(JSON.stringify(DEFAULT_VALIDATION_RULES));
}

/**
 * Save custom validation rules to localStorage and dispatch event for live reactivity
 */
export function saveValidationRules(config: SystemValidationConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('hms_validation_rules_updated', { detail: config }));
  } catch (err) {
    console.error('[ValidationEngine] Failed to save validation rules to storage', err);
  }
}

/**
 * Reset all validation rules to system defaults
 */
export function resetValidationRulesToDefaults(): SystemValidationConfig {
  const fresh = JSON.parse(JSON.stringify(DEFAULT_VALIDATION_RULES));
  saveValidationRules(fresh);
  return fresh;
}

/**
 * Test a value against a specific validation rule
 */
export function testRuleValue(rule: FieldValidationRule, rawValue: any): { isValid: boolean; error?: string } {
  if (!rule.enabled) {
    return { isValid: true };
  }

  const strVal = rawValue !== undefined && rawValue !== null ? String(rawValue).trim() : '';

  // Required Check
  if (rule.required && !strVal) {
    return { isValid: false, error: rule.errorMessage || `${rule.fieldLabel} is required` };
  }

  // If not required and empty, skip format validation
  if (!rule.required && !strVal) {
    return { isValid: true };
  }

  // Min / Max Length check
  if (rule.minLength !== undefined && strVal.length < rule.minLength) {
    return { 
      isValid: false, 
      error: rule.errorMessage || `${rule.fieldLabel} must be at least ${rule.minLength} characters` 
    };
  }

  if (rule.maxLength !== undefined && strVal.length > rule.maxLength) {
    return { 
      isValid: false, 
      error: rule.errorMessage || `${rule.fieldLabel} cannot exceed ${rule.maxLength} characters` 
    };
  }

  // Min / Max Numeric Value check
  if (rule.minValue !== undefined || rule.maxValue !== undefined) {
    const num = Number(strVal);
    if (isNaN(num)) {
      return { isValid: false, error: `${rule.fieldLabel} must be a valid number` };
    }
    if (rule.minValue !== undefined && num < rule.minValue) {
      return { 
        isValid: false, 
        error: rule.errorMessage || `${rule.fieldLabel} cannot be less than ${rule.minValue}` 
      };
    }
    if (rule.maxValue !== undefined && num > rule.maxValue) {
      return { 
        isValid: false, 
        error: rule.errorMessage || `${rule.fieldLabel} cannot exceed ${rule.maxValue}` 
      };
    }
  }

  // Regex Preset / Custom Format check
  if (rule.preset === 'custom' && rule.customRegex) {
    try {
      const reg = new RegExp(rule.customRegex);
      if (!reg.test(strVal)) {
        return { isValid: false, error: rule.errorMessage || `${rule.fieldLabel} format is invalid` };
      }
    } catch {
      console.warn('[ValidationEngine] Invalid custom regex:', rule.customRegex);
    }
  } else if (rule.preset !== 'none' && rule.preset !== 'custom') {
    const preset = PRESET_PATTERNS[rule.preset];
    if (preset && preset.regex && !preset.regex.test(strVal)) {
      return { isValid: false, error: rule.errorMessage || `${rule.fieldLabel} does not match required format` };
    }
  }

  return { isValid: true };
}

/**
 * Validate an entire form data object for an entity
 */
export function validateEntityForm(
  entity: EntityKey, 
  formData: Record<string, any>, 
  customConfig?: SystemValidationConfig
): { isValid: boolean; errors: Record<string, string> } {
  const config = customConfig || loadValidationRules();
  const rules = config[entity] || [];
  const errors: Record<string, string> = {};

  for (const rule of rules) {
    if (!rule.enabled) continue;
    const value = formData[rule.fieldKey];
    const res = testRuleValue(rule, value);
    if (!res.isValid && res.error) {
      errors[rule.fieldKey] = res.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
