<script setup lang="ts">
import CBButton from '../atoms/CBButton.vue';
import CBInput from '../atoms/CBInput.vue';
import { loginStore } from '@/stores/login';
import { reactive } from 'vue';

const login = loginStore();
const formData = reactive({
  firstName: '',
  lastName: '',
  role: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const handleClick = () => {
  // Validate all fields before submission
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  // Call the login store to validate the user (you might need to adjust this based on your store logic)
  login.validateUser(formData.email, formData.password);
};
</script>

<style scoped>
.registration-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1a1a1a; /* Dark background as in the image */
  padding: 2rem;
  min-height: 100vh;
  color: white;
}

.logo {
  width: 100px; /* Adjust based on your logo size */
  margin-bottom: 1rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.registration-form {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Reduced gap to match the image */
  margin-top: 20px;
}

.input-row {
  display: flex;
  gap: 15px;
}

.input-row > div {
  flex: 1;
}

.footer-text {
  margin-top: 1rem;
  text-align: center;
  color: #9ca3af;
}

.footer-text a {
  color: #c084fc;
  text-decoration: none;
}

.footer-text a:hover {
  text-decoration: underline;
}

/* Style for the CBButton to match the purple button in the image */
:deep(.cb-button-filled) {
  background-color: #c084fc !important; /* Purple button */
  color: white !important;
  border-radius: 25px !important; /* Rounded button */
  padding: 0.75rem 0 !important;
  font-weight: bold;
}

/* Style for the CBInput to match the dark theme */
:deep(.cb-input-outlined) {
  background-color: #333 !important; /* Dark input background */
  border: 1px solid #555 !important; /* Dark border */
  color: white !important;
  border-radius: 5px !important;
}

:deep(.cb-input-outlined::placeholder) {
  color: #9ca3af !important; /* Placeholder color */
}

:deep(.cb-input-label) {
  color: white !important; /* Label color */
}
</style>

<template>
  <div class="registration-container">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />
    <h1>Create an account</h1>
    <div class="registration-form">
      <div class="input-row">
        <CBInput
          id="first-name"
          label="First Name"
          type="text"
          v-model="formData.firstName"
          placeholder="Enter your first name"
          required
          variant="outlined"
        />
        <CBInput
          id="last-name"
          label="Last Name"
          type="text"
          v-model="formData.lastName"
          placeholder="Enter your last name"
          required
          variant="outlined"
        />
      </div>
      <div class="input-row">
        <CBInput
          id="role"
          label="Role"
          type="text"
          v-model="formData.role"
          placeholder="Your Role"
          required
          variant="outlined"
        />
        <CBInput
          id="phone"
          label="Phone"
          type="tel"
          v-model="formData.phone"
          placeholder="Your phone number"
          required
          variant="outlined"
        />
      </div>
      <CBInput
        id="email"
        label="Email"
        type="email"
        v-model="formData.email"
        placeholder="Enter your email"
        required
        variant="outlined"
      />
      <CBInput
        id="password"
        label="Password"
        type="password"
        v-model="formData.password"
        placeholder="Enter your password"
        required
        variant="outlined"
      />
      <CBInput
        id="confirm-password"
        label="Confirm your password"
        type="password"
        v-model="formData.confirmPassword"
        placeholder="Confirm your password"
        required
        variant="outlined"
      />
      <div class="flex justify-center mt-4 w-full">
        <CBButton
          @on-click="handleClick"
          label="Register"
          variant="filled"
          class-name="w-full"
        />
      </div>
      <div class="footer-text">
        Already have an account?
        <a href="/login">Log in here</a>
      </div>
    </div>
  </div>
</template>