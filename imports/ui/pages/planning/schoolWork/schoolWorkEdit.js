import {Template} from 'meteor/templating';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import { Students } from '../../../../api/students/students.js';
import { Resources } from '../../../../api/resources/resources.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';
import './schoolWorkEdit.html';

LocalResources = new Mongo.Collection(null);

Template.schoolWorkEdit.onCreated( function() {
	// Subscriptions
	this.schoolWorkData = this.subscribe('schoolWork', FlowRouter.getParam('selectedSchoolWorkId'), function() {
		Session.set('schoolYearId', SchoolWork.findOne({_id: FlowRouter.getParam('selectedSchoolWorkId')}).schoolYearId)
	});
	this.studentData = this.subscribe('allStudents');
	this.schoolYearData = this.subscribe('allSchoolYears');
	this.termData = this.subscribe('allTerms');
	this.weekData = this.subscribe('allWeeks');
	this.lessonData = this.subscribe('schoolWorkLessons', FlowRouter.getParam('selectedSchoolWorkId'));

	let template = Template.instance();

	template.schoolWorkId = new ReactiveVar(FlowRouter.getParam('selectedSchoolWorkId'))
	template.searchQuery = new ReactiveVar();
	template.searching   = new ReactiveVar( false );

	template.autorun( () => {
		template.subscribe('schoolWorkResources', template.schoolWorkId.get(), () => {
	    	LocalResources.remove({});
			Resources.find().forEach(function(resource) {
				LocalResources.insert({id: resource._id, type: resource.type, title: resource.title});
			});
			template.schoolWorkId.set('');
	    })
	})

	template.autorun( () => {
		template.subscribe( 'searchResources', template.searchQuery.get(), () => {
		  setTimeout( () => {
		    template.searching.set( false );
		  }, 500 );
		});
	});
});

Template.schoolWorkEdit.onRendered( function() {
	let template = Template.instance();

	Session.set({
		toolbarType: 'edit',
		labelThree: 'Edit School Work',
		activeNav: 'planningList',
	});

	// Form Validation and Submission
	$('.js-form-school-work-update').validate({
		rules: {
			name: { required: true },
			timesPerWeek: { number: true, max: 7 },
		},
		
		messages: {
			name: { required: "Required." },
			timesPerWeek: { number: "Number Required.", max: 'Limit 7.' },
		},

		submitHandler() {
			$('.js-updating').show();
			$('.js-submit').prop('disabled', true);

			let resourceIds = [];
			LocalResources.find().forEach(function(resource) {
				resourceIds.push(resource.id);
			});

			const schoolWorkProperties = {
				name: template.find("[name='name']").value.trim(),
				description: Session.get($(event.currentTarget).find('.editor-content').attr('id')),
				resources: resourceIds,
				studentId: FlowRouter.getParam('selectedStudentId'),
				schoolYearId: FlowRouter.getParam('selectedSchoolYearId'),
			}

			let newLessonProperties = [];
			$("[name='timesPerWeek']").each(function(index) {
				for (i = 0; i < parseInt(this.value); i++) { 
				    newLessonProperties.push({order: parseFloat((index + 1) + '.' + (i + 1)), weekId: this.dataset.weekId});
				}
			})

			let lessons = Lessons.find({schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}, {sort: {completed: -1, order: 1}});

			if (lessons.count() > newLessonProperties.length) {
				// Find Removeable Lessons
				let dif = lessons.count() - newLessonProperties.length;
				let removeLessons = Lessons.find({
					$and: [{
						completedOn: null,
					    completionTime: null,
					    description: null,
					}]
				}, {sort: {order: -1}, limit: dif});

				var removeLessonIds = removeLessons.map(lesson => (lesson._id));

				// Determine If Lessons Can Be Removed
				if (dif > removeLessonIds.length) {
					let overLessons = removeLessonIds.length - dif;
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: "These changes would delete lessons you have already worked on. Add at least " + overLessons + " lessons to the schoolWork.",
					});
					return false;
				}

				// Reorder Remaining Lessons And Assign to Weeks
				let currentLessonProperties = Lessons.find({_id: {$nin: removeLessonIds}, schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}, {sort: {completed: -1, order: 1}})
				var updateLessonProperties = [];
				var insertLessonProperties = [];
				currentLessonProperties.forEach(function(property, index) {
					property.order = newLessonProperties[index].order;
					property.weekId = newLessonProperties[index].weekId;
					updateLessonProperties.push(property)
				});

			} else if (lessons.count() < newLessonProperties.length) {
				// Create needed Number of New Lessons Needed
				let dif = newLessonProperties.length - lessons.count();

				let currentLessonProperties = Lessons.find({schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}, {sort: {completed: -1, order: 1}}).fetch();
				for (i = 0; i < dif; i++) { 
				    currentLessonProperties.push({order: parseFloat((i + lessons.count()) + '.' + (i + 1)), weekId: null});
				}

				// Reorder Remaining Lessons And Assign to Weeks
				let schoolWorkId = FlowRouter.getParam('selectedSchoolWorkId');
				let allLessonProperties = []
				currentLessonProperties.forEach(function(property, index) {
					property.order = newLessonProperties[index].order;
					property.weekId = newLessonProperties[index].weekId;
					property.schoolWorkId = schoolWorkId;
					allLessonProperties.push(property);
				});

				// Seperate Update Lessons from Insert Lessons
				let startSlice = lessons.count();
				let endSlice = 0 - dif;

				var updateLessonProperties = allLessonProperties.slice(0, startSlice);
				var insertLessonProperties = allLessonProperties.slice(endSlice);
				var removeLessonIds = [];

			} else {
				let currentLessonProperties = Lessons.find({schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}, {sort: {completed: -1, order: 1}})
				var updateLessonProperties = [];
				var insertLessonProperties = [];
				var removeLessonIds = [];
				currentLessonProperties.forEach(function(property, index) {
					property.order = newLessonProperties[index].order;
					property.weekId = newLessonProperties[index].weekId;
					updateLessonProperties.push(property)
				});

			}

			Meteor.call('updateSchoolWork', FlowRouter.getParam('selectedSchoolWorkId'), schoolWorkProperties, function(error, schoolWorkId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					if (insertLessonProperties.length) {
						Meteor.call('batchInsertLessons', insertLessonProperties, function(error) {
							if (error) {
								Alerts.insert({
									colorClass: 'bg-danger',
									iconClass: 'fss-danger',
									message: error.reason,
								});
					
								$('.js-updating').hide();
								$('.js-submit').prop('disabled', false);
							}
						});
					}

					if (removeLessonIds.length) {
						Meteor.call('batchRemoveLessons', removeLessonIds, function(error) {
							if (error) {
								Alerts.insert({
									colorClass: 'bg-danger',
									iconClass: 'fss-danger',
									message: error.reason,
								}); 
					
								$('.js-updating').hide();
								$('.js-submit').prop('disabled', false);
							}
						});
					}

					Meteor.call('batchUpdateLessons', updateLessonProperties, function(error) {
						if (error) {
							Alerts.insert({
								colorClass: 'bg-danger',
								iconClass: 'fss-danger',
								message: error.reason,
							});
					
							$('.js-updating').hide();
							$('.js-submit').prop('disabled', false);
						} else {
							$('.js-updating').hide();
							$('.js-submit').prop('disabled', false);
							FlowRouter.go('/planning/schoolWork/view/3/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ schoolWorkId);
						}
					});
				}
			});

			return false;
		}
	});
})

