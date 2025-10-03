<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" :class="theme === 'light' ? 'bg-gradient-to-br from-green-50 via-white to-green-50' : 'bg-gradient-to-br from-black via-gray-900 to-black'">
    
    <!-- Efectos de fondo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-full blur-3xl floating-animation"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-green-400/20 rounded-full blur-3xl floating-animation-delayed"></div>
      
      <!-- Partículas flotantes -->
      <div v-for="i in 15" :key="i" class="particle" 
           :style="{
               left: Math.random() * 100 + '%',
               animationDelay: Math.random() * 8 + 's',
               animationDuration: (8 + Math.random() * 4) + 's'
           }"></div>
    </div>

    <!-- Toggle de tema -->
    <button
      @click="themeStore.toggleTheme()"
      class="fixed top-6 right-6 w-12 h-12 rounded-full glass-effect flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 shadow-lg"
    >
      <svg v-if="theme === 'light'" class="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
      </svg>
      <svg v-else class="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
      </svg>
    </button>

    
    <!-- Contenedor principal optimizado para pantalla completa -->
    <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
      
      <!-- Sección izquierda - Información -->
      <div class="text-center lg:text-left space-y-8">
        <div class="relative">
          <div class="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-10 shadow-2xl floating-animation glow-effect-green">
            <svg class="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse flex items-center justify-center">
            <div class="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div class="space-y-6">
          <h1 class="text-6xl lg:text-8xl font-black bg-gradient-to-br from-green-600 to-green-800 bg-clip-text text-transparent leading-tight tracking-tight">
            Únete a<br>Nosotros
          </h1>
          <p class="text-xl lg:text-2xl font-light leading-relaxed" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-200'">
            Descubre una nueva forma de <span class="font-bold text-green-600">aprender</span> y <span class="font-bold text-green-700">conectar</span>
          </p>
        </div>
        
        <div class="hidden lg:block space-y-6 pt-8">
          <div class="flex items-center space-x-4 group">
            <div class="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full group-hover:scale-125 transition-transform duration-300 shadow-lg"></div>
            <span class="text-lg font-medium transition-colors duration-300" :class="theme === 'light' ? 'text-gray-800 group-hover:text-green-700' : 'text-gray-200 group-hover:text-green-400'">Acceso a múltiples clubs especializados</span>
          </div>
          <div class="flex items-center space-x-4 group">
            <div class="w-4 h-4 bg-gradient-to-r from-green-600 to-green-700 rounded-full group-hover:scale-125 transition-transform duration-300 shadow-lg"></div>
            <span class="text-lg font-medium transition-colors duration-300" :class="theme === 'light' ? 'text-gray-800 group-hover:text-green-700' : 'text-gray-200 group-hover:text-green-400'">Comunidad activa de aprendizaje</span>
          </div>
          <div class="flex items-center space-x-4 group">
            <div class="w-4 h-4 bg-gradient-to-r from-green-500 to-green-700 rounded-full group-hover:scale-125 transition-transform duration-300 shadow-lg"></div>
            <span class="text-lg font-medium transition-colors duration-300" :class="theme === 'light' ? 'text-gray-800 group-hover:text-green-700' : 'text-gray-200 group-hover:text-green-400'">Herramientas educativas avanzadas</span>
          </div>
          <div class="flex items-center space-x-4 group">
            <div class="w-4 h-4 bg-gradient-to-r from-green-600 to-green-800 rounded-full group-hover:scale-125 transition-transform duration-300 shadow-lg"></div>
            <span class="text-lg font-medium transition-colors duration-300" :class="theme === 'light' ? 'text-gray-800 group-hover:text-green-700' : 'text-gray-200 group-hover:text-green-400'">Eventos y competencias exclusivas</span>
          </div>
        </div>

        <!-- Stats decorativas -->
        <div class="hidden lg:flex items-center space-x-8 pt-8">
          <div class="text-center glass-effect rounded-xl p-4 hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">5K+</div>
            <div class="text-sm" :class="theme === 'light' ? 'text-gray-500' : 'text-gray-400'">Miembros</div>
          </div>
          <div class="text-center glass-effect rounded-xl p-4 hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">12</div>
            <div class="text-sm" :class="theme === 'light' ? 'text-gray-500' : 'text-gray-400'">Clubs</div>
          </div>
          <div class="text-center glass-effect rounded-xl p-4 hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">98%</div>
            <div class="text-sm" :class="theme === 'light' ? 'text-gray-500' : 'text-gray-400'">Satisfacción</div>
          </div>
        </div>
      </div>

      <!-- Sección derecha - Formulario -->
      <div class="relative">
        <div class="glass-effect-elegant rounded-3xl shadow-2xl p-10 border relative overflow-hidden" 
             :class="theme === 'light' ? 'border-green-200/30' : 'border-green-800/30'">
          
          <!-- Efecto shimmer -->
          <div class="absolute inset-0 shimmer-green opacity-20 pointer-events-none"></div>
          
          <div class="relative z-10">
            <div class="text-center mb-10">
              <h2 class="text-4xl font-black mb-3" :class="theme === 'light' ? 'text-gray-900' : 'text-white'">
                Crear Cuenta
              </h2>
              <p class="text-base font-medium" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
                Completa todos los campos para comenzar
              </p>
            </div>
            
            <form @submit.prevent="initiateVerification" class="space-y-8">
              <!-- Nombre y apellido -->
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-3">
                  <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                    Nombre
                  </label>
                  <input 
                    id="firstName" 
                    v-model="form.firstName" 
                    placeholder="Tu nombre" 
                    required
                    class="input-elegant-green"
                    :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                  />
                </div>
                <div class="space-y-3">
                  <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                    Apellido
                  </label>
                  <input 
                    id="lastName" 
                    v-model="form.lastName" 
                    placeholder="Tu apellido" 
                    required
                    class="input-elegant-green"
                    :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                  />
                </div>
              </div>

              <!-- Selector de Rol -->
              <div class="space-y-3">
                <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                  Tipo de Cuenta
                </label>
                <div class="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    @click="selectedRole = 'user'"
                    class="px-6 py-4 rounded-2xl border-2 font-bold transition-all duration-300 hover:scale-105"
                    :class="selectedRole === 'user' 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-600 shadow-xl glow-effect-green' 
                      : (theme === 'light' ? 'border-gray-300 text-gray-700 hover:border-green-400' : 'border-gray-600 text-gray-300 hover:border-green-500')"
                  >
                    👤 Aprendiz
                  </button>
                  <button
                    type="button"
                    @click="selectedRole = 'admin'"
                    class="px-6 py-4 rounded-2xl border-2 font-bold transition-all duration-300 hover:scale-105"
                    :class="selectedRole === 'admin' 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-600 shadow-xl glow-effect-green' 
                      : (theme === 'light' ? 'border-gray-300 text-gray-700 hover:border-green-400' : 'border-gray-600 text-gray-300 hover:border-green-500')"
                  >
                    🔑 Admin
                  </button>
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-3">
                <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                  Email
                </label>
                <input 
                  id="email" 
                  type="email" 
                  v-model="form.email" 
                  placeholder="tu@gmail.com" 
                  required
                  class="input-elegant-green"
                  :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                />
              </div>

              <!-- Código admin -->
              <div v-if="isAdmin" class="animate-slideDown space-y-3">
                <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                  Código de Administrador
                </label>
                <input 
                  id="adminCode" 
                  v-model="form.adminCode" 
                  type="password"
                  placeholder="Código secreto" 
                  required
                  class="input-elegant-green"
                  :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                />
              </div>

              <!-- Teléfono -->
              <div class="space-y-3">
                <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                  Teléfono
                </label>
                <input 
                  id="phone" 
                  v-model="form.phone" 
                  placeholder="3001234567" 
                  required
                  class="input-elegant-green"
                  :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                />
              </div>

              <!-- Contraseñas -->
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-3">
                  <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                    Contraseña
                  </label>
                  <div class="relative">
                    <input 
                      id="password" 
                      :type="showPassword ? 'text' : 'password'"
                      v-model="form.password" 
                      placeholder="••••••••" 
                      required
                      class="input-elegant-green pr-12"
                      :class="[
                        theme === 'light' ? 'input-light-green' : 'input-dark-green',
                        passwordValidation.isValid === false ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : '',
                        passwordValidation.isValid === true ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30' : ''
                      ]"
                      @input="validatePassword"
                    />
                    <button 
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                  <!-- Indicadores de validación de contraseña -->
                  <div v-if="form.password" class="space-y-1 text-xs">
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4" :class="passwordValidation.length ? 'text-green-500' : 'text-red-500'" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="passwordValidation.length" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                      <span :class="passwordValidation.length ? 'text-green-600' : 'text-red-600'">6-12 caracteres</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4" :class="passwordValidation.noSpaces ? 'text-green-500' : 'text-red-500'" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="passwordValidation.noSpaces" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                      <span :class="passwordValidation.noSpaces ? 'text-green-600' : 'text-red-600'">Sin espacios</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4" :class="passwordValidation.hasSpecial ? 'text-green-500' : 'text-red-500'" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="passwordValidation.hasSpecial" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                      <span :class="passwordValidation.hasSpecial ? 'text-green-600' : 'text-red-600'">Al menos 1 carácter especial</span>
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                    Confirmar
                  </label>
                  <div class="relative">
                    <input 
                      id="confirmPassword" 
                      :type="showConfirmPassword ? 'text' : 'password'"
                      v-model="form.confirmPassword" 
                      placeholder="••••••••" 
                      required
                      class="input-elegant-green pr-12"
                      :class="[
                        theme === 'light' ? 'input-light-green' : 'input-dark-green',
                        confirmPasswordValidation === false ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : '',
                        confirmPasswordValidation === true ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30' : ''
                      ]"
                      @input="validateConfirmPassword"
                    />
                    <button 
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                  <!-- Validación de confirmación -->
                  <div v-if="form.confirmPassword" class="text-xs">
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4" :class="confirmPasswordValidation ? 'text-green-500' : 'text-red-500'" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="confirmPasswordValidation" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                      <span :class="confirmPasswordValidation ? 'text-green-600' : 'text-red-600'">Las contraseñas coinciden</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botón de registro -->
              <div class="pt-8">
                <button 
                  type="submit"
                  :disabled="!isFormValid"
                  class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-xl glow-effect-green text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Crear Cuenta
                </button>
              </div>

              <!-- Link de login -->
              <div class="text-center pt-6">
                <p class="text-base font-medium" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
                  ¿Ya tienes cuenta?
                  <RouterLink to="/signin" class="text-green-600 hover:text-green-700 font-bold hover:underline ml-2 transition-colors duration-200">
                    Inicia sesión aquí
                  </RouterLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de verificación -->
    <div v-if="showVerificationModal" class="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"></div>
      <div class="relative glass-effect-elegant rounded-3xl shadow-2xl w-full max-w-md p-10 transform transition-all duration-300 scale-100 border"
           :class="theme === 'light' ? 'border-green-200/30' : 'border-green-800/30'">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-8 shadow-2xl glow-effect-green floating-animation">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-3xl font-black mb-4" :class="theme === 'light' ? 'text-gray-900' : 'text-white'">
            Verificación de Email
          </h3>
          <p class="text-base mb-8 leading-relaxed font-medium" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
            Hemos enviado un código a tu correo electrónico
          </p>
        </div>
        
        <div class="space-y-8">
          <div class="relative">
            <input 
              v-model="verificationInput" 
              type="text" 
              placeholder="000000" 
              maxlength="6"
              class="w-full px-6 py-5 rounded-2xl border-2 text-center text-3xl font-mono tracking-[0.5em] font-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500"
              :class="theme === 'light' ? 'border-green-200 bg-white/90 text-gray-900' : 'border-green-800 bg-gray-900/90 text-white'"
            />
            <div class="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-r from-green-500/10 to-green-600/10 opacity-50"></div>
          </div>
          
          <div class="flex gap-4">
            <button 
              @click="cancelVerification" 
              class="flex-1 px-8 py-4 rounded-2xl border-2 font-bold transition-all duration-300 hover:scale-105 text-base"
              :class="theme === 'light' ? 'border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400' : 'border-gray-600 text-gray-200 hover:bg-gray-800/50 hover:border-gray-500'"
            >
              Cancelar
            </button>
            <button 
              @click="verifyCode" 
              class="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold transition-all duration-300 hover:scale-105 shadow-xl glow-effect-green text-base"
            >
              Verificar
            </button>
          </div>
          
          <div class="text-center">
            <p class="text-sm font-medium" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
              ¿No recibiste el código? 
              <button class="text-green-600 hover:text-green-700 font-bold ml-1 transition-colors duration-200 hover:underline">
                Reenviar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast, type Content } from 'vue3-toastify'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'
