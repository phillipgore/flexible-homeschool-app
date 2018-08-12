import {Template} from 'meteor/templating';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Terms} from '../../../api/terms/terms.js';
import {SchoolWork} from '../../../api/schoolWork/schoolWork.js';
import {Weeks} from '../../../api/weeks/weeks.js';
import {Lessons} from '../../../api/lessons/lessons.js';
import moment from 'moment';
import './subbarTracking.html';

Template.subbarTracking.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		// Subbar Subscriptions
		this.schoolYearData = Meteor.subscribe('studentSchoolYearsPath', FlowRouter.getParam('selectedStudentId'));
		this.termData = Meteor.subscribe('studentTermsPath', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
		this.weekData = Meteor.subscribe('weeksPath', FlowRouter.getParam('selectedTermId'), FlowRouter.getParam('selectedStudentId'));
	});
});

Template.subbarTracking.helpers({
	schoolYearSubReady: function() {
		return Template.instance().schoolYearData.ready();
	},

	termSubReady: function() {
		return Template.instance().termData.ready();
	},

	weekSubReady: function() {
		return Template.instance().weekData.ready();
	},

	selectedStudentId: function() {
		return FlowRouter.getParam('selectedStudentId');
	},

	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	yearStatus: function(schoolYearStatus) {
		if (schoolYearStatus === 'empty') {
			return 'fss-open-circle txt-gray-darker';
		}
		if (schoolYearStatus === 'pending') {
			return 'fss-circle txt-gray-darker';
		}
		if (schoolYearStatus === 'partial') {
			return 'fss-circle txt-secondary';
		}
		if (schoolYearStatus === 'assigned') {
			return 'fss-circle txt-warning';
		}
		if (schoolYearStatus === 'completed') {
			return 'fss-circle txt-primary';
		}
	},

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {order: 1}});
	},

	selectedTermId: function() {
		return FlowRouter.getParam('selectedTermId');
	},

	selectedTerm: function() {
		return Terms.findOne({_id: FlowRouter.getParam('selectedTermId')});
	},

	termStatus: function(termStatus) {
		if (termStatus === 'empty') {
			return 'fss-open-circle txt-gray-darker';
		}
		if (termStatus === 'pending') {
			return 'fss-circle txt-gray-darker';
		}
		if (termStatus === 'partial') {
			return 'fss-circle txt-secondary';
		}
		if (termStatus === 'assigned') {
			return 'fss-circle txt-warning';
		}
		if (termStatus === 'completed') {
			return 'fss-circle txt-primary';
		}
	},

	weeks: function() {
		return Weeks.find({}, {sort: {order: 1}});
	},

	selectedWeekId: function() {
		return FlowRouter.getParam('selectedWeekId');
	},

	selectedWeek: function() {
		return Weeks.findOne({_id: FlowRouter.getParam('selectedWeekId')});
	},

	weekStatus: function(weekStatus) {
		if (weekStatus === 'empty') {
			return 'fss-open-circle txt-gray-darker';
		}
		if (weekStatus === 'pending') {
			return 'fss-circle txt-gray-darker';
		}
		if (weekStatus === 'partial') {
			return 'fss-circle txt-secondary';
		}
		if (weekStatus === 'assigned') {
			return 'fss-circle txt-warning';
		}
		if (weekStatus === 'completed') {
			return 'fss-circle txt-primary';
		}
	},

	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},

	selectedFramePositionOne: function() {
		if (Session.get('selectedFramePosition') === 1 && Session.get('windowWidth') < 640) {
			return true;
		}
		return false;
	},	
});

