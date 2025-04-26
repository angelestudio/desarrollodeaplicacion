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
        <router-link to="/signin">Sign In</router-link>
        <router-link to="/signup" class="signup-button">Sign Up</router-link>
      </div>
    </nav>
    <div class="content">
      <div class="text-content">
        <p class="explore-text">Explora nuestros clubes y encuentra el ideal para ti</p>
        <h1 class="welcome-title">¡Bienvenidos a SenaClub!</h1>
        <p class="description">Desde deportes hasta tecnología y finanzas, únete a una comunidad que comparte tus intereses.</p>
        <h1 class="welcome-subtitle">Explorar Clubes</h1>
      </div>
      <div class="clients">
        <div class="client-logos">
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
  <div class="w-1/2 flex justify-center items-center bg-white">
      <img src="@/assets/user.png.png" alt="Illustration" class="w-2/3" />
    </div>
</template>

<style>
/* Estilos para la aplicación principal */
#app {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  position: relative;
}

/* Aplicamos estilos globales para resetear margins y paddings */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  position: relative;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #111;
  color: white;
  overflow-x: hidden;
  position: relative;
  left: 0;
  right: 0;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  background-color: #111;
  width: 100%;
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
  padding: 50px 5%;
  width: 100%;
}

.text-content {
  max-width: 500px;
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
  padding: 50px 5%;
  width: 100%;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}

.links-column {
  flex: 1;
  min-width: 150px; /* Reducido de 200px para evitar desbordamiento */
  margin-bottom: 20px;
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
  margin-top: 10px;
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

/* Media queries para responsividad */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }
  
  .text-content {
    max-width: 100%;
    margin-bottom: 30px;
  }
  
  .footer-links {
    flex-direction: column;
  }
  
  .links-column {
    margin-bottom: 30px;
  }
  
  .navbar {
    padding: 15px 3%;
    flex-wrap: wrap;
  }
  
  .nav-links, .auth-links {
    margin-top: 10px;
  }
}
body, html, #app, .container {
  max-width: 100%;
  overflow-x: hidden !important;
  position: relative;
  margin: 0 !important;
  padding: 0 !important;
}


.container > * {
  max-width: 100%;
  overflow-x: hidden;
}

@media (max-width: 480px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .nav-links, .auth-links {
    flex-direction: column;
    width: 100%;
  }
  
  .nav-links a, .auth-links a {
    margin: 5px 0;
  }
}
</style>