Template.schoolWorkEdit.helpers({
	subscriptionReady: function() {
		if (Template.instance().schoolWorkData.ready() && Template.instance().studentData.ready() && Template.instance().schoolYearData.ready() && Template.instance().termData.ready() && Template.instance().weekData.ready() && Template.instance().lessonData.ready()) {
			return true;
		}
	},
	
	selectedSchoolWork: function() {
		return SchoolWork.findOne({_id: FlowRouter.getParam('selectedSchoolWorkId')});
	},

	selectedStudent: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	terms: function() {
		return Terms.find({schoolYearId: Session.get('schoolYearId')}, {sort: {order: 1}});
	},

	weeks: function(termId) {
        return Weeks.find({termId: termId});
	},

	weekCount: function(termId) {
        return Weeks.find({termId: termId}).count();
	},

	isSelected: function(termId, value) {
		let weekIds = Weeks.find({termId: termId}).map(week => (week._id));
		let lessonCounts = [];
		weekIds.forEach(function(weekId) {
			lessonCounts.push(Lessons.find({weekId: weekId, schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}).count());
		})

		if (_.uniq(lessonCounts).length === 1) {
			if (value === lessonCounts[0]) {
				return 'selected';
			};
		}
		if (value === 'random') {
			return 'selected';
		}
	},

	isRandom: function(termId) {
		let weekIds = Weeks.find({termId: termId}).map(week => (week._id));
		let lessonCounts = [];
		weekIds.forEach(function(weekId) {
			lessonCounts.push(Lessons.find({weekId: weekId, schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}).count());
		})

		if (_.uniq(lessonCounts).length === 1) {
			return false;
		}
		return true;
	},

	lessonCount: function(weekId) {
        return Lessons.find({weekId: weekId, schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}).count();
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

	cancelPath: function() {
		return '/planning/schoolWork/view/3/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedSchoolWorkId');
	},
});

Template.schoolWorkEdit.events({
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

	'click .js-show-individual-weeks'(event) {
		event.preventDefault();
		let termOrder = $(event.currentTarget).attr('id');
		$('.js-label-' + termOrder).toggle();
		$('.js-' + termOrder).slideToggle('fast');
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
				message: '"' +localResource.title + '" is already attached to this schoolWork.',
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

	'submit .js-form-school-work-update'(event) {
		event.preventDefault();
	},
});









