/** @format */

document.addEventListener("DOMContentLoaded", () => {
	// Registro de usuario
	const formRegistro = document.getElementById("form-registro");
	const btnRegistro = document.getElementById("btn-registrarse");
	const checkboxConsentimiento = document.getElementById(
		"registro-consentimiento"
	);

	if (formRegistro && btnRegistro && checkboxConsentimiento) {
		// Habilitar el botón cuando el usuario marque el consentimiento
		checkboxConsentimiento.addEventListener("change", () => {
			btnRegistro.disabled = !checkboxConsentimiento.checked;
		});

		// Activar manualmente el submit al hacer clic en el botón
		btnRegistro.addEventListener("click", () => {
			formRegistro.dispatchEvent(new Event("submit"));
		});

		formRegistro.addEventListener("submit", (event) => {
			event.preventDefault();

			// Obtener valores del formulario
			const nombre = document.getElementById("registro-nombre").value.trim();
			const apellidos = document
				.getElementById("registro-apellidos")
				.value.trim();
			const edad = document.getElementById("registro-edad").value.trim();
			const dni = document.getElementById("registro-dni").value.trim();
			const tarjeta = document.getElementById("registro-tarjeta").value.trim();
			const contrasena = document
				.getElementById("registro-password")
				.value.trim();
			const confirmarContrasena = document
				.getElementById("registro-confirmar-password")
				.value.trim();

			// Validaciones
			if (
				!nombre ||
				!apellidos ||
				!edad ||
				!dni ||
				!tarjeta ||
				!contrasena ||
				!confirmarContrasena
			) {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Todos los campos son obligatorios.",
					confirmButtonColor: "#8800ff",
				});
				return;
			}

			if (contrasena !== confirmarContrasena) {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Las contraseñas no coinciden.",
					confirmButtonColor: "#8800ff",
				});
				return;
			}

			if (isNaN(edad) || edad < 18) {
				Swal.fire({
					icon: "warning",
					title: "Eres menor de edad",
					text: "No puedes registrarte en este simulador.",
					confirmButtonColor: "#8800ff",
				}).then(() => {
					formRegistro.reset();
				});
				return;
			}

			// Guardar usuario en LocalStorage
			const nuevoUsuario = {
				nombre,
				apellidos,
				edad,
				dni,
				tarjeta,
				contrasena,
			};
			let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
			usuarios.push(nuevoUsuario);
			localStorage.setItem("usuarios", JSON.stringify(usuarios));

			Swal.fire({
				icon: "success",
				title: "Registro exitoso",
				text: "Ahora puedes iniciar sesión.",
				confirmButtonColor: "#8800ff",
			}).then(() => {
				window.location.href = "login.html";
			});
		});
	}

	// Inicio de sesión
	const formLogin = document.getElementById("form-login");
	const btnIngresar = document.getElementById("btn-ingresar");

	if (formLogin && btnIngresar) {
		// Habilitar el botón cuando los campos estén llenos
		const camposLogin = document.querySelectorAll(
			"#login-nombre, #login-apellidos, #login-password"
		);

		camposLogin.forEach((campo) => {
			campo.addEventListener("input", () => {
				const nombre = document.getElementById("login-nombre").value.trim();
				const apellidos = document
					.getElementById("login-apellidos")
					.value.trim();
				const contrasena = document
					.getElementById("login-password")
					.value.trim();

				btnIngresar.disabled = !(nombre && apellidos && contrasena);
			});
		});

		// Activar manualmente el submit al hacer clic en el botón
		btnIngresar.addEventListener("click", () => {
			formLogin.dispatchEvent(new Event("submit"));
		});

		formLogin.addEventListener("submit", (event) => {
			event.preventDefault();

			// Obtener valores del formulario
			const nombre = document.getElementById("login-nombre").value.trim();
			const apellidos = document.getElementById("login-apellidos").value.trim();
			const contrasena = document.getElementById("login-password").value.trim();

			// Obtener usuario guardado en LocalStorage
			const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

			// Buscar usuario en la lista
			const usuarioEncontrado = usuarios.find(
				(user) =>
					user.nombre === nombre &&
					user.apellidos === apellidos &&
					user.contrasena === contrasena
			);

			if (usuarioEncontrado) {
				Swal.fire({
					icon: "success",
					title: "Inicio de sesión exitoso",
					text: `Bienvenido, ${usuarioEncontrado.nombre}!`,
					confirmButtonColor: "#8800ff",
				}).then(() => {
					window.location.href = "productos.html";
				});
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Datos incorrectos. Verifica tu nombre, apellidos y contraseña.",
					confirmButtonColor: "#8800ff",
				});
			}
		});
	}
});
