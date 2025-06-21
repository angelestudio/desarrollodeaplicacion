// src/composables/validateUser.ts
import validators from './utils/validators';

export function validateUser(user: {
  firstName: string;
  lastName: string;
  role: string;    // Asegúrate de que coincide con la propiedad que usas en el formulario
  phone: string;
  email: string;
  password: string;
}) {
  const errors: string[] = [];

  if (!user.firstName || !user.firstName.trim()) {
    errors.push('First Name: Este campo no puede estar vacío');
  }
  if (!user.lastName || !user.lastName.trim()) {
    errors.push('Last Name: Este campo no puede estar vacío');
  }
  if (!user.role || !user.role.trim()) {
    errors.push('Role: Este campo no puede estar vacío');
  }
  if (!user.phone || !user.phone.trim()) {
    errors.push('Phone: Este campo no puede estar vacío');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.email || !emailRegex.test(user.email.trim())) {
    errors.push('Email: Debe ingresar un email válido');
  }
  if (!user.password || !user.password.trim()) {
    errors.push('Password: Este campo no puede estar vacío');
  }

  // Ejemplo de validación adicional usando validators:
  // if (!validators.isPhoneValid(user.phone)) {
  //   errors.push('Phone: Formato inválido');
  // }

  return errors;
}