import router from '@/router'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

interface SignupForm {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  adminCode?: string
}

const form = ref<SignupForm>({
  firstName: '', lastName: '', phone: '',
  email: '', password: '', confirmPassword: '', adminCode: ''
})

// Estados de validación de contraseña
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordValidation = ref({
  length: false,
  noSpaces: false,
  hasSpecial: false,
  isValid: null as boolean | null
})
const confirmPasswordValidation = ref<boolean | null>(null)

// Nuevo: selector manual de rol
const selectedRole = ref<'user' | 'admin'>('user')

const isAdmin = computed(() => {
  return selectedRole.value === 'admin'
})

const selectedClubs = ref<string[]>([]) 

const isFormValid = computed(() => {
  return form.value.firstName &&
         form.value.lastName &&
         form.value.email &&
         form.value.phone &&
         form.value.password &&
         form.value.confirmPassword &&
         passwordValidation.value.isValid &&
         confirmPasswordValidation.value &&
         (!isAdmin.value || form.value.adminCode)
})

const validatePassword = () => {
  const password = form.value.password
  
  // Validar longitud (6-12 caracteres)
  passwordValidation.value.length = password.length >= 6 && password.length <= 12
  
  // Validar que no tenga espacios
  passwordValidation.value.noSpaces = !/\s/.test(password)
  
  // Validar que tenga al menos un carácter especial
  passwordValidation.value.hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(password)
  
  // Validación general
  passwordValidation.value.isValid = passwordValidation.value.length && 
                                   passwordValidation.value.noSpaces && 
                                   passwordValidation.value.hasSpecial
  
  // Revalidar confirmación si ya hay algo escrito
  if (form.value.confirmPassword) {
    validateConfirmPassword()
  }
}

