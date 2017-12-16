import {Template} from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import './schoolYearsId.html';

Template.schoolYearsId.onCreated( function() {
	// Subscriptions
	this.subscribe('schoolYear', FlowRouter.getParam('id'));
	this.subscribe('schoolYearsTerms', FlowRouter.getParam('id'));

});

Template.schoolYearsId.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/schoolYears/list',
		leftIcon: 'fss-btn-back',
		leftCaret: false,
		label: '',
		rightUrl: '',
		rightIcon: 'fss-btn-settings',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.schoolYearsId.helpers({
	schoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('id')});
	},

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('id')})
	},
	
	dynamicToolbarLabel: function() {
		let schoolYears = SchoolYears.findOne({_id: FlowRouter.getParam('id')});
		return schoolYears && schoolYears.startYear +"-"+ schoolYears.endYear;
	},
});