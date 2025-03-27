<template>
  <div class="hero-section">
    <nav class="navbar">
      <div class="logo">SENACLUB</div>
      <div class="nav-links">
        <a href="#">Clubs</a>
        <a href="#">News</a>
        <a href="#">SENA</a>
      </div>
      <div class="auth-links">
        <a href="#">Sign In</a>
        <a href="#" class="signup-button">Sign Up</a>
      </div>
    </nav>
    <div class="hero-content">
      <h1 class="purple-title">¡Bienvenidos a SenaClub!</h1>
      <p class="description">Explora nuestros clubes y encuentra el ideal para ti. Desde deportes hasta tecnología y finanzas, únete a una comunidad que comparte tus intereses.</p>
      <button class="explore-button">Explorar Clubes</button>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: black;
  color: white;
  margin: 0;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
}

.nav-links,
.auth-links {
  display: flex;
}

.nav-links a,
.auth-links a {
  color: white;
  text-decoration: none;
  margin-left: 20px;
}

.signup-button {
  background-color: rgb(67, 9, 201); /* Fondo morado para el botón "Sign Up" */
  padding: 8px 15px; /* Ajusta el padding del botón */
  border-radius: 5px; /* Añade bordes redondeados */
}

.hero-content {
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: 50px;
  margin-top: 230px;
  padding: 0 20px;
}

.purple-title {
  font-size: 2.5em;
  color: rgb(78, 25, 201);
  margin-bottom: 20px;
  font-weight: 700;
}

.description {
  font-size: 1em;
  margin-bottom: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 5px;
}

.explore-button {
  padding: 12px 25px;
  font-size: 1em;
  background-color: transparent;
  color: white;
  border: 1px solid white;
  border-radius: 5px;
  cursor: pointer;
}
</style>