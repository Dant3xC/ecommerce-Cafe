document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');

    // Función para cerrar sesión
    function logout() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }

    // Comprobar si el usuario está logueado
    const token = localStorage.getItem('token');
    if (token) {
        const logoutButton = document.createElement('button');
        logoutButton.id = 'logout-button';
        logoutButton.className = 'auth-button';
        logoutButton.textContent = 'Logout';
        logoutButton.addEventListener('click', logout);
        authContainer.innerHTML = '';
        authContainer.appendChild(logoutButton);
    } else {
        authContainer.innerHTML = `<a href="login.html" class="auth-button">Login</a>`;
    }

    // Cambiar entre vistas de login y registro
    document.querySelectorAll('.login-navigation li').forEach(navItem => {
        navItem.addEventListener('click', function () {
            document.querySelectorAll('.lc-block').forEach(block => block.style.display = 'none');
            const targetBlock = document.querySelector(this.getAttribute('data-block'));
            if (targetBlock) {
                targetBlock.style.display = 'block';
            }
        });
    });

    document.getElementById('login-button').addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validar datos del formulario
        if (!username || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Login exitoso');
                localStorage.setItem('token', result.token);
                window.location.href = '../index.html';
            } else {
                alert(result.message || 'Error en el login');
            }
        } catch (error) {
            console.error('Error en la solicitud de login:', error);
            alert('Error en la solicitud de login');
        }
    });

    document.getElementById('register-button').addEventListener('click', async () => {
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const email = document.getElementById('reg-email').value;
        const documentNumber = document.getElementById('reg-document-number').value;
        const deliveryAddress = document.getElementById('reg-delivery-address').value;
        const deliveryCity = document.getElementById('reg-delivery-city').value;

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Validar datos del formulario
        if (!username || !password || !confirmPassword || !email || !documentNumber || !deliveryAddress || !deliveryCity) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        try {
            console.log('Enviando datos de registro:', { username, password });
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username, password, email, documentNumber, deliveryAddress, deliveryCity 
                })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Registro exitoso');
                // Cambiar a la vista de login
                document.querySelectorAll('.lc-block').forEach(block => block.style.display = 'none');
                document.querySelector('#l-login').style.display = 'block';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error en la solicitud de registro:', error);
            alert('Error en la solicitud de registro');
        }
    });
});
