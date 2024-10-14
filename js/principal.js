window.addEventListener('load', function(){

    const btnLogout = this.document.getElementById('btnLogout')
    const btnCloseAlert = this.document.getElementById('btnCloseAlert')
    // referenciar controles de pantalla
    const msgSuccess = this.document.getElementById('msgSuccess');
    const msgProblem = this.document.getElementById('msgProblem');

    // recuperar nombre de usuario y los otros datos necesarios para el logout
    const result = JSON.parse(this.localStorage.getItem('result'));
    const tipoDocumento = localStorage.getItem('tipoDocumento');
    const numeroDocumento = localStorage.getItem('numeroDocumento');

    // mostrar nombre de usuario en alerta
    mostrarAlerta(`Bienvenido ${result.nombreUsuario}`);

    btnLogout.addEventListener('click', function(){
        cerrarSesion(tipoDocumento, numeroDocumento);
    });

});

function mostrarAlerta(mensaje) {
    msgSuccess.innerHTML = mensaje;
    msgSuccess.style.display = 'block';
}

function mostrarError(mensaje) {
    msgError.innerHTML = mensaje;
    msgError.style.display = 'block';
}

function ocultarError() {
    msgError.innerHTML = '';
    msgError.style.display = 'none';
}

async function cerrarSesion(tipoDocumento, numeroDocumento) {
    
    const logoutRequest = {
        tipoDocumento: tipoDocumento,
        numeroDocumento: numeroDocumento
    };

    try {
        const response = await fetch("http://localhost:8082/login/cerrar-sesion-async", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(logoutRequest)
        });

        const result = await response.json();

        if (result.resultado) {
            console.log("Cierre de sesión exitoso", result.fecha);
            const params = new URLSearchParams();
            params.append('mensajeCierre', 'Cierre de sesión exitoso');
            localStorage.removeItem('result');
            localStorage.removeItem('tipoDocumento');
            localStorage.removeItem('numeroDocumento');
            window.location.replace(`inicio.html?${params.toString()}`);
        } else {
            console.error("Error durante el cierre de sesión: ", result.mensajeError);
            mostrarError('Error durante el cierre de sesión');
        }

    } catch (error) {
        console.error("Ocurrió un error al cerrar sesión: ", error);
        mostrarError('Ocurrió un error al cerrar sesión');
    }
}