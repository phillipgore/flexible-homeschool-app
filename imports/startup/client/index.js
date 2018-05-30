import './triggers.js';
import './userRoutes.js';
import './planningRoutes.js';
import './trackingRoutes.js';
import './reportingRoutes.js';
import './settingsRoutes.js';

import moment from 'moment';

FlowRouter.route('/initializing', {
	name: 'initializing',
	action() {
		BlazeLayout.render('initializing');
	},
});

Accounts.onLogout(() => {
	Session.clear();
});

Template.registerHelper('dateFormat', (date) => {
  return moment.utc(date).format('MMMM D, YYYY');
});

Template.registerHelper('shortDateFormat', (date) => {
  return moment.utc(date).format('M/D/YY');
});

Template.registerHelper('stripeDateFormat', (date) => {
  return moment.unix(date).format('M/D/YY');
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