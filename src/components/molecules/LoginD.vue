<script setup lang="ts">
  import CBButton from '../atoms/CBButton.vue'
  import CBInput from '../atoms/CBInput.vue';
  import { loginStore } from '@/stores/login';
  import { reactive } from 'vue';

  const login = loginStore();
  const formData =reactive({username: '',  pass:''})
  
  const handleClick = () => {
    login.validateUser(formData.username, formData.pass);
  
}
</script>

  
  <style scoped>
  .registration-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: black;
    padding: 13rem;
    min-height: 100vh;
    color: white;


  }

  .footer-text{
    margin-top: 1rem;
    text-align: center;
    color:#9ca3af;
  }

  .footer-text a {
    color: #c084fc
  }

  .registration-form {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin-top: 20px;
  }
  </style>

  
<template>
    <div class="registration-container">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
  <h1>Create an account</h1>
  <div class="registration-form">
    <div class="w-full max-w-[400px] margin-bottom: 15px">
    <CBInput 
      id="email"
      label="Email"
      type="email"
      v-model="formData.username"
      placeholder="Enter your email"
      required
      variant="outlined"
    />
    <CBInput
      id="password"
      label="Password"
      type="password"
      v-model="formData.pass"
      placeholder="Enter your password"
      required
      variant="outlined"
    />
    <CBInput
        id="confirm-password"
        label="Confirm your password"
        type="password"
        placeholder="Confirm your password"
        required
        variant="outlined"
      />
      </div>
    </div>

    <div class="flex justify-center mt-4 w-full max-w-[400px]">
    <CBButton
      @on-click="handleClick"
      label="register"
      variant="filled"
      class-name="w-full mt-4"
      ></CBButton>
    </div>
    <div class="footer-text">
    Already have an account?
    <a class="footer-text a">log in here</a>
    </div>
  </div>
 
</template>