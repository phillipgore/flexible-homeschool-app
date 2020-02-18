import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { SchoolWork } from '../../../api/schoolWork/schoolWork.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Notes } from '../../../api/notes/notes.js';
import { Lessons } from '../../../api/lessons/lessons.js';

import './trackingView.html';

Template.trackingView.onCreated( function() {
	let template = Template.instance();

	Session.set('hasChanged', false);
	template.schoolWork = new ReactiveVar();
	
	template.autorun(() => {
		this.trackingData = Meteor.subscribe('trackingViewPub', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedWeekId'));
		Session.set({editUrl: '/tracking/students/edit/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedTermId') +'/'+ FlowRouter.getParam('selectedWeekId')})
		
		let schoolWork = SchoolWork.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {name: 1}}).fetch();
		schoolWork.forEach(work => {
			let notes = Notes.findOne({schoolWorkId: work._id});
			if (notes) {
				work.note = notes.note;
			}
		})
		template.schoolWork.set(schoolWork);
	});
});

Template.trackingView.onRendered( function() {
	document.getElementsByClassName('frame-two')[0].scrollTop = 0;
	Session.set({
		selectedReportingTermId: FlowRouter.getParam('selectedTermId'),
		selectedReportingWeekId: FlowRouter.getParam('selectedWeekId'),
		toolbarType: 'tracking',
		editUrl: '/tracking/students/edit/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedTermId') +'/'+ FlowRouter.getParam('selectedWeekId'),
		newUrl: '',
		activeNav: 'trackingList',
	});
});

Template.trackingView.helpers({
	subscriptionReady: function() {
		return Template.instance().trackingData.ready();
	},

	student: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	selectedTerm: function() {
		return Terms.findOne({_id: FlowRouter.getParam('selectedTermId')});
	},

	selectedWeek: function() {
		return Weeks.findOne({_id: FlowRouter.getParam('selectedWeekId')});
	},

	schoolWork: function() {
		return SchoolWork.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {name: 1}});
	},

	weekLessonsExist: function() {
		if (Lessons.find({weekId: FlowRouter.getParam('selectedWeekId')}).count()) {
			return true;
		}
		return false;
	},

	schoolWorkOne: function() {
		let schoolWorkLimit = Template.instance().schoolWork.get().length / 2;
		return Template.instance().schoolWork.get().slice(0, schoolWorkLimit);
	},

	schoolWorkTwo: function() {
		let schoolWorkSkip = Template.instance().schoolWork.get().length / 2;
		return Template.instance().schoolWork.get().slice(schoolWorkSkip);
	},

	studentName(first, last) {
		if (first && last) {
			Session.set({labelTwo: first + ' ' + last});
		}
		return false;
	},

	studentsSchoolYearsCount: function() {
		if (Students.find().count() && SchoolYears.find().count()) {
			return true;
		}
		return false;
	},
});











