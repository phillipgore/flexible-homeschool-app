import {Paths} from '../../api/paths/paths.js';
import {Stats} from '../../api/stats/stats.js';
import {Groups} from '../../api/groups/groups.js';
import {Students} from '../../api/students/students.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Resources} from '../../api/resources/resources.js';
import {Lessons} from '../../api/lessons/lessons.js';
import {Reports} from '../../api/reports/reports.js';

import {primaryInitialIds} from '../../modules/server/initialIds';
import {resourcesInitialIds} from '../../modules/server/initialIds';
import {usersInitialId} from '../../modules/server/initialIds';
import {reportsInitialId} from '../../modules/server/initialIds';
import {groupsInitialId} from '../../modules/server/initialIds';

import moment from 'moment';
import _ from 'lodash'

Migrations.add({
	version: 1,
	name: 'Add schoolWorkId to Lessons. Remove subjectId from Lessons.',
	up: function() {
		Lessons.find().forEach(lesson => {
			let schoolWorkId = lesson.subjectId;
			Lessons.update({_id: lesson._id}, {$set: {schoolWorkId: schoolWorkId}, $unset: {subjectId: ''}})
		})
	}
});

Migrations.add({
	version: 2,
	name: 'Add Stripe coupon data.',
	up: function() {
		console.log('migration 2')
		Groups.find().forEach(group => {
			let stripeSubscriptionId = group.stripeSubscriptionId;
			if (!_.isUndefined(stripeSubscriptionId)) {
				Meteor.call('getSubscription', stripeSubscriptionId, function(error, result) {
					if (error) {
						console.log(error)
					} else {
						let updatedGroupProperties = {
							subscriptionStatus: group.subscriptionStatus,
							stripeCardId: group.stripeCardId,
							stripeCouponCodes: group.stripeCouponCodes,
							stripeCurrentCouponCode: {
								startDate: result.discount.start,
								endDate: result.discount.end,
								id: result.discount.coupon.id,
								amountOff: result.discount.coupon.amount_off,
								percentOff: result.discount.coupon.percent_off,
							},
						};

						Groups.update(group._id, {$set: updatedGroupProperties}, function(error, result) {
							if (error) {
								console.log(error);
							} else {
								return result;
							}
						});
					}
				})
			}
		})
	}
});

Migrations.add({
	version: 3,
	name: 'Delete lessons that reference missing weeks.',
	up: function() {
		let refWeekIds = _.uniq(Lessons.find().map(lesson => lesson.weekId));
		let weekIds = _.uniq(Weeks.find().map(week => week._id));
		refWeekIds.forEach(weekId => {
			if (_.indexOf(weekIds, weekId) < 0) {
				console.log(weekId);
				Lessons.remove({weekId: weekId})
			}
		})
	}
});

Migrations.add({
	version: 4,
	name: 'Add Foreign Id fields to Weeks and Lessons.',
	up: function() {
		let weeks = Weeks.find({}, {fields: {termId: 1}}).fetch();
		let terms = Terms.find({}, {fields: {schoolYearId: 1}}).fetch();

		weeks.forEach(week => {
			let schoolYearId = _.filter(terms, ['_id', week.termId])[0].schoolYearId;
			Weeks.update(week._id, {$set: {schoolYearId: schoolYearId}});
		});

		let lessons = Lessons.find({}, {fields: {_id: 1, schoolWorkId: 1, weekId: 1}});
		let schoolWork = SchoolWork.find({}, {fields: {studentId: 1, schoolYearId: 1}}).fetch();

		lessons.forEach(lesson => {
			let schoolWorkProperties = _.filter(schoolWork, ['_id', lesson.schoolWorkId])[0];
			let termId = _.filter(weeks, ['_id', lesson.weekId])[0].termId;

			let lessonProperties = {
				studentId: schoolWorkProperties.studentId,
				schoolYearId: schoolWorkProperties.schoolYearId,
				termId: termId,
			}

			Lessons.update(lesson._id, {$set: lessonProperties})
		});
	}
});

