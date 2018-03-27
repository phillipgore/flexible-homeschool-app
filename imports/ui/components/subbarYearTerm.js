import {Template} from 'meteor/templating';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Weeks} from '../../api/weeks/weeks.js';
import moment from 'moment';
import './subbarYearTerm.html';

Template.subbarYearTerm.onCreated( function() {
	// Subscriptions
	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('allSchoolYears', () => {
			if (!Session.equals('selectedSchoolYear', '')) {
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
			if (!Session.equals('selectedTerm', '')) {
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

	terms: function() {
		return Session.get('selectedSchoolYear') && Terms.find({schoolYearId: Session.get('selectedSchoolYear')._id}, {sort: {order: 1}});
	},

	selectedTerm: function() {
		return Session.get('selectedTerm');
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

