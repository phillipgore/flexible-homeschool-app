import {Template} from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import './schoolYearsId.html';

Template.schoolYearsId.onRendered( function() {
	// Subscriptions
	Meteor.subscribe('schoolYear', FlowRouter.getParam('id'));

	// Toolbar Settings
	Session.set({
		leftUrl: '/settings/schoolyears/list',
		leftIcon: 'fss-btn-back',
		leftCaret: false,
		label: '',
		rightUrl: '',
		rightIcon: 'fss-btn-settings',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'settingsList');
});

Template.schoolYearsId.helpers({
	schoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('id')});
	},
	dynamicToolbarLabel: function() {
		let schoolYear = SchoolYears.findOne({_id: FlowRouter.getParam('id')});
		return schoolYear && schoolYear.startYear +'-'+ schoolYear.endYear;
	}
});