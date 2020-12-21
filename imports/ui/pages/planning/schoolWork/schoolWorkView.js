import {Template} from 'meteor/templating';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import { Students } from '../../../../api/students/students.js';
import { Resources } from '../../../../api/resources/resources.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';
import './schoolWorkView.html';

Template.schoolWorkView.onCreated( function() {	
	let template = Template.instance();
	
	template.autorun(() => {
		if (FlowRouter.getParam('selectedSchoolWorkId') != 'no-subject') {
			this.schoolWorkData = Meteor.subscribe('schoolWorkView', FlowRouter.getParam('selectedSchoolWorkId'));
		}
	});
});

Template.schoolWorkView.onRendered( function() {
	Session.set({
		toolbarType: 'schoolWork',
		editUrl: '/planning/schoolWork/edit/3/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedSchoolWorkId'),
		labelThree: 'School Work',
		activeNav: 'planningList',
	});
});

Template.schoolWorkView.helpers({
	subscriptionReady: function() {
		if (FlowRouter.getParam('selectedSchoolWorkId') === 'no-subject') {
			return true;
		}
		return Template.instance().schoolWorkData.ready();
	},

	schoolWork: function() {
		if (FlowRouter.getParam('selectedSchoolWorkId') === 'no-subject') {
			return {
				_id: "no-subject",
				name: "Has No Subject",
				schoolYearId: FlowRouter.getParam('selectedSchoolYearId'),
				studentId: FlowRouter.getParam('selectedStudentId'),
				type: "subject",
			}
		}
		return SchoolWork.findOne({_id: FlowRouter.getParam('selectedSchoolWorkId')});
	},

	schoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')})
	},

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')})
	},

	termLessons: function(termId) {
		let lessonCount = Lessons.find({termId: termId}).count();
		if (lessonCount === 1) {
			return lessonCount + ' Segment';
		}
		return lessonCount + ' Segments';
	},

	resources: function(resourceIds) {
		return Resources.find({_id: {$in: resourceIds}});
	},

	showCommas: function(length, index) {
		if (length != parseInt(index) + 1) return ','
	},

	isSubject: function(schoolWorkType) {
		if (schoolWorkType === 'subject') {
			return true;
		}
		return false;
	}
});

Template.schoolWorkView.events({
	
});





