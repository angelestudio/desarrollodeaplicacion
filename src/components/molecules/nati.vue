<template>
    <div class="container">
      <nav class="navbar">
        <div class="logo">TailGrids</div>
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
      <div class="content">
        <div class="text-content">
          <p class="explore-text">Explora nuestros clubes y encuentra el ideal para ti</p>
          <h1 class="welcome-title">¡Bienvenidos a SenaClub!</h1>
          <p class="description">Desde deportes hasta tecnología y finanzas, únete a una comunidad que comparte tus intereses.</p>
          <button class="explore-button">Explorar Clubes</button>
        </div>
        <div class="clients">
          <p class="clients-title">Some Of Our Clients</p>
          <div class="client-logos">
            <span>ORACLE</span>
            <span>intel</span>
            <span>logitech</span>
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="footer-links">
          <div class="links-column">
            <p class="column-title">Useful Links</p>
            <a href="#">Legal & Privacy</a>
            <a href="#">Contact</a>
            <a href="#">Gift Card</a>
            <a href="#">Customer Service</a>
            <a href="#">My Account</a>
          </div>
          <div class="links-column">
            <p class="column-title">Shop</p>
            <a href="#">Televisions</a>
            <a href="#">Washing Machines</a>
            <a href="#">Air Conditioners</a>
            <a href="#">Laptops</a>
            <a href="#">Accessories</a>
          </div>
          <div class="links-column">
            <p class="column-title">My Account</p>
            <a href="#">My Profile</a>
            <a href="#">My Order History</a>
            <a href="#">My Wish List</a>
            <a href="#">Order Tracking</a>
            <a href="#">Shopping Cart</a>
          </div>
          <div class="links-column">
            <p class="column-title">Company</p>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Our Blog</a>
            <a href="#">Affiliate</a>
            <a href="#">Contact Us</a>
          </div>
          <div class="links-column">
            <p class="column-title">Need Help? Call Us Now</p>
            <p>+99 0214 2542 223</p>
            <p>Monday - Friday: 9:00-20:00</p>
            <p>Saturday: 11:00-15:00</p>
            <div class="social-icons">
              <a>f</a>
              <a>in</a>
            </div>
          </div>
        </div>
        <div class="copyright">
          <p>Copyright © 2022 TailGrids. All Rights Reserved.</p>
          <div class="payment-methods">
            <span>We Accept:</span>
            <span>PayPal</span>
            <span>VISA</span>
            <span>DISCOVER</span>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <style scoped>
  /* Asegurar que todo ocupe la pantalla completa */
  html, body, .container {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  
  /* Configurar el contenedor principal */
  .container {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Mínimo toda la altura de la pantalla */
    width: 100vw;
    background-color: black; /* Fondo negro */
    color: white; /* Letras blancas */
  }
  
  /* Barra de navegación */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #111; /* Fondo oscuro */
  }
  
  /* Logo */
  .logo {
    font-size: 1.5em;
    font-weight: bold;
    color: white;
  }
  
  /* Menú */
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
  
  /* Botón de Sign Up */
  .signup-button {
    background-color: #6a5acd; /* Morado */
    color: white;
    padding: 8px 15px;
    border-radius: 5px;
  }
  
  /* Contenido principal */
  .content {
    display: flex;
    flex: 1; /* Hace que ocupe el espacio restante */
    justify-content: space-between;
    align-items: center;
    padding: 50px;
  }
  
  /* Sección de bienvenida */
  .text-content {
    max-width: 400px;
  }
  
  .explore-text {
    font-size: 1.1em;
    margin-bottom: 20px;
  }
  
  .welcome-title {
    font-size: 2.5em;
    color: #6a5acd; /* Morado */
    margin-bottom: 20px;
  }
  
  .description {
    font-size: 1em;
    margin-bottom: 30px;
  }
  
  /* Botón de explorar */
  .explore-button {
    padding: 12px 25px;
    font-size: 1em;
    background-color: #6a5acd;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  /* Sección de clientes */
  .clients {
    margin-top: 50px;
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
  
  /* Footer */
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
  
  /* Íconos sociales */
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
  
  /* Derechos de autor */
  .copyright {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #333;
    padding-top: 20px;
  }
  
  .payment-methods {
    display: flex;
    align-items: center;
  }
  
  .payment-methods span {
    margin-left: 10px;
  }
  </style>
  