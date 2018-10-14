import './triggers.js';
import './accountRoutes.js';
import './planningRoutes.js';
import './trackingRoutes.js';
import './reportingRoutes.js';
import './settingsRoutes.js';
import './officeRoutes.js';

import moment from 'moment';

Accounts.onLogout(() => {
	Session.clear();
});

$(window).on('load', function (event) {
	Session.set({
		windowHeight: $(window).height(),
		windowWidth: $(window).width(),
	});
});

$(window).resize(function(event) {
	Session.set({
		windowHeight: $(window).height(),
		windowWidth: $(window).width(),
	});
});

Template.registerHelper('selectedFramePosition', () => {
  return Session.get('selectedFramePosition')
});

Template.registerHelper('dateFormat', (date) => {
	if (date) {
		return moment.utc(date).format('MMMM D, YYYY');
	}
	return '';
});

Template.registerHelper('dateTimeFormat', (date) => {
	if (date) {
	  return moment.utc(date).format('MMMM D, YYYY - h:mm A');
	}
	return '';
});

Template.registerHelper('shortDateFormat', (date) => {
	if (date) {
	  return moment.utc(date).format('M/D/YY');
	}
	return '';
});

Template.registerHelper('stripeDateFormat', (date) => {
	if (date) {
	  return moment.unix(date).format('M/D/YY');
	}
	return '';
});

Template.registerHelper('age', (date) => {
	let years = moment().diff(date, 'years');
	if (years === 1) {
		return years + ' Year Old';
	}
	return years + ' Years Old';
});

Template.registerHelper('sPlural', (number) => {
	if (number === 1) {
		return '';
	}
	return 's';
});

Template.registerHelper('esPlural', (number) => {
	if (number === 1) {
		return '';
	}
	return 'es';
});

Template.registerHelper('centsToDollars', ( cents ) => {
  return '$' + (cents / 100).toFixed(2);
});