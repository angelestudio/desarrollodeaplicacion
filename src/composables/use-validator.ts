import { ref } from 'vue'
import validators from './utils/validators'

type ValidatorKey = keyof typeof validators

interface Validations {
  [key: string]: {
    validations: ValidatorKey[]
    messages?: { [key in ValidatorKey]?: string }
    values?: { [key in ValidatorKey]?: string | number }
  }
}

type Errors = { [key: string]: string[] }

const useValidator = (validations: Validations) => {
  const errors = ref<Errors>({})
  const hasErrors = ref(false)

  const initErrors = () => {
    Object.keys(validations).forEach((key) => {
      errors.value[key] = []
    })
  }
  initErrors()

  const validateField = ({ target }: Event, callback?: () => void) => {
    const input = target as HTMLInputElement
    const errorFound = executeValidations(input.name, input.value)
    input.setCustomValidity(errorFound)
    hasErrors.value = Object.values(errors.value).some((arr) => arr.length > 0)
    if (typeof callback === 'function') callback()
  }

  const handleSubmit = (event: Event, callback: () => void) => {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(event.target as HTMLFormElement))
    executeAllValidations(formData)
    hasErrors.value = Object.values(errors.value).some((arr) => arr.length > 0)
    if (typeof callback === 'function' && !hasErrors.value) callback()
  }

  const executeValidations = (fieldName: string, value: string): string => {
    let errorFound = ''
    errors.value[fieldName] = []
    const validationNode = validations[fieldName]

    validationNode.validations.forEach((key) => {
      const validator = validators[key]
      if (validator) {
        const error = (validator as (...args: any[]) => string | boolean)(
          key === 'min' || key === 'max'
            ? Number(value)
            : value,
          validationNode.values?.[key],
          validationNode.messages?.[key]
        )
        if (error) {
          errors.value[fieldName].push(error as string)
          errorFound = error as string
        }
      }
    })
    return errorFound
  }

  const executeAllValidations = (formData: { [key: string]: FormDataEntryValue }) => {
    Object.keys(formData).forEach((fieldName) => {
      executeValidations(fieldName, formData[fieldName].toString())
    })
  }

  return { validateField, handleSubmit, errors, hasErrors, validations }
}

export default useValidator