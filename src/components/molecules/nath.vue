<template>
  <div class="flex h-screen">
    <div class="w-1/2 bg-black text-white flex flex-col justify-center items-center px-10">
      <div class="text-center w-3/4">
        <img src="./logo.png" alt="Logo" class="w-12 mb-6 mx-auto" />
        <h2 class="text-2xl font-bold mb-6">Sign in to your account</h2>
        <div class="mb-4 text-left">
          <label for="email" class="block font-semibold mb-1">Email address</label>
          <input type="email" id="email" placeholder="Enter your email" 
            class="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800 text-white" />
        </div>
        <div class="mb-6 text-left">
          <label for="password" class="block font-semibold mb-1">Password</label>
          <input type="password" id="password" placeholder="Enter your password" 
            class="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800 text-white" />
          <a href="#" class="text-indigo-400 text-sm block text-right mt-2">Forgot password?</a>
        </div>
        <button class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 rounded">Sign in</button>
        <p class="text-center mt-4 text-gray-400">
          Not a member? <a href="#" class="text-indigo-400 font-semibold">Start here</a>
        </p>
      </div>
    </div>
    <div class="w-1/2 flex justify-center items-center bg-gray-100">
      <div class="w-3/4 h-3/4 bg-gray-300"></div>
    </div>
  </div>
</template>

<style scoped>
</style>