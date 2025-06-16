/** @format */

document.addEventListener("DOMContentLoaded", () => {
	const formRegistro = document.getElementById("form-registro");
	const btnRegistro = document.getElementById("btn-registrarse");
	const checkboxConsentimiento = document.getElementById(
		"registro-consentimiento"
	);
	const spinnerContainer = document.querySelector(".spinner-container");
	const inputUsuario = document.getElementById("registro-usuario");
	const mensajeErrorUsuario = document.getElementById("error-usuario");
	const inputEmail = document.getElementById("registro-email");
	const inputTarjeta = document.getElementById("registro-tarjeta");
	const formLogin = document.getElementById("form-login");
	const btnIngresar = document.getElementById("btn-ingresar");
	const inputLoginUsuario = document.getElementById("login-usuario");
	const inputLoginEmail = document.getElementById("login-email");
	const inputLoginPassword = document.getElementById("login-password");
	const regexUsuario = /^[a-z0-9._-]{5,15}$/;
	const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	document.addEventListener("DOMContentLoaded", () => {});
	if (inputUsuario) {
		inputUsuario.addEventListener("input", () => {
			const valor = inputUsuario.value;

			if (!regexUsuario.test(valor)) {
				mensajeErrorUsuario.innerText =
					"❌ El nombre de usuario debe estar en minúsculas, contener números y solo los caracteres . _ -";
				mensajeErrorUsuario.style.color = "red";
			} else {
				mensajeErrorUsuario.innerText = "✅ Nombre de usuario válido";
				mensajeErrorUsuario.style.color = "green";
			}
		});
	}

	if (inputTarjeta) {
		inputTarjeta.addEventListener("input", () => {
			let valor = inputTarjeta.value.replace(/\D/g, "");

			valor = valor.slice(0, 16);

			const formateado = valor.replace(/(.{4})/g, "$1 ").trim();

			inputTarjeta.value = formateado;
		});
	}

	if (checkboxConsentimiento) {
		checkboxConsentimiento.addEventListener("change", () => {
			btnRegistro.disabled = !checkboxConsentimiento.checked;
		});
	}

	if (formRegistro) {
		formRegistro.addEventListener("submit", (event) => {
			event.preventDefault();
			let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
			const nombre = document.getElementById("registro-nombre").value.trim();
			const usuario = inputUsuario.value.trim();
			const email = inputEmail.value.trim();
			const edad = document.getElementById("registro-edad").value.trim();
			const dni = document.getElementById("registro-dni").value.trim();
			const tarjeta = document.getElementById("registro-tarjeta").value.trim();
			const contrasena = document
				.getElementById("registro-password")
				.value.trim();
			const confirmarContrasena = document
				.getElementById("registro-confirmar-password")
				.value.trim();
			const yaExiste = usuarios.some(
				(u) => u.usuario === usuario || u.email === email
			);

			if (
				!nombre ||
				!usuario ||
				!email ||
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

			if (!regexUsuario.test(usuario)) {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "El nombre de usuario no cumple con los requisitos.",
					confirmButtonColor: "#8800ff",
				});
				return;
			}

			if (!regexEmail.test(email)) {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "El correo electrónico no es válido.",
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

			if (inputTarjeta.value.replace(/\s/g, "").length !== 16) {
				Swal.fire({
					icon: "error",
					title: "Número de tarjeta inválido",
					text: "La tarjeta debe tener exactamente 16 dígitos.",
					confirmButtonColor: "#8800ff",
				});
				return;
			}

			if (yaExiste) {
				Swal.fire({
					icon: "error",
					title: "Ya registrado",
					text: "Ese nombre de usuario o correo ya está en uso.",
					confirmButtonColor: "#8800ff",
				});
				return;
			}

			const nuevoUsuario = {
				nombre,
				usuario,
				email,
				edad,
				dni,
				tarjeta,
				contrasena,
			};

			usuarios.push(nuevoUsuario);
			localStorage.setItem("usuarios", JSON.stringify(usuarios));
			Swal.fire({
				icon: "success",
				title: "Registro exitoso",
				text: "Ahora puedes iniciar sesión.",
				confirmButtonColor: "#8800ff",
			}).then(() => {
				if (spinnerContainer) {
					console.log("🚀 Activando spinner...");

					spinnerContainer.classList.add("active");
				} else {
					console.log("❌ Spinner no encontrado en el DOM");
				}

				setTimeout(() => {
					window.location.assign("login.html");
				}, 2000);
			});
		});
	}

	if (formLogin) {
		[inputLoginUsuario, inputLoginEmail, inputLoginPassword].forEach(
			(campo) => {
				campo.addEventListener("input", () => {
					btnIngresar.disabled = !(
						inputLoginUsuario.value.trim() &&
						inputLoginEmail.value.trim() &&
						inputLoginPassword.value.trim()
					);
				});
			}
		);

		btnIngresar.addEventListener("click", () => {
			formLogin.dispatchEvent(new Event("submit"));
		});

		formLogin.addEventListener("submit", (event) => {
			event.preventDefault();
			const usuario = inputLoginUsuario.value.trim();
			const email = inputLoginEmail.value.trim();
			const contrasena = inputLoginPassword.value.trim();
			const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
			const usuarioEncontrado = usuarios.find(
				(user) =>
					user.usuario === usuario &&
					user.email === email &&
					user.contrasena === contrasena
			);

			if (usuarioEncontrado) {
				Swal.fire({
					icon: "success",
					title: "Inicio de sesión exitoso",
					text: `Bienvenido, ${usuarioEncontrado.usuario}!`,
					confirmButtonColor: "#8800ff",
				}).then(() => {
					if (spinnerContainer) {
						console.log("🚀 Activando spinner antes de redirección...");
						spinnerContainer.classList.add("active");
					}

					setTimeout(() => {
						window.location.assign("productos.html");
					}, 2000);
				});
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Datos incorrectos. Verifica tu usuario, correo y contraseña.",
					confirmButtonColor: "#8800ff",
				});
			}
		});
	}

	document.querySelectorAll(".toggle-password").forEach((icon) => {
		icon.addEventListener("click", () => {
			const input = document.getElementById(icon.dataset.target);

			if (input.type === "password") {
				input.type = "text";
				icon.classList.replace("bx-hide", "bx-show-alt");
			} else {
				input.type = "password";
				icon.classList.replace("bx-show-alt", "bx-hide");
			}
		});
	});
});
