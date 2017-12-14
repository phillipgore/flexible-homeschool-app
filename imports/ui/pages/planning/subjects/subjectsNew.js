import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import { Resources } from '../../../../api/resources/resources.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Debounce } from 'lodash'
import './subjectsNew.html';

LocalResources = new Mongo.Collection(null);

Template.subjectsNew.onCreated( () => {
	let template = Template.instance();

	template.searchQuery = new ReactiveVar();
	template.searching   = new ReactiveVar( false );

	template.autorun( () => {
		template.subscribe( 'searchResources', template.searchQuery.get(), () => {
		  setTimeout( () => {
		    template.searching.set( false );
		  }, 500 );
		});
	});
});

Template.subjectsNew.onRendered( function() {
	// Resources Input Settings
	LocalResources.remove({});

	// Subscriptions
	Meteor.subscribe('allStudents');
	Meteor.subscribe('allSchoolYears');
	Meteor.subscribe('allTerms');

	// School Year Id Settings
	Session.set({schoolYearId: ''})

	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'New Subject',
		rightUrl: '',
		rightIcon: '',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
})

Template.subjectsNew.helpers({
	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	currentSchoolYear: function() {
		return SchoolYears.findOne({_id: Session.get('schoolYearId')}, {sort: {startYear: 1}});
	},

	terms: function() {
		return Terms.find({schoolYearId: Session.get('schoolYearId')}, {sort: {order: 1}});
	},

	weeks: function(weekCount) {
		weeks = []
		for (let i = 0; i < weekCount; i++) {
			let number = i + 1;
            weeks.push({number: number, label: 'Week ' + number});
        }
        return weeks;
	},

	searching() {
		return Template.instance().searching.get();
	},

	query() {
		return Template.instance().searchQuery.get();
	},

	resources() {
		let resources = Resources.find();
		if (resources) {
			return resources;
		}
	},

	localResources() {
		return LocalResources.find();
	}
});

Template.subjectsNew.events({
	'change .js-school-year-id'(event) {
		Session.set({schoolYearId: event.currentTarget.value})
	},

	'change .js-times-per-week-preset'(event) {
		$('#' + event.currentTarget.dataset.termId).find('.js-times-per-week').val(event.currentTarget.value);
	},

	'change .js-times-per-week'(event) {
		$('.js-times-per-week-preset option').removeProp('selected');
		$('.js-times-per-week-preset option:disabled').prop('selected', true);
	},

	'keyup #search-resources'(event, template) {
		let value = event.currentTarget.value.trim();

		if ( value !== '' ) {
			template.searchQuery.set( value );
			template.searching.set( true );
		}

		if ( value === '' ) {
			template.searchQuery.set( value );
		}
	},

	'click .js-clear-search'(event, template) {
		event.preventDefault();

		$('#search-resources').val('');
		template.searchQuery.set('');
		template.searching.set(false);
	},

	'click .js-add-resource'(event, template) {
		event.preventDefault();

		let resource = Resources.findOne({_id: event.currentTarget.id});
		console.log(resource.type)
		LocalResources.insert({id: resource._id, type: resource.type, title: resource.title});

		$('#search-resources').val('');
		template.searchQuery.set('');
		template.searching.set(false);
	},

	'click .js-remove-resource'(event) {
		event.preventDefault();

		LocalResources.remove({id: event.currentTarget.id});
	}
});