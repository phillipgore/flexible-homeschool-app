import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { SchoolWork } from '../../../api/schoolWork/schoolWork.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Lessons } from '../../../api/lessons/lessons.js';
import { Notes } from '../../../api/notes/notes.js';

import './trackingEdit.html';
import _ from 'lodash';


Template.trackingEdit.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		// Subscriptions
		this.trackingEditData = Meteor.subscribe('trackingEditPub', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedWeekId'));
	});
});

Template.trackingEdit.onRendered( function() {
	Session.set({
		selectedReportingTermId: FlowRouter.getParam('selectedTermId'),
		selectedReportingWeekId: FlowRouter.getParam('selectedWeekId'),
		toolbarType: 'edit',
		newUrl: '',
		activeNav: 'trackingList',
		existingTerm: FlowRouter.getParam('selectedTermId'),
		action: 'choose',
	});
});

Template.trackingEdit.helpers({
	subscriptionReady: function() {
		return Template.instance().trackingEditData.ready();
	},

	student: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')})
	},

	selectedTerm: function() {
		return Terms.findOne({_id: FlowRouter.getParam('selectedTermId')});
	},

	selectedTermId: function() {
		return FlowRouter.getParam('selectedTermId');
	},

	weeks: function() {
		return Weeks.find({}, {sort: {order: 1}});
	},

	selectedWeek: function() {
		return Weeks.findOne({_id: FlowRouter.getParam('selectedWeekId')});
	},

	selectedWeekId: function() {
		return FlowRouter.getParam('selectedWeekId');
	},

	weekLessonsExist: function() {
		if (Lessons.find({weekId: FlowRouter.getParam('selectedWeekId')}).count()) {
			return true;
		}
		return false;
	},

	schoolWorkOne: function() {
		let schoolWorkLimit = Math.ceil(SchoolWork.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}).count() / 2);
		return SchoolWork.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {name: 1}, limit: schoolWorkLimit});
	},

	schoolWorkTwo: function() {
		let schoolWorkSkip = Math.ceil(SchoolWork.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}).count() / 2);
		return SchoolWork.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {name: 1}, skip: schoolWorkSkip});
	},

	studentName(first, last) {
		if (first && last) {
			Session.set({labelTwo: first + ' ' + last});
		}
		return false;
	},

	activeSelectItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},

	existingTerm: function() {
		return Session.get('existingTerm');
	},

	existingWeeks: function(termId) {
		return Weeks.find({termId: termId})
	},
});