const validateConfirmPassword = () => {
  if (form.value.confirmPassword) {
    confirmPasswordValidation.value = form.value.password === form.value.confirmPassword
  } else {
    confirmPasswordValidation.value = null
  }
}

// Modal y código
const showVerificationModal = ref(false)
const sentCode = ref('')
const verificationInput = ref('')

const initiateVerification = async () => {
  // Validaciones básicas
  if (!passwordValidation.value.isValid) { 
    toast.error('La contraseña no cumple con los requisitos'); 
    return 
  }
  
  if (!confirmPasswordValidation.value) { 
    toast.error('Las contraseñas no coinciden'); 
    return 
  }
  
  if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.value.email)) { 
    toast.error('Correo inválido'); 
    return 
  }
  
  if (!/^\d{10}$/.test(form.value.phone)) { 
    toast.error('Teléfono inválido'); 
    return 
  }
  
  // Validación de correo electrónico básica
  if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.value.email)) { 
    toast.error('Correo inválido'); 
    return 
  }

  if (isAdmin.value && !form.value.adminCode) {
    toast.error('Ingresa el código de administrador');
    return;
  }

  // Genera y envía código
  sentCode.value = Math.floor(100000 + Math.random()*900000).toString()
  try {
  await fetch('https://backend-senaclub-xtrt.onrender.com/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.value.email, code: sentCode.value })
    })
    showVerificationModal.value = true
  } catch {
    toast.error('Error al enviar el código de verificación')
  }
}

