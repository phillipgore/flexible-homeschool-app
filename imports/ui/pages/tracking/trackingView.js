import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { SchoolWork } from '../../../api/schoolWork/schoolWork.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Subjects } from '../../../api/subjects/subjects.js';
import { Lessons } from '../../../api/lessons/lessons.js';

import './trackingView.html';

Template.trackingView.onCreated( function() {
	let template = Template.instance();

	Session.set('hasChanged', false);
	template.schoolWork = new ReactiveVar();
	
	template.autorun(() => {
		this.trackingData = Meteor.subscribe('trackingViewPub', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedWeekId'));
		Session.set({editUrl: '/tracking/students/edit/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedTermId') +'/'+ FlowRouter.getParam('selectedWeekId')});
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

	weekLessonsExist: function() {
		if (Lessons.find({weekId: FlowRouter.getParam('selectedWeekId')}).count()) {
			return true;
		}
		return false;
	},

	schoolWorkOne: function() {
		if (Template.instance().trackingData.ready()) {
			return getSchoolWork(FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedSchoolYearId')).workColumnOne;
		}
	},

	schoolWorkTwo: function() {
		if (Template.instance().trackingData.ready()) {
			return getSchoolWork(FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedSchoolYearId')).workColumnTwo;
		}
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

let getSchoolWork = (studentId, schoolYearId) => {
	let subjects = Subjects.find({studentId: studentId, schoolYearId: schoolYearId}, {sort: {name: 1}}).fetch();
	subjects.forEach(subject => {
		subject.workCount = SchoolWork.find({studentId: studentId, schoolYearId: schoolYearId, subjectId: subject._id}).count()
	});

	let noSubjectWorkCount = SchoolWork.find({studentId: studentId, schoolYearId: schoolYearId, subjectId: {$exists: false}}).count();
	let noSubject = {
		groupId: subjects[0].groupId,
		name: 'No Subject',
		schoolYearId: subjects[0].schoolYearId,
		studentId: subjects[0].studentId,
		userId: subjects[0].userId,
		workCount: noSubjectWorkCount,
		_id: 'noSubject',
	};

	let allSubjects = subjects.concat(noSubject);
	let workHalfCount = SchoolWork.find({studentId: studentId, schoolYearId: schoolYearId}).count() / 2;
	let subjectWorkCounts = allSubjects.map(subject => subject.workCount);

	let workColumnOne = [];
	let workColumnTwo = [];

	let workTotal = 0
	let workColumnOneIncomplete = true
	allSubjects.forEach(subject => {
		workTotal = workTotal + subject.workCount;
		if (workColumnOneIncomplete) {
			workColumnOne.push(subject);
		} else {
			workColumnTwo.push(subject);
		}
		if (workTotal > workHalfCount || workTotal === workHalfCount) {
			workColumnOneIncomplete = false
		}
	});

	let workColumns = {
		workColumnOne: workColumnOne,
		workColumnTwo: workColumnTwo
	}

	return workColumns;
};









