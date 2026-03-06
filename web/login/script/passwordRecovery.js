const btnRecovery = document.querySelector('.continue-button');
const btnVerify = document.querySelector('.verif-btn');
const newpassButton = document.querySelector('.newpass-button');

const API_BASE = `${window.location.origin}/node`;

const getInputValue = (selector) => {
	const el = document.querySelector(selector);
	return el ? el.value.trim() : '';
};

function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function requestRecoveryCode() {
	const user = getInputValue('input[name="txtUsuario"]');
	const email = getInputValue('input[name="email"]');
	const hostname = window.location.origin;

	if (!user || !email) {
		return toastr.error('Complete todos los campos');
	}

	if (!isValidEmail(email)) {
		return toastr.warning('Ingrese un correo electrónico válido');
	}

	try {
		const res = await fetch(`${API_BASE}/send-code`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ user, email, hostname })
		});

		const data = await res.json();

		if (data.success) {
			toastr.success('Código enviado al correo');
			document.querySelector('#formLogin').style.display = 'none';
			document.querySelector('.verif-email-wrapper').style.display = 'block';
			localStorage.setItem('tokenub', data.token);
			localStorage.setItem('recoveryUser', user);
			localStorage.setItem('recoveryEmail', email);
			// Limpiar inputs del código
			document.querySelectorAll('.verif-code-input').forEach(input => input.value = '');
		} else {
			toastr.error(data.message || 'Error al enviar el código');
		}
	} catch (err) {
		toastr.error('Ocurrió un error al conectarse con el servidor');
		console.error(err);
	}
}

function validatePassword() {
	const pass1 = document.querySelectorAll('.newpass-input')[0].value.trim();
	const pass2 = document.querySelectorAll('.newpass-input')[1].value.trim();

	let errorMsg = '';

	if (pass1.length < 8) {
		errorMsg += 'La contraseña debe tener al menos 8 caracteres.SL';
	}

	if (!/[A-Z]/.test(pass1) || !/[a-z]/.test(pass1)) {
		errorMsg += 'Debe contener letras mayúsculas y minúsculas.SL';
	}

	if (!/\d/.test(pass1)) {
		errorMsg += 'Debe contener al menos un número.SL';
	}

	if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass1)) {
		errorMsg += 'Debe contener al menos un símbolo (ej: !@#...).SL';
	}

	if (pass1 !== pass2) {
		errorMsg += 'Las contraseñas no coinciden.SL';
	}

	if (errorMsg) {
		toastr.warning(errorMsg.replaceAll(/SL/g, '<br>'));
		return false;
	}

	return true;
}

function resetPass() {
	document.querySelector('.verif-email-wrapper').style.display = 'none';
	document.querySelector('.newpass-wrapper').style.display = 'block';
}

async function recoveryPass() {
	if (!validatePassword()) return;

	const token = localStorage.getItem('tokenub');
	const user = localStorage.getItem('recoveryUser');
	const email = localStorage.getItem('recoveryEmail');
	const hostname = window.location.origin;
	const password = document.querySelectorAll('.newpass-input')[0].value.trim();

	try {
		
		const res = await fetch(`${API_BASE}/change-pass`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ user, email, hostname, token, password })
		});

		const data = await res.json();

		if (data.success) {
			toastr.success('Contraseña actualizada correctamente');
			document.querySelector('.newpass-wrapper').style.display = 'none';
			document.querySelector('#formLogin').style.display = 'block';
			
			document.querySelector('.backToLogin').click()
			localStorage.removeItem('tokenub');
			localStorage.removeItem('recoveryUser');
			localStorage.removeItem('recoveryEmail');
		} else {
			toastr.error(data.message || 'No se pudo actualizar la contraseña');
		}
	} catch (err) {
		toastr.error('Error al conectar con el servidor');
		console.error(err);
	}
}

// Eventos
btnVerify?.addEventListener('click', resetPass);
newpassButton?.addEventListener('click', recoveryPass);
btnRecovery?.addEventListener('click', requestRecoveryCode);
