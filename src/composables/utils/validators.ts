export type ValidatorFn = (...args: any[]) => boolean | string;

const validators = {
  required: (value: string, message?: string): boolean | string => {
    if (!value || !value.trim()) {
      return message || "Este campo no puede estar vacío";
    }
    return false;
  },
  email: (value: string, message?: string): boolean | string => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(value) ? false : message || "Debe ingresar un email válido";
  },
  min: (value: number, minValue: number, message?: string): boolean | string => {
    return value >= minValue ? false : message || `El valor no puede ser menor que ${minValue}`;
  },
  max: (value: number, maxValue: number, message?: string): boolean | string => {
    return value <= maxValue ? false : message || `El valor no puede ser mayor que ${maxValue}`;
  }
} as const;

export default validators;