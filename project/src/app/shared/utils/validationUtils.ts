/**
 * Utilidades para validaciones comunes
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valida un campo según las reglas proporcionadas
 * @param value - Valor a validar
 * @param rules - Reglas de validación
 * @param fieldName - Nombre del campo para mensajes de error
 * @returns Resultado de la validación
 */
export const validateField = (
  value: any,
  rules: ValidationRule,
  fieldName: string
): ValidationResult => {
  const errors: string[] = [];

  // Validación requerida
  if (rules.required) {
    if (value === null || value === undefined || value === '') {
      errors.push(`${fieldName} es requerido`);
      return { isValid: false, errors };
    }
  }

  // Si el valor está vacío y no es requerido, es válido
  if (!value || value === '') {
    return { isValid: true, errors: [] };
  }

  // Validación de longitud mínima
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`${fieldName} debe tener al menos ${rules.minLength} caracteres`);
  }

  // Validación de longitud máxima
  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`${fieldName} no puede tener más de ${rules.maxLength} caracteres`);
  }

  // Validación de patrón
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push(`${fieldName} no tiene el formato correcto`);
  }

  // Validación personalizada
  if (rules.custom) {
    const customResult = rules.custom(value);
    if (typeof customResult === 'string') {
      errors.push(customResult);
    } else if (!customResult) {
      errors.push(`${fieldName} no es válido`);
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Valida un objeto completo con reglas
 * @param data - Objeto a validar
 * @param rules - Reglas para cada campo
 * @returns Resultado de la validación
 */
export const validateObject = (
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationResult => {
  const allErrors: string[] = [];
  let isValid = true;

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const result = validateField(data[fieldName], fieldRules, fieldName);
    if (!result.isValid) {
      isValid = false;
      allErrors.push(...result.errors);
    }
  }

  return { isValid, errors: allErrors };
};

/**
 * Reglas de validación comunes
 */
export const CommonValidationRules = {
  required: { required: true },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => value.includes('@') || 'Debe ser un email válido'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    custom: (value: string) => {
      const hasLower = /[a-z]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      
      if (!hasLower) return 'Debe contener al menos una letra minúscula';
      if (!hasUpper) return 'Debe contener al menos una letra mayúscula';
      if (!hasNumber) return 'Debe contener al menos un número';
      return true;
    }
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    custom: (value: string) => {
      const cleanValue = value.replace(/\D/g, '');
      return cleanValue.length >= 10 || 'Debe tener al menos 10 dígitos';
    }
  },
  url: {
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => value.startsWith('http') || 'Debe comenzar con http:// o https://'
  },
  positiveNumber: {
    custom: (value: number) => value > 0 || 'Debe ser un número positivo'
  },
  nonNegativeNumber: {
    custom: (value: number) => value >= 0 || 'No puede ser negativo'
  },
  maxFileSize: (maxSizeInMB: number) => ({
    custom: (file: File) => {
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      return file.size <= maxSizeInBytes || `El archivo no puede ser mayor a ${maxSizeInMB}MB`;
    }
  })
};

/**
 * Valida un email
 * @param email - Email a validar
 * @returns true si es válido
 */
export const isValidEmail = (email: string): boolean => {
  return CommonValidationRules.email.pattern!.test(email);
};

/**
 * Valida una URL
 * @param url - URL a validar
 * @returns true si es válida
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida un número de teléfono
 * @param phone - Teléfono a validar
 * @returns true si es válido
 */
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

/**
 * Valida un nombre (sin números ni caracteres especiales)
 * @param name - Nombre a validar
 * @returns true si es válido
 */
export const isValidName = (name: string): boolean => {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
};

/**
 * Sanitiza un string removiendo caracteres peligrosos
 * @param input - String a sanitizar
 * @returns String sanitizado
 */
export const sanitizeString = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

/**
 * Valida que un string no contenga HTML o scripts
 * @param input - String a validar
 * @returns true si es seguro
 */
export const isSafeString = (input: string): boolean => {
  const sanitized = sanitizeString(input);
  return sanitized === input;
};

/**
 * Valida un formulario completo
 * @param formData - Datos del formulario
 * @param validationSchema - Esquema de validación
 * @returns Resultado de la validación
 */
export const validateForm = (
  formData: Record<string, any>,
  validationSchema: Record<string, ValidationRule>
): ValidationResult => {
  return validateObject(formData, validationSchema);
};

/**
 * Obtiene el primer error de validación
 * @param result - Resultado de validación
 * @returns Primer error o null
 */
export const getFirstError = (result: ValidationResult): string | null => {
  return result.errors.length > 0 ? result.errors[0] : null;
};

/**
 * Valida que un array no esté vacío
 * @param array - Array a validar
 * @param fieldName - Nombre del campo
 * @returns Resultado de la validación
 */
export const validateNonEmptyArray = (array: any[], fieldName: string): ValidationResult => {
  if (!Array.isArray(array)) {
    return { isValid: false, errors: [`${fieldName} debe ser un array`] };
  }
  
  if (array.length === 0) {
    return { isValid: false, errors: [`${fieldName} no puede estar vacío`] };
  }
  
  return { isValid: true, errors: [] };
};
