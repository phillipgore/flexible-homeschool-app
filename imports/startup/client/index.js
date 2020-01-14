import './triggers/getInitialData.js';

import './triggers/checkPaymentError';
import './triggers/checkRoleAppAdminOrDev';
import './triggers/checkRoleObserver';
import './triggers/checkRoleUser.js';
import './triggers/checkSignOut';
import './triggers/checkSubscriptionPaused';
import './triggers/clearAlerts';
import './triggers/isAppAdmin';
import './triggers/resetSessions';
import './triggers/scrollReset';
import './triggers/setFramePosition';

import { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';

	import './accountRoutes.js';
	import './planningRoutes.js';
	import './trackingRoutes.js';
	import './reportingRoutes.js';
	import './settingsRoutes.js';
	import './officeRoutes.js';
	
new FlowRouterTitle(FlowRouter);

FlowRouter.notFound = {
    name: 'notFound',
	action() {
		BlazeLayout.render('notFound');
	},
};

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
		return moment(date).format('MMMM D, YYYY');
	}
	return '';
});

Template.registerHelper('dateTimeFormat', (date) => {
	if (date) {
	  return moment(date).format('MMMM D, YYYY - h:mm A');
	}
	return '';
});

Template.registerHelper('shortDateFormat', (date) => {
	if (date) {
	  return moment(date).format('M/D/YY');
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

Template.registerHelper('weekDays', ( day ) => {
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
});









