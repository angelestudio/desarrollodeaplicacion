<template>
  <div class="container">
    <nav class="navbar">
      <div class="logo">SENACLUB</div>
      <div class="nav-links">
        <a href="#">Clubs</a>
        <a href="#">News</a>
        <a href="#">SENA</a>
      </div>
      <div class="auth-links">
        <!-- Cambiamos los botones para usar router-link -->
        <router-link to="/signin">Sign In</router-link>
        <router-link to="/signup" class="signup-button">Sign Up</router-link>
      </div>
    </nav>
    <div class="content">
      <div class="text-content">
        <p class="explore-text">Explora nuestros clubes y encuentra el ideal para ti</p>
        <h1 class="welcome-title">¡Bienvenidos a SenaClub!</h1>
        <p class="description">Desde deportes hasta tecnología y finanzas, únete a una comunidad que comparte tus intereses.</p>
        <button class="explore-button">Explorar Clubes</button>
      </div>
      <div class="clients">
        <p class="clients-title">Clientes felices</p>
        <div class="client-logos">
          <span>Logo 1</span>
          <span>Logo 2</span>
          <span>Logo 3</span>
        </div>
      </div>
    </div>
    <footer class="footer">
      <div class="footer-links">
        <div class="links-column">
          <p class="column-title">Clubes populares</p>
          <a href="#">Futbol</a>
          <a href="#">Ingles</a>
          <a href="#">Danzas</a>
          <a href="#">Emprendimiento</a>
          <a href="#">Programacion</a>
        </div>
        <div class="links-column">
          <p class="column-title">Mi Cuenta</p>
          <a href="#">Mi perfil</a>
          <a href="#">Mis clubes</a>
          <a href="#">Seguidos</a>
          <a href="#">Noticias</a>
          <a href="#">Configuracion</a>
        </div>
        <div class="links-column">
          <p class="column-title">Plataforma</p>
          <a href="#">Sobre SenaClub</a>
          <a href="#">Como funciona</a>
          <a href="#">Eventos y retos</a>
          <a href="#">Contactanos</a>
          <a href="#">Bienestar</a>
        </div>
        <div class="links-column">
          <p class="column-title">Recursos Utiles</p>
          <a href="#">Biblioteca Virtual</a>
          <a href="#">Bolsa De Empleo Sena</a>
          <a href="#">Certificados en linea</a>
          <a href="#">Cursos recomendados</a>
          <a href="#">Calendario Academico</a>
        </div>
        <div class="links-column">
          <p class="column-title">Necesitas ayuda?</p>
          <p>Horario de atencion en linea</p>
          <p>Lunes a viernes 9:00a.m - 7:00p.m</p>
          <p>Sabados 8:00a.m - 1:00p.m</p>
          <div class="social-icons">
            <a>f</a>
            <a>in</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
html, body, .container {
  height: 100%;
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #111;
  color: white;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #111;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
  color: white;
}

.nav-links, .auth-links {
  display: flex;
}

.nav-links a, .auth-links a {
  color: white;
  text-decoration: none;
  margin-left: 20px;
}

.signup-button {
  background-color: #6a5acd;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
}

.content {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: flex-start;
  padding: 50px;
}

.text-content {
  max-width: 400px;
}

.explore-text {
  font-size: 1.1em;
  margin-bottom: 20px;
}

.welcome-title {
  font-size: 2.5em;
  color: #6a5acd;
  margin-bottom: 20px;
}

.description {
  font-size: 1em;
  margin-bottom: 30px;
}

.explore-button {
  padding: 12px 25px;
  font-size: 1em;
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.clients {
  max-width: 300px;
}

.clients-title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 20px;
}

.client-logos {
  display: flex;
  justify-content: space-around;
}

.footer {
  background-color: #111;
  padding: 50px;
}

.footer-links {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.links-column {
  flex: 1;
}

.column-title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 20px;
}

.links-column a {
  display: block;
  color: white;
  text-decoration: none;
  margin-bottom: 10px;
}

.social-icons {
  display: flex;
}

.social-icons a {
  display: inline-block;
  background-color: #6a5acd;
  color: white;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>