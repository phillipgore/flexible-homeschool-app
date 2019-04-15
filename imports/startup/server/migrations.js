import {Groups} from '../../api/groups/groups.js';
import {Students} from '../../api/students/students.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Resources} from '../../api/resources/resources.js';
import {Lessons} from '../../api/lessons/lessons.js';
import {Reports} from '../../api/reports/reports.js';

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

// Migrations.add({
// 	version: 5,
// 	name: 'Get Initial Ids.',
// 	up: function() {
// 		let groups = Groups.find();

// 		groups.forEach(group => {
// 			initialIdProperties = {};

// 			let student = Students.findOne({groupId: group._id, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {_id: 1}});

// 			if (student) {
// 				initialIdProperties.studentId = student._id

// 				let lesson = Lessons.findOne({groupId: group._id, deletedOn: { $exists: false }, studentId: student._id, completed: false}, {sort: {order: 1}, fields: {_id: 1}});

// 				if (lesson) {
// 					console.log('used lesson: ' + lesson._id)
// 					initialIdProperties.schoolYearId = lesson.schoolYearId;
// 					initialIdProperties.termId = lesson.termId;
// 					initialIdProperties.weekId = lesson.weekId;
// 					initialIdProperties.schoolWorkId = lesson.schoolWorkId;
// 				} else {
// 					let schoolYear = SchoolYears.findOne({groupId: group._id, deletedOn: { $exists: false }}, {sort: {starYear: 1}, fields: {_id: 1}});
// 					if (schoolYear.length) {
// 						initialIdProperties.schoolYearId = schoolYear._id;

// 						let term = Terms.findOne({schoolYearId: schoolYear._id, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {_id: 1}});

// 						if (term) {
// 							initialIdProperties.termId = term._id;

// 							let week = Weeks.findOne({termId: term._id, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {_id: 1}});
// 							if (week.length) {initialIdProperties.weekId = week._id;} else {initialIdProperties.weekId = 'empty';}
// 						} else {
// 							initialIdProperties.termId = 'empty';
// 							initialIdProperties.weekId = 'empty';
// 							initialIdProperties.schoolWorkId = 'empty';
// 						}
// 					} else {
// 						initialIdProperties.schoolYearId = 'empty';
// 						initialIdProperties.termId = 'empty';
// 						initialIdProperties.weekId = 'empty';
// 						initialIdProperties.schoolWorkId = 'empty';
// 					}
// 				}
// 			} else {
// 				initialIdProperties.studentId = 'empty';
// 				initialIdProperties.schoolWorkId = 'empty';

// 				let schoolYear = SchoolYears.findOne({groupId: group._id, deletedOn: { $exists: false }}, {sort: {starYear: 1}, fields: {_id: 1}});
				
// 				if (schoolYear) {
// 					initialIdProperties.schoolYearId = schoolYear._id;

// 					let term = Terms.findOne({schoolYearId: schoolYear._id, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {_id: 1}});

// 					if (term) {
// 						initialIdProperties.termId = term._id;

// 						let week = Weeks.findOne({termId: term._id, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {_id: 1}});
// 						if (week.length) {initialIdProperties.weekId = week._id;} else {initialIdProperties.weekId = 'empty';}
// 					} else {
// 						initialIdProperties.termId = 'empty';
// 					}
// 				} else {
// 					initialIdProperties.schoolYearId = 'empty';
// 					initialIdProperties.termId = 'empty';
// 					initialIdProperties.weekId = 'empty';
// 				}
// 			}

// 			let resource = Resources.findOne({groupId: group._id, deletedOn: { $exists: false }}, {sort: {title: 1}});
// 			if (resource) {initialIdProperties.resourceId = resource._id} else {initialIdProperties.resourceId = 'empty'};
// 			if (resource) {initialIdProperties.resourceType = resource.type} else {initialIdProperties.resourceType = 'empty'};

// 			let user = Meteor.users.findOne({'info.groupId': group._id, 'emails.0.verified': true, 'status.active': true}, {sort: {'info.lastName': 1, 'info.firstName': 1}});
// 			if (user) {initialIdProperties.userId = user._id} else {initialIdProperties.userId = 'empty'};

// 			let report = Reports.findOne({groupId: group._id, deletedOn: { $exists: false }}, {sort: {name: 1}});
// 			if (report) {initialIdProperties.reportId = report._id} else {initialIdProperties.reportId = 'empty'};

// 			if (group.appAdmin) {
// 				let firstGroup = Groups.findOne({appAdmin: false}, {fields: {_id: 1}, sort: {createdOn: -1}}); 

// 				if (firstGroup) {initialIdProperties.groupId = firstGroup._id} else {initialIdProperties.groupId = 'empty'};
// 			}

// 			console.log(initialIdProperties);
// 		})
// 	}
// });

Meteor.startup(() => {
	Migrations.migrateTo('4,rerun');
});






