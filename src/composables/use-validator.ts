import { ref } from 'vue'
import validators from './utils/validators'

interface Validations {
  [key: string]: {
    validations: (keyof typeof validators)[]
    messages?: {
      [key: string]: string
    }
    values?: {
      [key: string]: string | number
    }
  }
}

type Errors = {
  [key: string]: string[]
}

const useValidator = (validations: Validations) => {
  const errors = ref<Errors>({})
  const hasErrors = ref(false)

  const initErrors = () => {
    Object.keys(validations).forEach((key) => {
      errors.value = { ...errors.value, [key]: [] }
    })
  }

  initErrors()

  const validateField = ({ target }: Event, callback?: () => void) => {
    const errorFound = executeValidations(
      (target as HTMLInputElement).name,
      (target as HTMLInputElement).value
    )

    // This line marks the field as invalid
    ;(target as HTMLInputElement).setCustomValidity(errorFound)
    hasErrors.value = Object.keys(errors.value).some((key) => errors.value[key].length)

    typeof callback === 'function' && callback()
  }

  const handleSubmit = (event: Event, callback: () => void) => {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(event.target as HTMLFormElement))
    executeAllValidations(formData)
    hasErrors.value = Object.keys(errors.value).some((key) => errors.value[key].length)
    typeof callback === 'function' && !hasErrors.value && callback()
  }

  const executeValidations = (fieldName: string, value: FormDataEntryValue): string => {
    let errorFound = ''
    errors.value[fieldName] = []
    const validationNode = validations[fieldName]
    validationNode.validations.forEach((key) => {
      const validator = validators[key]
      if (validator) {
        const error = validator(
          value as never,
          validationNode.messages?.[key],
          validationNode.values?.[key] as number
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
    Object.keys(formData).forEach((fieldName) => executeValidations(fieldName, formData[fieldName]))
  }

  return { validateField, handleSubmit, errors, hasErrors, validations }
}

export default useValidator