Migrations.add({
	version: 5,
	name: 'Add orders to Weeks and Lessons.',
	up: function() {
		let terms = Terms.find({}, {fields: {order: 1}}).fetch();
		let weeks = Weeks.find({}, {fields: {order: 1, termId: 1}}).fetch()

		weeks.forEach(week => {
			let termOrder = _.find(terms, ['_id', week.termId]).order
			Weeks.update(week._id, {$set: {termOrder: termOrder}});
		});


		Lessons.find({deletedOn: { $exists: false }}, {fields: {order: 1, termId: 1, weekId: 1}}).forEach(lesson => {
			let termOrder = _.find(terms, ['_id', lesson.termId]).order
			let weekOrder = _.find(weeks, ['_id', lesson.weekId]).order

			let lessonOrderString = lesson.order.toString();
			let lessonDotIndex = lessonOrderString.indexOf('.') + 1;
			let lessonOrder = parseInt(lessonOrderString.slice(lessonDotIndex));

			Lessons.update(lesson._id, {$set: {termOrder: termOrder, weekOrder: weekOrder, order: lessonOrder}});
		});
	}
});

Migrations.add({
	version: 6,
	name: 'Add intial ids to Group collection',
	up: function() {
		let year = moment().year();
		let month = moment().month();

		function startYearFunction(year) {
			if (month < 6) {
				return year = (year - 1).toString();
			}
			return year.toString();
		}
		let currentYear = startYearFunction(year)

		Groups.find({}, {fields: {appAdmin: 1}}).forEach(group => {
			
			primaryInitialIds(group._id);
			resourcesInitialIds(group._id);
			usersInitialId(group._id);
			reportsInitialId(group._id);
			groupsInitialId(group._id);

		});
	}
});

Migrations.add({
	version: 7,
	name: 'Create Paths Collection.',
	up: function() {
		Groups.find({}, {fields: {_id: 1}}).forEach(group => {
			let groupId = group._id;

			let students = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {_id: 1}});
			let schoolYears = SchoolYears.find(
				{groupId: groupId, deletedOn: { $exists: false }}, 
				{sort: {startYear: 1}, fields: {_id: 1}}
			);

			students.forEach(student => {
				schoolYears.forEach(schoolYear => {
					let ids = {}
					ids.studentId = student._id;
					ids.schoolYearId = schoolYear._id;

					let firstIncompleteLesson = Lessons.findOne(
						{studentId: student._id, schoolYearId: schoolYear._id, completed: false, deletedOn: { $exists: false }},
						{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1}}
					);
					let firstCompletedLesson = Lessons.findOne(
						{studentId: student._id, schoolYearId: schoolYear._id, completed: true, deletedOn: { $exists: false }},
						{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1}}
					);

					if (firstIncompleteLesson) { // First Incomplete Lesson: True
						ids.firstTermId = firstIncompleteLesson.termId;
						ids.firstWeekId = firstIncompleteLesson.weekId;
					} else if (firstCompletedLesson) { // First Incomplete Lesson: false && First Complete Lesson: True
						ids.firstTermId = firstCompletedLesson.termId;
						ids.firstWeekId = firstCompletedLesson.weekId;
					} else { // First Incomplete Lesson: false && First Complete Lesson: False
						let firstTerm = Terms.findOne(
							{groupId: groupId, schoolYearId: schoolYear._id, deletedOn: { $exists: false }},
							{sort: {order: 1}, fields: {_id: 1}}
						)

						if (firstTerm) { // First Term: True
							ids.firstTermId = firstTerm._id
							let firstWeek = Weeks.findOne(
								{groupId: groupId, schoolYearId: schoolYear._id, termId: firstTerm._id, deletedOn: { $exists: false }},
								{sort: {order: 1}, fields: {_id: 1}}
							)
							if (firstWeek) {ids.firstWeekId = firstWeek._id} else {ids.weekId = 'empty'};
						} else { // First Term: False
							ids.firstTermId = 'empty'
							ids.firstWeekId = 'empty'
						};
					}

					Paths.insert({
						studentId: ids.studentId,
						schoolYearId: ids.schoolYearId,
						firstTermId: ids.firstTermId,
						firstWeekId: ids.firstWeekId,
						groupId: groupId,
					});
				});
			});	
		});
	}
});

