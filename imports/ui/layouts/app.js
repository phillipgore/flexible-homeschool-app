import {Template} from 'meteor/templating';

// Application
import './app.html';


// Components
import '../components/dialog.js';
import '../components/toolbar.js';
import '../components/toolbarLogo.html';
import '../components/toolbarResources.js';
import '../components/toolbarView.js';
import '../components/subbarAccounts.html';
import '../components/subbarYearTerm.html';
import '../components/subbar.html';
import '../components/navbar.js';


// Accounts
import '../pages/accounts/createAccount.js';
import '../pages/accounts/verifySent.js';
import '../pages/accounts/verifySuccess.js';
import '../pages/accounts/signIn.js';
import '../pages/accounts/reset.js';
import '../pages/accounts/resetSent.js';
import '../pages/accounts/resetPassword.js';
import '../pages/accounts/resetSuccess.js';


// Planning
import '../pages/planning/planningList.js';
	//School Years
	import '../pages/planning/schoolYears/schoolYearsNew.js';
	import '../pages/planning/schoolYears/schoolYearsList.js';
	import '../pages/planning/schoolYears/schoolYearsView.js';
	import '../pages/planning/schoolYears/schoolYearsEdit.js';
	// Resources
	import '../pages/planning/resources/resourcesNewForms/resourcesNewApp.js';
	import '../pages/planning/resources/resourcesNewForms/resourcesNewAudio.js';
	import '../pages/planning/resources/resourcesNewForms/resourcesNewBook.js';
	import '../pages/planning/resources/resourcesNewForms/resourcesNewLink.js';
	import '../pages/planning/resources/resourcesNewForms/resourcesNewVideo.js';
	import '../pages/planning/resources/resourcesList.js';
	import '../pages/planning/resources/resourcesView.js';
	import '../pages/planning/resources/resourcesEdit.js';
	// Subjects
	import '../pages/planning/subjects/subjectsNew.js';
	import '../pages/planning/subjects/subjectsList.js';
	import '../pages/planning/subjects/subjectsView.js';
	import '../pages/planning/subjects/subjectsEdit.js';
	// Students
	import '../pages/planning/students/studentsNew.js';
	import '../pages/planning/students/studentsList.js';
	import '../pages/planning/students/studentsView.js';
	import '../pages/planning/students/studentsEdit.js';


// Tracking
import '../pages/tracking/trackingList.js';


// Reporting
import '../pages/reporting/reportingList.js';


// Settings
import '../pages/settings/settingsList.js';

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