const cancelVerification = () => {
  showVerificationModal.value = false
  verificationInput.value = ''
}

const verifyCode = async () => {
  if (verificationInput.value === sentCode.value) {
    showVerificationModal.value = false
    await registerAprendiz()
  } else {
    toast.error('Código incorrecto')
  }
}

const registerAprendiz = async () => {
  try {
    const role = selectedRole.value === 'admin' ? 'admin' : 'user'

    const clubsSelected = Array.isArray(selectedClubs.value) ? selectedClubs.value : []
    const clubsFallback = clubsSelected.length ? clubsSelected : ['general']

    const payload: any = {
      firstName: form.value.firstName,
      lastName:  form.value.lastName,
      phone:     form.value.phone,
      email:     form.value.email,
      password:  form.value.password,
      role,
      rol: role,
      clubs: clubsFallback
    }

    if (selectedRole.value === 'admin' && form.value.adminCode) {
      payload.adminCode = form.value.adminCode
    }

    const res = await fetch('https://backend-senaclub-xtrt.onrender.com/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    // 👇 Ahora sí parseamos la respuesta
    const data = await res.json()
    console.log('[signup] response', data)
    console.log('[signup] res.ok', res.ok)

    if (!res.ok) {
      if (Array.isArray(data.message)) {
        data.message.forEach((m: Content) => toast.error(m))
      } else {
        toast.error(data.message || 'Error desconocido del servidor')
      }
      return
    }

    toast.success('Usuario creado correctamente')

    const token = data?.token ?? data?.accessToken ?? data?.access_token ?? data?.tokens?.access
    console.log('[signup] token found:', token)

    if (token) {
      localStorage.setItem('token', token)
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user))

      await router.push({ name: 'Home' })
      return
    }

    console.warn('[signup] no token returned by signup endpoint')
    toast.info('Cuenta creada. Por favor inicia sesión para continuar.')
    await router.push({ name: 'Signin' })
  } catch (error) {
    console.error('[signup] error:', error)
    toast.error('Error en el registro, intenta de nuevo más tarde')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.glass-effect {
  backdrop-filter: blur(25px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.dark .glass-effect {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-effect-elegant {
  backdrop-filter: blur(25px);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.dark .glass-effect-elegant {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.shimmer-green {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(34, 197, 94, 0.1),
    transparent
  );
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

.input-elegant-green {
  @apply w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 font-semibold text-base;
  transform: translateZ(0);
}

.input-elegant-green:focus {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(34, 197, 94, 0.25);
}

.input-light-green {
  @apply border-green-200 bg-white/90 text-gray-900 placeholder-gray-500;
}

.input-dark-green {
  @apply border-green-800 bg-gray-900/90 text-white placeholder-gray-400;
}

.club-tag-green {
  background: linear-gradient(135deg, #16a34a, #15803d);
  transform: translateZ(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.club-tag-green:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
}

.glow-effect-green {
  box-shadow: 0 0 40px rgba(34, 197, 94, 0.4);
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  border-radius: 50%;
  animation: particle-float 8s infinite linear;
}

.floating-animation {
  animation: float 6s ease-in-out infinite;
}

.floating-animation-delayed {
  animation: float 6s ease-in-out infinite;
  animation-delay: -3s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>