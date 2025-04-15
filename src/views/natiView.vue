<template>
  <div class="flex flex-col items-center bg-zinc-900 text-white p-8 min-h-screen">
    <img src="@/assets/logo.png" alt="Logo" class="w-24 mb-4" />
    <h1 class="text-2xl font-bold mb-6">Create an account</h1>

    <form class="w-full max-w-md space-y-4" @submit.prevent="handleClick">
      <!-- Nombre y Apellido -->
      <div class="flex gap-4">
        <div class="flex-1">
          <miTextInputAtom
            v-model="formData.firstName"
            label="First Name"
            placeholder="Enter your first name"
            type="text"
            required
          />
        </div>
        <div class="flex-1">
          <miTextInputAtom
            v-model="formData.lastName"
            label="Last Name"
            placeholder="Enter your last name"
            type="text"
            required
          />
        </div>
      </div>

      <!-- Rol y Teléfono -->
      <div class="flex gap-4">
        <div class="flex-1">
          <miTextInputAtom
            v-model="formData.role"
            label="Role"
            placeholder="Your Role"
            type="text"
            required
          />
        </div>
        <div class="flex-1">
          <miTextInputAtom
            v-model="formData.phone"
            label="Phone"
            placeholder="Your phone number"
            type="tel"
            required
          />
        </div>
      </div>

      <!-- Email -->
      <miTextInputAtom
        v-model="formData.email"
        label="Email"
        placeholder="Enter your email"
        type="email"
        required
      />

      <!-- Contraseña y Confirmación -->
      <miTextInputAtom
        v-model="formData.password"
        label="Password"
        placeholder="Enter your password"
        type="password"
        required
      />
      <miTextInputAtom
        v-model="formData.confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        type="password"
        required
      />

      <!-- Clubs (campo opcional) -->
      <miTextInputAtom
        v-model="formData.clubs"
        label="Clubs"
        placeholder="Ingresa tus clubs separados por coma (opcional)"
        type="text"
      />

      <!-- Botón de Registro -->
      <div class="mt-4">
        <miButtonAtom
          @on-click="handleClick"
          class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-full"
        >
          Registrarse
        </miButtonAtom>
      </div>

      <!-- Redirección a login -->
      <p class="text-center text-zinc-400 mt-4">
        Already have an account?
        <RouterLink to="/acceder" class="text-purple-400 hover:underline">
          Log in here
        </RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/milogin';
import miTextInputAtom from '@/components/atoms/miTextInputAtom.vue';
import miButtonAtom from '@/components/atoms/miButtonAtom.vue';
import { validateUser } from '@/composables/validateUser';

const router = useRouter();
const login = useLoginStore();

const formData = reactive({
  firstName: '',
  lastName: '',
  role: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  // Campo opcional para clubs; se espera una cadena de texto
  clubs: '',
});

const handleClick = async () => {
  // Verifica que las contraseñas coincidan
  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  // Validar otros campos (no se valida clubs porque es opcional)
  const errors = validateUser(formData);
  if (errors.length > 0) {
    alert(errors.join('\n'));
    return;
  }

  // Convertimos el campo clubs (si tiene valor) a un arreglo, de lo contrario, un arreglo vacío
  const clubsArray = formData.clubs
    ? formData.clubs.split(',').map((club: string) => club.trim()).filter((c: string) => c)
    : [];

  // Preparar objeto para enviar (omitimos confirmPassword)
  const newUser = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    role: formData.role,
    phone: formData.phone,
    email: formData.email,
    password: formData.password,
    clubs: clubsArray,
  };

  try {
    console.log('Enviando datos al servidor:', newUser);
    const response = await login.registerUser(newUser);
    console.log('Usuario registrado con éxito:', response);
    router.push('/acceder');
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    alert('Error registrando usuario, revisa la consola para más detalles.');
  }
};
</script>