Template.trackingEdit.events({
	'change .js-checkbox-existing-append-notes, change .js-checkbox-new-append-notes'(event) {
		if ($(event.currentTarget).val() === 'true') {
			$(event.currentTarget).val('false');
		} else {
			$(event.currentTarget).val('true');
		}
	},

	'change .js-check-all'(event) {
		// console.log('wow')
		if ($(event.currentTarget).val() === 'true') {
			$(event.currentTarget).val('false');
			$('.js-segment-checkbox').each(function() {
				$(this).val('false').prop('checked', false);
			});
		} else {
			$(event.currentTarget).val('true');
			$('.js-segment-checkbox').each(function() {
				$(this).val('true').prop('checked', true);
			});
		}
	},

	'change .js-action'(event) {
		let action = event.currentTarget.value;

		Session.set('action', action);
		$('.js-action-data').hide();
		$('.js-' + action).fadeIn(300);
	},

	'change .js-existing-term'(event) {
		let termId= event.currentTarget.value;
		Session.set('existingTerm', termId);
	},

	'click .js-cancel'(event) {
		event.preventDefault();
		FlowRouter.go('/tracking/students/view/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedTermId') +'/'+ FlowRouter.getParam('selectedWeekId'))
	},

	'submit .js-tracking-update'(event) {
		event.preventDefault();

		// Set Stat Properties
		let statProperties = {
			studentIds: [FlowRouter.getParam('selectedStudentId')],
			schoolYearIds: [FlowRouter.getParam('selectedSchoolYearId')],
			termIds:[FlowRouter.getParam('selectedTermId')],
			weekIds:[FlowRouter.getParam('selectedWeekId')],
		}

		// Set Path Properties
		let pathProperties = {
			studentIds: [FlowRouter.getParam('selectedStudentId')],
			schoolYearIds: [FlowRouter.getParam('selectedSchoolYearId')],
			termIds: [FlowRouter.getParam('selectedTermId')],
		}

		// Get Checked Lessons
		let batchCheckedLessonProperties = [];

		$('.js-segment-checkbox').each(function() {
			if ($(this).val().trim() === 'true') {
				batchCheckedLessonProperties.push({ 
					_id: $(this).attr('data-lesson-id'),
					schoolWorkId: $(this).attr('data-schoolWork-id'),
					completed: $(this).attr('data-completed') === 'true',
					weekDay: $(this).attr('data-weekDay'),
					hadWeekDay: $(this).attr('data-hadWeekDay') === 'true',
				})
			}
		});

		// Get Unchecked Lessons from School Work with Checked Lesson
		let schoolWorkIds = _.uniq(batchCheckedLessonProperties.map(lesson => lesson.schoolWorkId));
		let batchUncheckedLessonProperties = [];

		schoolWorkIds.forEach(workId => {
			$('#js-schoolWork-track-' + workId).find('.js-segment-checkbox').each(function() {
				if ($(this).val().trim() != 'true') {
					batchUncheckedLessonProperties.push({ 
						_id: $(this).attr('data-lesson-id'),
						schoolWorkId: $(this).attr('data-schoolWork-id'),
						completed: $(this).attr('data-completed') === 'true',
						weekDay: $(this).attr('data-weekDay'),
						hadWeekDay: $(this).attr('data-hadWeekDay') === 'true',
					})
				}
			})
		});

		// console.log('batchCheckedLessonProperties');
		// console.log(batchCheckedLessonProperties);
		// console.log('batchUncheckedLessonProperties');
		// console.log(batchUncheckedLessonProperties);

		let action = $('.js-action').val();

		// No Choice ----------------------------------------------------------------------
		if (action === 'choose') {
			console.log('choose');

			Alerts.insert({
				colorClass: 'bg-info',
				iconClass: 'icn-info',
				message: 'You must select an action or click "Cancel".',
			});
			
			return false;
		}

		if (action === 'labels') {
			console.log('labels');
		}


		if (batchCheckedLessonProperties.length) {

			// Insert ----------------------------------------------------------------------
			if (action === 'insert') {
				console.log('insert');

				$('.js-updating').show();
				$('.js-submit').prop('disabled', true);

				let newLessons = [];
				let week = Weeks.findOne({_id: FlowRouter.getParam('selectedWeekId')});
				let term = Terms.findOne({_id: FlowRouter.getParam('selectedTermId')});

				batchCheckedLessonProperties.forEach(lesson => {
					newLessons.push({
						_id: lesson._id,
						order: lesson.weekDay,
						weekDay: lesson.weekDay,
						assigned: false,
						completed: false,
						studentId: FlowRouter.getParam('selectedStudentId'),
						schoolYearId: FlowRouter.getParam('selectedSchoolYearId'),
						schoolWorkId: lesson.schoolWorkId,
						termId: FlowRouter.getParam('selectedTermId'),
						weekId: FlowRouter.getParam('selectedWeekId'),
						weekOrder: week.order,
						termOrder: term.order,
						groupId: Meteor.user().info.groupId, 
						userId: Meteor.user()._id, 
						createdOn: new Date(),
						hadWeekDay: lesson.hadWeekDay,
					})
				})

				let hasWeekDay = [];
				let noWeekDay = [];

				newLessons.forEach(lesson => {
					if (lesson.hadWeekDay) {
						hasWeekDay.push(lesson) 
					} else {
						noWeekDay.push(lesson) 	
					}
				})
				
				let weekDaySchoolWorkIds = _.uniq(hasWeekDay.map(lesson => lesson.schoolWorkId));
				let weekDayLessons = Lessons.find({schoolWorkId: {$in: weekDaySchoolWorkIds}, weekId: FlowRouter.getParam('selectedWeekId'), studentId: FlowRouter.getParam('selectedStudentId')}, {fields: {order: 1, weekDay: 1}}).fetch();
				let allHaveWeekDay = hasWeekDay.concat(weekDayLessons)
				
				allHaveWeekDay.forEach(lesson => {
					lesson.order = lesson.weekDay
				});

				let noWeekDaySchoolWorkIds = _.uniq(noWeekDay.map(lesson => lesson.schoolWorkId));

				noWeekDaySchoolWorkIds.forEach(schoolWorkId => {
					let lessonCount = Lessons.find({schoolWorkId: schoolWorkId, weekId: FlowRouter.getParam('selectedWeekId'), studentId: FlowRouter.getParam('selectedStudentId')}, {fields: {order: 1, weekDay: 1}}).count()
					noWeekDay.filter(lesson => lesson.schoolWorkId === schoolWorkId).forEach((lesson, index) => {
						lesson.order = lessonCount + index + 1;
						lesson.weekDay = 0;
					});
				});

				let upsertLessons = allHaveWeekDay.concat(noWeekDay);
				let bulkUpsertLessons = []

				upsertLessons.forEach(lesson => {
					delete lesson.hadWeekDay;
					bulkUpsertLessons.push({updateOne: 
						{ 
							filter: {_id: lesson._id}, 
							update: {$set: lesson}, 
							upsert:true 
						} 
					});
				})

				Meteor.call('batchUpdateLessons', bulkUpsertLessons, [], function(error, result) {
					if (error) {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'icn-danger',
							message: error.reason,
						});
						$('.js-updating').hide();
						$('.js-submit').prop('disabled', false);
					} else {
						FlowRouter.go('/tracking/students/view/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedTermId') +'/'+ FlowRouter.getParam('selectedWeekId'))
					}
				});
			

				

				// if (!LocalLessons.find().count()) {
				// 	Alerts.insert({
				// 		colorClass: 'bg-info',
				// 		iconClass: 'icn-info',
				// 		message: 'You must insert at least one new segment or click "Cancel".',
				// 	});
				// } else {
				// 	$('.js-updating').show();
				// 	$('.js-submit').prop('disabled', true);

				// 	let bulkLessonProperties =[]

				// 	LocalLessons.find().forEach(lessonProperties => {
				// 		bulkLessonProperties.push({insertOne: {"document": lessonProperties}})
				// 	})

				// 	Meteor.call('bulkInsertLessons', bulkLessonProperties, function(error, result) {
				// 		if (error) {
				// 			Alerts.insert({
				// 				colorClass: 'bg-danger',
				// 				iconClass: 'icn-danger',
				// 				message: error.reason,
				// 			});
				// 			$('.js-updating').hide();
				// 			$('.js-submit').prop('disabled', false);
				// 		} else {
				// 			LocalLessons.remove({});
				// 			FlowRouter.go('/tracking/students/view/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedTermId') +'/'+ FlowRouter.getParam('selectedWeekId'))
				// 		}
				// 	});
				// }

				return false;
			}


			// Complete ----------------------------------------------------------------------
			if (action === 'complete') {
				console.log('complete');

				$('.js-updating').show();
				$('.js-submit').prop('disabled', true);

				batchCheckedLessonProperties.forEach(lesson => {
					lesson.completed = true;
				})
				// console.log('complete');
			}


			// Incomplete ----------------------------------------------------------------------
			if (action === 'incomplete') {
				console.log('incomplete');

				$('.js-updating').show();
				$('.js-submit').prop('disabled', true);

				batchCheckedLessonProperties.forEach(lesson => {
					lesson.completed = false;
				})
			}


			// Assigned ----------------------------------------------------------------------
			if (action === 'assigned') {
				console.log('assigned');

				$('.js-updating').show();
				$('.js-submit').prop('disabled', true);
				
				batchCheckedLessonProperties.forEach(lesson => {
					lesson.assigned = true;
				})
			}


			// Unassigned ----------------------------------------------------------------------
			if (action === 'unassigned') {
				console.log('unassigned');

				$('.js-updating').show();
				$('.js-submit').prop('disabled', true);
				
				batchCheckedLessonProperties.forEach(lesson => {
					lesson.assigned = false;
				})
			}


			// Existing Week ----------------------------------------------------------------------
			if (action === 'existing') {
				console.log('existing');

				$('.js-updating').show();
				$('.js-submit').prop('disabled', true);

				let weekId = $('.js-existing-week').val();
				let week = Weeks.findOne({_id: weekId});
				let term = Terms.findOne({_id: week.termId});
				
				let lessonStats = []
				schoolWorkIds.forEach(schoolWorkId => {
					let lessonCount = _.filter(batchCheckedLessonProperties, ['schoolWorkId', schoolWorkId]).length;
					lessonStats.push({schoolWorkId: schoolWorkId, lessonCount: lessonCount});
				})

				console.log($('.js-checkbox-existing-append-notes').val().trim() === 'true')
				function getNoteProperties() {
					if ($('.js-checkbox-existing-append-notes').val().trim() === 'true') {
						let notes = Notes.find({schoolWorkId: {$in: schoolWorkIds}, weekId: FlowRouter.getParam('selectedWeekId')}).fetch()
						notes.forEach(note => {
							note.weekId = weekId;
						})
						return notes;	
					}
					return [];
				}

				function notePlacement() {
					let currentWeekOrder = Weeks.findOne({_id: FlowRouter.getParam('selectedWeekId')}).order
					let newWeekOrder = Weeks.findOne({_id: weekId}).order
					if (newWeekOrder > currentWeekOrder) {
						return 'append';
					}
					return 'prepend';
				}
				console.log(getNoteProperties())
				console.log(notePlacement())

				Meteor.call('checkSpecificWeek', weekId, lessonStats, function(error, newLessonStats) {
					if (error) {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'icn-danger',
							message: error.reason,
						});
					} else {
						console.log('newLessonStats');
						console.log(newLessonStats);

						let error = [];
						newLessonStats.forEach(lessonStat => {
							if (lessonStat.lessonCount >= 8) {
								error.push('error');

								$('#js-schoolWork-track-' + lessonStat.schoolWorkId).find('.track-icon i').addClass('txt-danger-dark');
								$('#js-schoolWork-track-' + lessonStat.schoolWorkId).find('.track-label').addClass('txt-danger-dark');
								$('#js-schoolWork-track-' + lessonStat.schoolWorkId).find('.error').text(`School Work can only have 7 segments per week. This change would make ${lessonStat.lessonCount} segments for this item of School Work in the newly selected week.`);
							}
						})

						if (error.length) {
							error = [];
							$('.js-updating').hide();
							$('.js-submit').prop('disabled', false);
							return false;
						} else {
							statProperties.termIds.push(term._id);
							statProperties.weekIds.push(weekId);
							pathProperties.termIds.push(term._id);

							batchCheckedLessonProperties.forEach((lesson, index) => {
								lesson.order = _.find(newLessonStats, ['schoolWorkId', lesson.schoolWorkId]).newWeekLessonCount + index + 1;
								lesson.weekOrder = week.order;
								lesson.termOrder = term.order;
								lesson.termId = term._id;
								lesson.weekId = weekId;
							});

							schoolWorkIds.forEach(workId => {
								let lessons = _.filter(batchUncheckedLessonProperties, {'schoolWorkId': workId});
								lessons.forEach((lesson, index) => {
									lesson.order = index + 1
								});
							});

							console.log('batchCheckedLessonProperties');
							console.log(batchCheckedLessonProperties);
							console.log('batchUncheckedLessonProperties');
							console.log(batchUncheckedLessonProperties);
							console.log('notProperties')
							console.log(getNoteProperties())
							console.log('notePlacement')
							console.log(notePlacement())

							Meteor.call('batchMoveLessonsToExistingWeek', batchCheckedLessonProperties, batchUncheckedLessonProperties, getNoteProperties(), notePlacement(), function(error, result) {
								if (error) {
									Alerts.insert({
										colorClass: 'bg-danger',
										iconClass: 'icn-danger',
										message: error.reason,
									});
									$('.js-updating').hide();
									$('.js-submit').prop('disabled', false);
								} else {
									Meteor.call('runUpsertSchoolWorkPathsAndStats', pathProperties, statProperties, function() {
										if (error) {
											Alerts.insert({
												colorClass: 'bg-danger',
												iconClass: 'icn-danger',
												message: error.reason,
											});
											$('.js-updating').hide();
											$('.js-submit').prop('disabled', false);
										} else {
											FlowRouter.go('/tracking/students/view/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedTermId') +'/'+ FlowRouter.getParam('selectedWeekId'))
										}
									})
								}
							});
						}
					}
				})

				// console.log('specfic');
				return false;
			}


			// New Week ----------------------------------------------------------------------
			if (action === 'new') {
				console.log('new');

				$('.js-updating').show();
				$('.js-submit').prop('disabled', true);
				
				let termId = $('.js-move-term').val();
				let term = Terms.findOne({_id: termId});
				let lastWeek = Weeks.findOne({termId: termId}, {sort: {order: -1}});

				let weekProperties = {
					order: lastWeek.order + 1,
					termOrder: term.order,
					schoolYearId: FlowRouter.getParam('selectedSchoolYearId'),
					termId: termId
				}

				Meteor.call('insertWeeks', weekProperties, function(error, weekId) {
					if (error) {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'icn-danger',
							message: error.reason,
						});
					} else {
						statProperties.weekIds.push(weekId);

						schoolWorkIds.forEach(workId => {
							let lessons = _.orderBy(_.filter(batchCheckedLessonProperties, {'schoolWorkId': workId}), ['completed', 'order'], ['desc', 'asc']);
							lessons.forEach((lesson, index) => {
								lesson.order = index + 1;
								lesson.weekOrder = lastWeek.order + 1;
								lesson.termOrder = term.order;
								lesson.termId = termId;
								lesson.weekId = weekId;
							});
						});

						schoolWorkIds.forEach(workId => {
							let lessons = _.filter(batchUncheckedLessonProperties, {'schoolWorkId': workId});
							lessons.forEach((lesson, index) => {
								lesson.order = index + 1
							});
						});

						let lessonProperties = batchCheckedLessonProperties.concat(batchUncheckedLessonProperties);

						function getNoteProperties() {
							if ($('.js-checkbox-new-append-notes').val().trim() === 'true') {
								let notes = Notes.find({schoolWorkId: {$in: schoolWorkIds}, weekId: FlowRouter.getParam('selectedWeekId')}).fetch()
								notes.forEach(note => {
									note.weekId = weekId;
									delete note._id;
								})
								return notes;	
							}
							return [];
						}
						
						console.log('batchCheckedLessonProperties');
						console.log(batchCheckedLessonProperties);
						console.log('batchUncheckedLessonProperties');
						console.log(batchUncheckedLessonProperties);
						console.log('lessonProperties');
						console.log(lessonProperties);
						console.log('notProperties');
						console.log(getNoteProperties());

						Meteor.call('batchUpdateLessons', lessonProperties, getNoteProperties(), function(error, result) {
							if (error) {
								Alerts.insert({
									colorClass: 'bg-danger',
									iconClass: 'icn-danger',
									message: error.reason,
								});
								$('.js-updating').hide();
								$('.js-submit').prop('disabled', false);
							} else {
								Meteor.call('runUpsertSchoolWorkPathsAndStats', pathProperties, statProperties, function() {
									if (error) {
										Alerts.insert({
											colorClass: 'bg-danger',
											iconClass: 'icn-danger',
											message: error.reason,
										});
										$('.js-updating').hide();
										$('.js-submit').prop('disabled', false);
									} else {
										FlowRouter.go('/tracking/students/view/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedTermId') +'/'+ FlowRouter.getParam('selectedWeekId'))
									}
								})
							}
						});
					}
				});

				// console.log('move');
				return false;
			}


			// Delete ----------------------------------------------------------------------
			if (action === 'delete') {
				function pluralizeSegment() {
					if (batchCheckedLessonProperties.length > 1) {
						return 'these segments'
					}
					return 'this segment'
				}

				Dialogs.insert({
					heading: 'Confirmation',
					message: 'Are you sure you want to delete ' + pluralizeSegment() + '?',
					confirmClass: 'js-delete js-delete-segment-confirmed',
				});

				return false;
			}


		} else {
			// No Segments Selected ----------------------------------------------------------------------
			Alerts.insert({
				colorClass: 'bg-info',
				iconClass: 'icn-info',
				message: 'You must check at least one segment or click "Cancel".',
			});

			return false;
		}

		console.log(batchCheckedLessonProperties)

		// Batch Update Lessons
		Meteor.call('batchUpdateLessons', batchCheckedLessonProperties, [], function(error, result) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
				$('.js-updating').hide();
				$('.js-submit').prop('disabled', false);
			} else {
				Meteor.call('runUpsertSchoolWorkPathsAndStats', pathProperties, statProperties, function() {
					if (error) {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'icn-danger',
							message: error.reason,
						});
						$('.js-updating').hide();
						$('.js-submit').prop('disabled', false);
					} else {
						FlowRouter.go('/tracking/students/view/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedTermId') +'/'+ FlowRouter.getParam('selectedWeekId'))
					}
				})
			}
		});
	},
});











