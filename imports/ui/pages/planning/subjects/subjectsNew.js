import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import { Resources } from '../../../../api/resources/resources.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import './subjectsNew.html';

LocalResources = new Mongo.Collection(null);

Template.subjectsNew.onCreated( function() {
	// Subscriptions
	this.subscribe('allStudents');
	this.subscribe('allSchoolYears');
	this.subscribe('allTerms');
	this.subscribe('allWeeks');

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

	// School Year Id Settings
	Session.set({schoolYearId: ''})

	// Toolbar Settings
	Session.set({
		label: 'New Subject',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');

	// Form Validation and Submission
	$('.js-form-subjects-new').validate({
		rules: {
			name: { required: true },
			schoolYearId: { required: true },
			timesPerWeek: { number: true },
		},
		messages: {
			name: { required: "Required." },
			schoolYearId: { required: "Required." },
			timesPerWeek: { number: "" },
		},
		errorPlacement: function(error, element) {
			var placement = $(element).data('error');
			if (placement) {
				$(element).parent().addClass('error');
				$(placement).append(error)
			} else {
				error.insertAfter(element);
			}
		},

		submitHandler() {
			$('.js-loading').show();
			$('.js-submit').prop('disabled', true);

			let resourceIds = []

			LocalResources.find().forEach(function(resource) {
				resourceIds.push(resource.id);
			});

			const subjectProperties = {
				name: event.target.name.value.trim(),
				description: event.target.description.value.trim(),
				resources: resourceIds,
				studentId: event.target.studentId.value.trim(),
				schoolYearId: event.target.schoolYearId.value.trim(),
			}

			let lessonProperties = []

			event.target.timesPerWeek.forEach(function(times, index) {
				for (i = 0; i < parseInt(times.value); i++) { 
				    lessonProperties.push({order: parseFloat((index + 1) + '.' + (i + 1)), weekId: times.dataset.weekId});
				}
			});

			Meteor.call('insertSubject', subjectProperties, function(error, subjectId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-loading').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					lessonProperties.forEach(function(lesson) {
						lesson.subjectId = subjectId;
					});

					Meteor.call('batchInsertLessons', lessonProperties, function(error) {
						if (error) {
							Alerts.insert({
								colorClass: 'bg-danger',
								iconClass: 'fss-danger',
								message: error.reason,
							});
					
							$('.js-loading').hide();
							$('.js-submit').prop('disabled', false);
						} else {
							FlowRouter.go('/planning/subjects/view/' + subjectId);
						}
					});
					
				}
			});

			return false;
		}
	});
})

Template.subjectsNew.helpers({
	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	terms: function() {
		return Terms.find({schoolYearId: Session.get('schoolYearId')}, {sort: {order: 1}});
	},

	weeks: function(termId) {
        return Weeks.find({termId: termId});
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
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},
});

Template.subjectsNew.events({
	'change .js-school-year-id'(event) {
		Session.set({schoolYearId: event.currentTarget.value})
	},

	'change .js-times-per-week-preset'(event) {
		$('#' + event.currentTarget.dataset.termId).find('.js-times-per-week').val(event.currentTarget.value);
	},

	'change .js-times-per-week'(event) {
		$('#' + event.currentTarget.dataset.termId + ' .js-times-per-week-preset option').removeProp('selected');
		$('#' + event.currentTarget.dataset.termId + ' .js-times-per-week-preset option:disabled').prop('selected', true);
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

		Alerts.remove({type: 'addResource'});
		$('#search-resources').val('');
		template.searchQuery.set('');
		template.searching.set(false);
	},

	'click .js-add-resource'(event, template) {
		event.preventDefault();

		let resource = Resources.findOne({_id: event.currentTarget.id});
		let localResource = LocalResources.findOne({id: resource._id})
		if (localResource) {
			Alerts.insert({
				type: 'addResource',
				colorClass: 'bg-warning',
				iconClass: 'fss-warning',
				message: '"' + localResource.title + ' is already attached to this subject.',
			});
		} else {
			LocalResources.insert({id: resource._id, type: resource.type, title: resource.title});

			Alerts.remove({type: 'addResource'});
			$('#search-resources').val('');
			template.searchQuery.set('');
			template.searching.set(false);
		}
	},

	'click .js-remove-resource'(event) {
		event.preventDefault();

		Alerts.remove({type: 'addResource'});
		LocalResources.remove({id: event.currentTarget.id});
	},

	'submit .js-form-subjects-new'(event) {
		event.preventDefault();
	},
});









