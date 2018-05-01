// Application
import './app.html';


// Components
import '../components/creditCard.js';
import '../components/dialog.js';
import '../components/navbar.js';
	// Loaders
	import '../components/loaders/loading.js';
	import '../components/loaders/saving.js';
	import '../components/loaders/updating.js';
	// Subbars
	import '../components/subbars/subbar.html';
	import '../components/subbars/subbarAccounts.html';
	import '../components/subbars/subbarReporting.js';
	import '../components/subbars/subbarResources.js';
	import '../components/subbars/subbarSubjects.js';
	import '../components/subbars/subbarTracking.js';
	import '../components/subbars/subbarTrackingStudent.js';
	// Toolbars
	import '../components/toolbars/toolbar.js';
	import '../components/toolbars/toolbarSmall.html';
	import '../components/toolbars/toolbarLarge.html';
	import '../components/toolbars/toolbarLogo.html';
	import '../components/toolbars/toolbarPrint.js';
	import '../components/toolbars/toolbarResources.js';
	import '../components/toolbars/toolbarUsersView.js';
	import '../components/toolbars/toolbarView.js';


// Accounts
import '../pages/accounts/createAccount.js';
import '../pages/accounts/verify/verifySent.js';
import '../pages/accounts/verify/verifySuccess.js';
import '../pages/accounts/signIn.js';
import '../pages/accounts/reset/reset.js';
import '../pages/accounts/reset/resetSent.js';
import '../pages/accounts/reset/resetPassword.js';
import '../pages/accounts/reset/resetSuccess.js';


// Planning
import '../pages/planning/planningList.js';
	//School Years
	import '../pages/planning/schoolYears/schoolYearsNew.js';
	import '../pages/planning/schoolYears/schoolYearsList.js';
	import '../pages/planning/schoolYears/schoolYearsView.js';
	import '../pages/planning/schoolYears/schoolYearsEdit.js';
	// Resources
	import '../pages/planning/resources/resourcesEditForms/resourcesEditApp.js';
	import '../pages/planning/resources/resourcesEditForms/resourcesEditAudio.js';
	import '../pages/planning/resources/resourcesEditForms/resourcesEditBook.js';
	import '../pages/planning/resources/resourcesEditForms/resourcesEditLink.js';
	import '../pages/planning/resources/resourcesEditForms/resourcesEditVideo.js';
	import '../pages/planning/resources/resourcesNewForms/resourcesNewApp.js';
	import '../pages/planning/resources/resourcesNewForms/resourcesNewAudio.js';
	import '../pages/planning/resources/resourcesNewForms/resourcesNewBook.js';
	import '../pages/planning/resources/resourcesNewForms/resourcesNewLink.js';
	import '../pages/planning/resources/resourcesNewForms/resourcesNewVideo.js';
	import '../pages/planning/resources/resourcesList.js';
	import '../pages/planning/resources/resourcesView.js';
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
import '../pages/tracking/trackingView.js';


// Reporting
import '../pages/reporting/reportingList.js';
import '../pages/reporting/reportingSettingsEdit.js';
import '../pages/reporting/reports/reportingSchoolYears.js';
import '../pages/reporting/reports/reportingTerms.js';
import '../pages/reporting/reports/reportingSubjects.js';
import '../pages/reporting/reports/reportingResources.js';
import '../pages/reporting/reports/reportingLessons.js';


// Settings
import '../pages/settings/settingsList.js';
	// Users
	import '../pages/settings/users/usersList.js';
	import '../pages/settings/users/usersNew.js';
	import '../pages/settings/users/usersView.js';
	import '../pages/settings/users/usersEdit.js';
	import '../pages/settings/users/usersVerifySent.js';
	import '../pages/settings/users/usersRestricted.js';
	// Support
	import '../pages/settings/support/supportList.js';
	// Billing
	import '../pages/settings/billing/billingError.js';
	import '../pages/settings/billing/billingList.js';
	import '../pages/settings/billing/billingInvoices.js';
	import '../pages/settings/billing/billingEdit.js';

import {Template} from 'meteor/templating';
import { Groups } from '../../api/groups/groups.js';
import { SchoolYears } from '../../api/schoolYears/schoolYears.js';
import { Students } from '../../api/students/students.js';
import { Terms } from '../../api/terms/terms.js';
import { Weeks } from '../../api/weeks/weeks.js';
import moment from 'moment';

Alerts = new Mongo.Collection(null);


Template.app.helpers({
	alerts: function() {
		return Alerts.find();
	},

	backButton() {
		// console.log(Session.get('selectedFramePosition'))
		if (Session.get('selectedFramePosition') === 1 || Session.get('selectedFramePosition') === 2) {
			return false;
		}
		return true;
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
	'click .js-dropdown'(event) {
		event.preventDefault();
		let menuId = $(event.currentTarget).attr('data-menu');

		$('.dropdown-menu, .list-item-dropdown-menu').not(menuId).fadeOut(100);

		if ($(menuId).is(':visible')) {
			$(menuId).fadeOut(100);
			$(menuId).removeAttr('style');
		} else {
			let maxMenuHeight = $('#__blaze-root').height() - 59;
			$(menuId).css({maxHeight: maxMenuHeight}).fadeIn(200);
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
		if (!$(event.currentTarget).hasClass('js-dropdown')) {
			$('.dropdown-menu, .list-item-dropdown-menu').fadeOut(100);
		}
	},

	// Frame Positon
	'click .frame-one a'(event) {
		$('.frame-contaner-inner').removeClass('frame-position-three');
		$('.frame-contaner-inner').addClass('frame-position-two');
		Session.set('selectedFramePosition', 2);
	},

	'click .frame-two a'(event) {
		$('.frame-contaner-inner').removeClass('frame-position-two');
		$('.frame-contaner-inner').addClass('frame-position-three');
		Session.set('selectedFramePosition', 3);
	},

	'click .js-btn-back'(event) {
		let newFramePosition = Session.get('selectedFramePosition') - 1;
		console.log(newFramePosition)

		if (newFramePosition === 2) {
			$('.frame-contaner-inner').removeClass('frame-position-three');
			$('.frame-contaner-inner').addClass('frame-position-two');
		} else {
			$('.frame-contaner-inner').removeClass('frame-position-two, frame-position-three');
			Session.set('selectedFramePosition', 1);
		}
	},
});









