import {Template} from 'meteor/templating';
import { Subjects } from '../../../../api/subjects/subjects.js';
import { Students } from '../../../../api/students/students.js';
import { Resources } from '../../../../api/resources/resources.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';
import './subjectsEdit.html';

LocalResources = new Mongo.Collection(null);

Template.subjectsEdit.onCreated( function() {
	// Subscriptions
	this.subjectData = this.subscribe('subject', FlowRouter.getParam('selectedSubjectId'), function() {
		Session.set('schoolYearId', Subjects.findOne({_id: FlowRouter.getParam('selectedSubjectId')}).schoolYearId)
	});
	this.studentData = this.subscribe('allStudents');
	this.schoolYearData = this.subscribe('allSchoolYears');
	this.termData = this.subscribe('allTerms');
	this.weekData = this.subscribe('allWeeks');
	this.lessonData = this.subscribe('subjectLessons', FlowRouter.getParam('selectedSubjectId'));

	let template = Template.instance();

	template.subjectId = new ReactiveVar(FlowRouter.getParam('selectedSubjectId'))
	template.searchQuery = new ReactiveVar();
	template.searching   = new ReactiveVar( false );

	template.autorun( () => {
		template.subscribe('subjectResources', template.subjectId.get(), () => {
	    	LocalResources.remove({});
			Resources.find().forEach(function(resource) {
				LocalResources.insert({id: resource._id, type: resource.type, title: resource.title});
			});
			template.subjectId.set('');
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

Template.subjectsEdit.onRendered( function() {
	let template = Template.instance();

	Session.set({
		toolbarType: 'edit',
		labelThree: 'Edit Subject',
		activeNav: 'planningList',
	});

	// Form Validation and Submission
	$('.js-form-subjects-update').validate({
		rules: {
			name: { required: true },
			timesPerWeek: { number: true },
		},
		messages: {
			name: { required: "Required." },
			timesPerWeek: { number: "" },
		},
		errorPlacement: function(error, element) {
			let placement = $(element).data('error');
			if (placement) {
				$(element).parent().addClass('error');
				$(placement).append(error)
			} else {
				error.insertAfter(element);
			}
		},

		submitHandler() {
			$('.js-updating').show();
			$('.js-submit').prop('disabled', true);

			let resourceIds = [];
			LocalResources.find().forEach(function(resource) {
				resourceIds.push(resource.id);
			});

			const subjectProperties = {
				name: template.find("[name='name']").value.trim(),
				description: template.find("[name='description']").value.trim(),
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

			let lessons = Lessons.find({subjectId: FlowRouter.getParam('selectedSubjectId')}, {sort: {completed: -1, order: 1}});

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
						message: "These changes would delete lessons you have already worked on. Add at least " + overLessons + " lessons to the subject.",
					});
					return false;
				}

				// Reorder Remaining Lessons And Assign to Weeks
				let currentLessonProperties = Lessons.find({_id: {$nin: removeLessonIds}, subjectId: FlowRouter.getParam('selectedSubjectId')}, {sort: {completed: -1, order: 1}})
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

				let currentLessonProperties = Lessons.find({subjectId: FlowRouter.getParam('selectedSubjectId')}, {sort: {completed: -1, order: 1}}).fetch();
				for (i = 0; i < dif; i++) { 
				    currentLessonProperties.push({order: parseFloat((i + lessons.count()) + '.' + (i + 1)), weekId: null});
				}

				// Reorder Remaining Lessons And Assign to Weeks
				let subjectId = FlowRouter.getParam('selectedSubjectId');
				let allLessonProperties = []
				currentLessonProperties.forEach(function(property, index) {
					property.order = newLessonProperties[index].order;
					property.weekId = newLessonProperties[index].weekId;
					property.subjectId = subjectId;
					allLessonProperties.push(property);
				});

				// Seperate Update Lessons from Insert Lessons
				let startSlice = lessons.count();
				let endSlice = 0 - dif;

				var updateLessonProperties = allLessonProperties.slice(0, startSlice);
				var insertLessonProperties = allLessonProperties.slice(endSlice);
				var removeLessonIds = [];

			} else {
				let currentLessonProperties = Lessons.find({subjectId: FlowRouter.getParam('selectedSubjectId')}, {sort: {completed: -1, order: 1}})
				var updateLessonProperties = [];
				var insertLessonProperties = [];
				var removeLessonIds = [];
				currentLessonProperties.forEach(function(property, index) {
					property.order = newLessonProperties[index].order;
					property.weekId = newLessonProperties[index].weekId;
					updateLessonProperties.push(property)
				});

			}

			Meteor.call('updateSubject', FlowRouter.getParam('selectedSubjectId'), subjectProperties, function(error, subjectId) {
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
							FlowRouter.go('/planning/subjects/view/3/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ subjectId);
						}
					});
				}
			});

			return false;
		}
	});
})

Template.subjectsEdit.helpers({
	subscriptionReady: function() {
		if (Template.instance().subjectData.ready() && Template.instance().studentData.ready() && Template.instance().schoolYearData.ready() && Template.instance().termData.ready() && Template.instance().weekData.ready() && Template.instance().lessonData.ready()) {
			return true;
		}
	},
	
	selectedSubject: function() {
		return Subjects.findOne({_id: FlowRouter.getParam('selectedSubjectId')});
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
			lessonCounts.push(Lessons.find({weekId: weekId, subjectId: FlowRouter.getParam('selectedSubjectId')}).count());
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
			lessonCounts.push(Lessons.find({weekId: weekId, subjectId: FlowRouter.getParam('selectedSubjectId')}).count());
		})

		if (_.uniq(lessonCounts).length === 1) {
			return false;
		}
		return true;
	},

	lessonCount: function(weekId) {
        return Lessons.find({weekId: weekId, subjectId: FlowRouter.getParam('selectedSubjectId')}).count();
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
		return '/planning/subjects/view/3/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedSubjectId');
	},
});

Template.subjectsEdit.events({
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
				message: '"' +localResource.title + '" is already attached to this subject.',
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

	'submit .js-form-subjects-update'(event) {
		event.preventDefault();
	},
});









