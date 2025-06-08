/** @format */

document.addEventListener("DOMContentLoaded", () => {
	const secciones = document.querySelectorAll(".pantalla");

	function mostrarPantalla(id) {
		secciones.forEach((pantalla) => {
			pantalla.style.display = "none";
		});
		const nuevaPantalla = document.getElementById(id);
		if (nuevaPantalla) nuevaPantalla.style.display = "block";
		document.body.className = id; // cambia clase en body para estilos por pantalla
	}

	// Comenzar → pregunta si está registrado
	document.getElementById("btnComenzar").addEventListener("click", () => {
		mostrarPantalla("pantallaRegistroPregunta");
	});

	// Sí, ingresar → login
	document.getElementById("btnSiIngresar").addEventListener("click", () => {
		mostrarPantalla("pantallaLogin");
	});

	// No, registrarme → registro
	document.getElementById("btnNoRegistrarme").addEventListener("click", () => {
		mostrarPantalla("pantallaRegistro");
	});

	// Lógica de login
	document.getElementById("formLogin").addEventListener("submit", (e) => {
		e.preventDefault();
		let nombre = document.getElementById("loginNombre").value.trim();
		let apellido = document.getElementById("loginApellido").value.trim();
		let contrasena = document.getElementById("loginContrasena").value;

		let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
		let usuario = usuarios.find(
			(u) =>
				u.nombre === nombre &&
				u.apellido === apellido &&
				u.contrasena === contrasena
		);

		if (usuario) {
			Swal.fire("Inicio de sesión exitoso ✅", "", "success").then(() => {
				window.location.href = "productos.html";
			});
		} else {
			Swal.fire("Datos incorrectos ❌", "Revisa los datos ingresados", "error");
		}
	});

	// Validación para habilitar botón de registro
	const checkbox = document.getElementById("checkboxSimulador");
	const edadInput = document.getElementById("edad");
	const contrasena = document.getElementById("contrasena");
	const confirmarContrasena = document.getElementById("confirmarContrasena");
	const btnRegistrarme = document.getElementById("btnRegistrarme");

	function validarFormulario() {
		let edadValida = parseInt(edadInput.value) >= 18;
		let contrasenasIguales = contrasena.value === confirmarContrasena.value;
		btnRegistrarme.disabled = !(
			checkbox.checked &&
			edadValida &&
			contrasenasIguales
		);
	}

	checkbox.addEventListener("change", validarFormulario);
	edadInput.addEventListener("input", validarFormulario);
	contrasena.addEventListener("input", validarFormulario);
	confirmarContrasena.addEventListener("input", validarFormulario);

	// Registro
	document.getElementById("formRegistro").addEventListener("submit", (e) => {
		e.preventDefault();
		let nombre = document.getElementById("nombre").value.trim();
		let apellido = document.getElementById("apellido").value.trim();
		let edad = parseInt(edadInput.value);
		let dni = document.getElementById("dni").value.trim();
		let tarjeta = document.getElementById("tarjeta").value.trim();

		if (edad < 18) {
			Swal.fire(
				"Eres menor de edad ❌",
				"Debes tener al menos 18 años",
				"error"
			);
			return;
		}

		let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
		let usuarioExistente = usuarios.find(
			(u) => u.dni === dni || u.tarjeta === tarjeta
		);

		if (usuarioExistente) {
			Swal.fire("Usuario ya registrado ❌", "DNI o tarjeta ya usados", "error");
			return;
		}

		let nuevoUsuario = {
			nombre,
			apellido,
			edad,
			dni,
			tarjeta,
			contrasena: contrasena.value,
		};

		usuarios.push(nuevoUsuario);
		localStorage.setItem("usuarios", JSON.stringify(usuarios));

		Swal.fire("Registro exitoso ✅", "", "success").then(() => {
			window.location.href = "productos.html";
		});
	});

	// Mostrar solo pantalla de bienvenida al cargar
	mostrarPantalla("pantallaBienvenida");
});