Migrations.add({
	version: 8,
	name: 'Create Stats Collection.',
	up: function() {
		function rounding(complete, total) {
			if(complete && total) {
				let percentComplete = complete / total * 100
				if (percentComplete > 0 && percentComplete < 1) {
					return 1;
				}
				return Math.floor(percentComplete);
			}
			return 0;
		};

		function status (lessonsTotal, lessonsCompletedTotal, lessonsAssignedTotal) {
			if (!lessonsTotal) {
				return 'empty'
			}
			if (!lessonsCompletedTotal && !lessonsAssignedTotal) {
				return 'pending'
			} 
			if (lessonsTotal === lessonsCompletedTotal) {
				return 'completed'
			}
			if (lessonsAssignedTotal) {
				return 'assigned'
			} 
			return 'partial'
		};

		let students = Students.find({deletedOn: { $exists: false }}, {fields: {groupId: 1}});
		let lessons = Lessons.find({deletedOn: { $exists: false }}, {fields: {studentId: 1, schoolYearId: 1, termId: 1, weekId: 1, completed: 1, assigned: 1}}).fetch();

		students.forEach(student => {
			let studentLessons = _.filter(lessons, ['studentId', student._id]);

			let schoolYearIds = _.uniq(studentLessons.map(lesson => lesson.schoolYearId));
			let termIds = _.uniq(studentLessons.map(lesson => lesson.termId));
			let weekIds = _.uniq(studentLessons.map(lesson => lesson.weekId));

			schoolYearIds.forEach(schoolYearId => {
				let stats = {};

				stats.studentId = student._id;
				stats.timeFrameId = schoolYearId;
				stats.type = 'schoolYear';
				stats.lessonCount = _.filter(studentLessons, {'schoolYearId': schoolYearId}).length;
				stats.completedLessonCount = _.filter(studentLessons, {'schoolYearId': schoolYearId, 'completed': true}).length;
				stats.assignedLessonCount = _.filter(studentLessons, {'schoolYearId': schoolYearId, 'assigned': true}).length;
				stats.completedLessonPercentage = rounding(stats.completedLessonCount, stats.lessonCount);
				stats.status = status(stats.lessonCount, stats.completedLessonCount, stats.assignedLessonCount);
				stats.groupId = student.groupId;

				Stats.insert(stats);
			});

			termIds.forEach(termId => {
				let stats = {};

				stats.studentId = student._id;
				stats.timeFrameId = termId;
				stats.type = 'term';
				stats.lessonCount = _.filter(studentLessons, {'termId': termId}).length;
				stats.completedLessonCount = _.filter(studentLessons, {'termId': termId, 'completed': true}).length;
				stats.assignedLessonCount = _.filter(studentLessons, {'termId': termId, 'assigned': true}).length;
				stats.completedLessonPercentage = rounding(stats.completedLessonCount, stats.lessonCount);
				stats.status = status(stats.lessonCount, stats.completedLessonCount, stats.assignedLessonCount);
				stats.groupId = student.groupId;

				Stats.insert(stats);
			});

			weekIds.forEach(weekId => {
				let stats = {};

				stats.studentId = student._id;
				stats.timeFrameId = weekId;
				stats.type = 'week';
				stats.lessonCount = _.filter(studentLessons, {'weekId': weekId}).length;
				stats.completedLessonCount = _.filter(studentLessons, {'weekId': weekId, 'completed': true}).length;
				stats.assignedLessonCount = _.filter(studentLessons, {'weekId': weekId, 'assigned': true}).length;
				stats.completedLessonPercentage = rounding(stats.completedLessonCount, stats.lessonCount);
				stats.status = status(stats.lessonCount, stats.completedLessonCount, stats.assignedLessonCount);
				stats.groupId = student.groupId;

				Stats.insert(stats);
			});
		});
	}
});

Meteor.startup(() => {
	Migrations.migrateTo(8);
});









