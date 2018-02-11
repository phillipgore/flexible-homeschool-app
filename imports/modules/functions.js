export function cardValidation() {
	if (Session.get('cardNumber') === 'none' || Session.get('cardCvc') === 'none' || Session.get('cardExpiry') === 'none' || Session.get('postalCode') === 'none') {
		if (Session.get('cardNumber') === 'none') {
			$('#card-number').addClass('cc-error');
			$('.card-number-errors').text('Required.');
		} else {
			$('#card-number').removeClass('cc-error');
			$('.card-number-errors').text('');
		}
		if (Session.get('cardCvc') === 'none') {
			$('#card-cvc').addClass('cc-error');
			$('.card-cvc-errors').text('Required.');
		} else {
			$('#card-cvc').removeClass('cc-error');
			$('.card-cvc-errors').text('');
		}
		if (Session.get('cardExpiry') === 'none') {
			$('#card-expiry').addClass('cc-error');
			$('.card-expiry-errors').text('Required.');
		} else {
			$('#card-expiry').removeClass('cc-error');
			$('.card-expiry-errors').text('');
		}
		if (Session.get('postalCode') === 'none') {
			$('#card-postal-code').addClass('cc-error');
			$('.card-postal-code-errors').text('Required.');
		} else {
			$('#card-postal-code').removeClass('cc-error');
			$('.card-postal-code-errors').text('');
		}
		return false;
	}

	return true;
};

export function emailValidation(email) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		return true;
	}
	return false;
};

export function passwordValidation(password, confirm) {
	if (password === confirm) {
		return true;
	}
	return false;
};

export function requiredValidation(input) {
	if (input) {
		return true;
	}
	return false;
}