export default {
  required: (value: string, message?: string): boolean | string => {
    if (value && value.trim()) {
      return false
    }
    return message || `Este campo no puede estar vacío`
  },
  email: (value: string, message?: string): boolean | string => {
    // eslint-disable-next-line no-useless-escape
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      return false
    }
    return message || 'Debe ingresar un email válido'
  },
  min: (value: number, message?: string, minValue?: number): boolean | string => {
    if (value > (minValue as number)) {
      return false
    }
    return message || `El valor no puede ser menor que ${minValue}`
  },
  max: (value: number, message?: string, maxValue?: number): boolean | string => {
    if (value < (maxValue as number)) {
      return false
    }
    return message || `El valor no puede ser mayor que ${maxValue}`
  }
}
