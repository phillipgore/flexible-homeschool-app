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

Migrations.add({
	version: 5,
	name: 'Add orders to Weeks and Lessons.',
	up: function() {
		let terms = Terms.find({deletedOn: { $exists: false }}, {fields: {order: 1}}).fetch();
		let weeks = Weeks.find({deletedOn: { $exists: false }}, {fields: {order: 1, termId: 1}}).fetch()

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
			let ids = {};

			let firstStudent = Students.findOne({groupId: group._id, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {_id: 1}});
			if (firstStudent) {ids.studentId = firstStudent._id} else {ids.studentId = 'empty'};

			let firstSchoolYear = SchoolYears.findOne({groupId: group._id, startYear: {$gte: currentYear}, deletedOn: { $exists: false }}, {sort: {starYear: 1}, fields: {_id: 1}});
			if (firstSchoolYear) {ids.schoolYearId = firstSchoolYear._id} else {ids.schoolYearId = 'empty'};

			if (ids.schoolYearId === 'empty') {
				ids.termId = 'empty';
				ids.weekId = 'empty';
				ids.schoolWorkId = 'empty'
			} else {
				let firstIncompleteLesson = Lessons.findOne(
					{studentId: firstStudent._id, schoolYearId: firstSchoolYear._id, completed: false, deletedOn: { $exists: false }},
					{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1, schoolWorkId: 1}}
				);
				let firstCompletedLesson = Lessons.findOne(
					{studentId: firstStudent._id, schoolYearId: firstSchoolYear._id, completed: true, deletedOn: { $exists: false }},
					{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1, schoolWorkId: 1}}
				);

				if (firstIncompleteLesson) {
					ids.termId = firstIncompleteLesson.termId;
					ids.weekId = firstIncompleteLesson.weekId;
					ids.schoolWorkId = firstIncompleteLesson.schoolWorkId
				} else if (firstCompletedLesson) {
					ids.termId = firstCompletedLesson.termId;
					ids.weekId = firstCompletedLesson.weekId;
					ids.schoolWorkId = firstCompletedLesson.schoolWorkId
				} else {
					let firstTerm = Terms.findOne(
						{groupId: group._id, schoolYearId: firstSchoolYear._id, deletedOn: { $exists: false }},
						{sort: {order: 1}, fields: {_id: 1}}
					)
					let firstWeek = Weeks.findOne(
						{groupId: group._id, schoolYearId: firstSchoolYear._id, termId: firstTerm._id, deletedOn: { $exists: false }},
						{sort: {order: 1}, fields: {_id: 1}}
					)
					let firstSchoolWork = SchoolWork.findOne(
						{groupId: group._id, schoolYearId: firstSchoolYear._id, studentId: firstStudent._id, deletedOn: { $exists: false }},
						{sort: {order: 1}, fields: {_id: 1}}
					)
					if (firstTerm) {ids.termId = firstTerm._id} else {ids.termId = 'empty'};
					if (firstWeek) {ids.weekId = firstWeek._id} else {ids.weekId = 'empty'};
					if (firstSchoolWork) {ids.schoolWorkId = firstSchoolWork._id} else {ids.schoolWorkId = 'empty'};
				}
			}

			let firstResource = Resources.findOne({groupId: group._id, deletedOn: { $exists: false }}, {sort: {title: 1}, fields: {type: 1}});
			if (firstResource) {ids.resourceId = firstResource._id} else {ids.resourceId = 'empty'};
			if (firstResource) {ids.resourceType = firstResource.type} else {ids.resourceType = 'empty'};

			let firstUser = Meteor.users.findOne({'info.groupId': group._id, 'emails.0.verified': true, 'status.active': true}, {sort: {'info.lastName': 1, 'info.firstName': 1}});
			ids.userId = firstUser._id;

			let firstReport = Reports.findOne({groupId: group._id, deletedOn: { $exists: false }}, {sort: {name: 1}});
			if (firstReport) {ids.reportId = firstReport._id} else {ids.reportId = 'empty'};

			if (group.appAdmin) {
				let firstGroup = Groups.findOne({appAdmin: false}, {fields: {_id: 1}, sort: {createdOn: -1}}); 
				if (firstGroup) {ids.groupId = firstGroup._id} else {ids.groupId = 'empty'};
			} else {
				ids.groupId = 'empty'
			}

			Groups.update(group._id, {$set: {initialIds: ids}});

		});
	}
});

Meteor.startup(() => {
	Migrations.migrateTo('6,rerun');
});






