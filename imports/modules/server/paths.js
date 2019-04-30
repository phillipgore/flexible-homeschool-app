import {Students} from '../../api/students/students.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {Lessons} from '../../api/lessons/lessons.js';
import _ from 'lodash'

export function studentPath() {
	let groupId = Meteor.user().info.groupId;
	let paths = []

	let students = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {_id: 1}});
	let schoolYears = SchoolYears.find(
		{groupId: groupId, deletedOn: { $exists: false }}, 
		{sort: {startYear: 1}, fields: {_id: 1}}
	);
	let lessons = Lessons.find(
		{groupId: groupId, deletedOn: { $exists: false }}, 
		{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {studentId: 1, schoolYearId: 1, termId: 1, weekId: 1, completed: 1}}
	).fetch();

	students.forEach(student => {
		schoolYears.forEach(schoolYear => {
			let ids = {}
			ids.student = student._id;
			ids.schoolYear = schoolYear._id;

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
			paths.push(ids);
		});
	});

	console.log(paths)
	return true;
}