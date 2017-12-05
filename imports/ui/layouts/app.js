import {Template} from 'meteor/templating';

import './app.html';

import '../components/toolbar.js';
import '../components/toolbarLogo.html';
import '../components/subbarAccounts.html';
import '../components/subbarYearTerm.html';
import '../components/subbar.html';
import '../components/navbar.js';

import '../pages/accounts/createAccount.js';
import '../pages/accounts/verifySent.js';
import '../pages/accounts/verifySuccess.js';
import '../pages/accounts/signIn.js';
import '../pages/accounts/reset.js';
import '../pages/accounts/resetSent.js';
import '../pages/accounts/resetPassword.js';
import '../pages/accounts/resetSuccess.js';

import '../pages/students/studentsList.js';
import '../pages/students/studentsNew.js';
import '../pages/students/studentsId.js';

import '../pages/resources/resourcesList.js';
import '../pages/reports/reportsList.js';

import '../pages/settings/settingsList.js';
import '../pages/settings/schoolYears/schoolYearsList.js';
import '../pages/settings/schoolYears/schoolYearsNew.js';
import '../pages/settings/schoolYears/schoolYearsId.js';

Alerts = new Mongo.Collection(null);

Template.app.helpers({
	alerts: function() {
		return Alerts.find();
	},
});

Template.app.events({
	// Select Input
	'focus .fss-select select'(event) {
		$(event.target).parent().addClass('focus');
	},

	'blur .fss-select select'(event) {
		$(event.target).parent().removeClass('focus');
	},


	// Dropdown Button
	'click .btn-dropdown'(event) {
		event.preventDefault();
		let menuId = $(event.currentTarget).attr('href');

		$('.dropdown-menu').not(menuId).fadeOut(100);

		if ($(menuId).is(':visible')) {
			$(menuId).fadeOut(100);
		} else {
			$(menuId).fadeIn(200);
		}
	},


	// FSS Alerts
	'click .js-alert-close'(event) {
		event.preventDefault();
		const alertId = event.currentTarget.id

		$('#' + alertId).parent().addClass('alert-fade-out');
		setTimeout(function(){
			Alerts.remove({_id: alertId});
		}, 350);
	},


	// Universal Click Event
	'click'(event) {
		if (!$(event.currentTarget).hasClass('btn-dropdown')) {
			$('.dropdown-menu').fadeOut(100);
		}
	},
});









