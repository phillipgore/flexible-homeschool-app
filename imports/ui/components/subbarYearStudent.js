import {Template} from 'meteor/templating';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Students} from '../../api/students/students.js';
import moment from 'moment';
import './subbarYearStudent.html';

Template.subbarYearStudent.onCreated( function() {
	// Subscriptions
	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('allSchoolYears', () => {
			let year = moment().year();
			let month = moment().month();
			function startYear(year) {
				if (month < 6) {
					return year = (year - 1).toString();
				}
				return year.toString();
			}
			
	    	Session.set('selectedSchoolYear', SchoolYears.findOne({startYear: startYear(moment().year())}))
	    })
	});

	template.autorun( () => {
		template.subscribe('allStudents', () => {
	    	Session.set('selectedStudent', Students.findOne({}, {sort: {birthday: 1, lastName: 1, firstName: 1}}));
	    })
	});
});

Template.subbarYearStudent.helpers({
	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	selectedSchoolYear: function() {
		return Session.get('selectedSchoolYear');
	},

	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	selectedStudent: function() {
		return Session.get('selectedStudent');
	},

	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},
});

Template.subbarYearStudent.events({
	'click .js-school-years'(event) {
		event.preventDefault();

		let schoolYearId = $(event.currentTarget).attr('id');
		if (schoolYearId === 'all-years') {
			Session.set('selectedSchoolYear', {_id: 'all-years', startYear: 'All', endYear: 'Years'})
		} else {
			Session.set('selectedSchoolYear', SchoolYears.findOne({_id: schoolYearId}))
		}
	},

	'click .js-students'(event) {
		event.preventDefault();

		let studentId = $(event.currentTarget).attr('id');
		Session.set('selectedStudent', Students.findOne({_id: studentId}));
	},
});