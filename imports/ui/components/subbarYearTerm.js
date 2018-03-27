import {Template} from 'meteor/templating';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Subjects} from '../../api/subjects/subjects.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {Lessons} from '../../api/lessons/lessons.js';
import moment from 'moment';
import './subbarYearTerm.html';

Template.subbarYearTerm.onCreated( function() {
	// Subscriptions
	this.subscribe('allSubjectsProgress');
	this.subscribe('allLessonsProgress');
	
	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('allSchoolYears', () => {
			if (!Session.get('selectedSchoolYear')) {
				let year = moment().year();
				let month = moment().month();
				function startYear(year) {
					if (month < 6) {
						return year = (year - 1).toString();
					}
					return year.toString();
				}
				
				if (SchoolYears.findOne({startYear: { $gte: startYear(moment().year())}}, {sort: {starYear: 1}})) {
		    		Session.set('selectedSchoolYear', SchoolYears.findOne({startYear: { $gte: startYear(moment().year())}}, {sort: {starYear: 1}}));
				} else {
					Session.set('selectedSchoolYear', SchoolYears.findOne({startYear: { $lte: startYear(moment().year())}}, {sort: {starYear: 1}}));
				}
			}
	    })
	});

	template.autorun( () => {
		template.subscribe('allTerms', () => {
			if (!Session.get('selectedTerm')) {
		    	Session.set('selectedTerm', Terms.findOne({schoolYearId: Session.get('selectedSchoolYear')._id}, {sort: {order: 1,}}));
		    }
	    })
	});
});

Template.subbarYearTerm.helpers({
	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	selectedSchoolYear: function() {
		return Session.get('selectedSchoolYear');
	},

	yearStatus: function(schoolYearId) {
		let subjectIds = Subjects.find({schoolYearId: schoolYearId}).map(subject => (subject._id));
		let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}}).count();
		let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, completed: true}).count();

		if (!lessonsCompletedTotal) {
			return 'txt-gray-darker';
		}
		if (lessonsTotal === lessonsCompletedTotal) {
			return 'txt-primary';
		}
		return 'txt-secondary';
	},

	terms: function() {
		return Session.get('selectedSchoolYear') && Terms.find({schoolYearId: Session.get('selectedSchoolYear')._id}, {sort: {order: 1}});
	},

	selectedTerm: function() {
		return Session.get('selectedTerm');
	},

	termStatus: function(selectedSchoolYearId, termId) {
		let subjectIds = Subjects.find({schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let weeksIds = Weeks.find({termId: termId}).map(week => (week._id))
		let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weeksIds}}).count();
		let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weeksIds}, completed: true}).count();

		if (!lessonsCompletedTotal) {
			return 'txt-gray-darker';
		}
		if (lessonsTotal === lessonsCompletedTotal) {
			return 'txt-primary';
		}
		return 'txt-secondary';
	},

	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},
});

Template.subbarYearTerm.events({
	'click .js-school-years'(event) {
		event.preventDefault();

		let schoolYearId = $(event.currentTarget).attr('id');
		if (schoolYearId != Session.get('selectedSchoolYear')._id) {
			Session.set('selectedSchoolYear', SchoolYears.findOne({_id: schoolYearId}));
			Session.set('selectedTerm', Terms.findOne({schoolYearId: schoolYearId}, {sort: {order: 1,}}));
			Session.set('selectedWeek', Weeks.findOne({termId: Session.get('selectedTerm')._id}, {sort: {order: 1,}}));
		}
	},

	'click .js-terms'(event) {
		event.preventDefault();

		let termId = $(event.currentTarget).attr('id');
		if (termId != Session.get('selectedTerm')._id) {
			Session.set('selectedTerm', Terms.findOne({_id: termId}));
			Session.set('selectedWeek', Weeks.findOne({termId: termId}, {sort: {order: 1,}}));
		}
	},
});

