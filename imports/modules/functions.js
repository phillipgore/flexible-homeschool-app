import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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
};

export function yearValidation(year) {
	let yearArray = year.split('');
	let digits = ['1', '2', '3', '4', '5', '6', '7', '9', '0'];
	let digitCheck = false;

	yearArray.forEach((digit) => {
		if (digits.indexOf(digit) === -1) {
			digitCheck = false
		}
		digitCheck = true;
	})

	if (yearArray.length === 4 && digitCheck === true && yearArray[0] != '0') {
		return true;
	}
	return false;
};

export function minutesConvert(minutes) {
	if (isNaN(minutes)) {
		return "0h 0m";
	}
	if (minutes === 60) {
		return "1h 0m";
	}
	if (minutes > 60) {
		let hours = Math.floor(minutes / 60);
		let minutesLeft = minutes - (hours * 60);
		return hours +"h "+ Math.round(minutesLeft) +"m";
	}
	if (minutes < 60) {
		let seconds = 60 * (minutes - Math.floor(minutes));
		return Math.floor(minutes) + "m "+ Math.round(seconds) +"s";
	}
};

export function weekdayLabels(day) {
	if (day === 0 || day === '0') {
		return ''
	}
	if (day === 1 || day === '1') {
		return 'Mon'
	}
	if (day === 2 || day === '2') {
		return 'Tue'
	}
	if (day === 3 || day === '3') {
		return 'Wed'
	}
	if (day === 4 || day === '4') {
		return 'Thu'
	}
	if (day === 5 || day === '5') {
		return 'Fri'
	}
	if (day === 6 || day === '6') {
		return 'Sat'
	}
	if (day === 7 || day === '7') {
		return 'Sun'
	}
};

export function weekdayLabelsShort(day) {
	if (day === 0 || day === '0') {
		return ''
	}
	if (day === 1 || day === '1') {
		return 'Mo'
	}
	if (day === 2 || day === '2') {
		return 'Tu'
	}
	if (day === 3 || day === '3') {
		return 'We'
	}
	if (day === 4 || day === '4') {
		return 'Th'
	}
	if (day === 5 || day === '5') {
		return 'Fr'
	}
	if (day === 6 || day === '6') {
		return 'Sa'
	}
	if (day === 7 || day === '7') {
		return 'Su'
	}
};

export const saveNote = (schoolWorkId) => {
	$('.js-notes-loader-' + schoolWorkId).show();

	let user = Meteor.user();
	let noteProperties = {
		userId: user._id,
		groupId: user.info.groupId,
		weekId: FlowRouter.getParam('selectedWeekId'),
		schoolWorkId: schoolWorkId,
		note: $('.js-notes-' + schoolWorkId).find('.editor-content').html().trim(),
	}

	Meteor.call('upsertNotes', noteProperties, function(error, result) {
		if (error) {
			Alerts.insert({
				colorClass: 'bg-danger',
				iconClass: 'icn-danger',
				message: error.reason,
			});
		} else {
			Session.set('hasChanged', false);
			$('.js-notes-loader-' + schoolWorkId).hide();
		}
	});
}












