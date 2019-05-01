import {Paths} from '../../api/paths/paths.js';
import {Groups} from '../../api/groups/groups.js';
import {Students} from '../../api/students/students.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Resources} from '../../api/resources/resources.js';
import {Lessons} from '../../api/lessons/lessons.js';
import {Reports} from '../../api/reports/reports.js';

import _ from 'lodash';

export function insertYearPath(schoolYearId) {
	let groupId = Meteor.user().info.groupId;
	let students = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}});

	students.forEach(student => {
		let ids = {}
		ids.studentId = student._id;
		ids.schoolYearId = schoolYearId;

		let firstTerm = Terms.findOne(
			{schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, 
			{sort: {order: 1}, fields: {_id: 1}}
		)

		if (firstTerm) { // First Term: True
			ids.firstTermId = firstTerm._id
			let firstWeek = Weeks.findOne(
				{termId: firstTermId, groupId: groupId, deletedOn: { $exists: false }}, 
				{sort: {termOrder: 1, order: 1}, fields: {_id: 1}}
			)
			if (firstWeek) {ids.firstWeekId = firstWeek._id} else {ids.weekId = 'empty'};
		} else { // First Term: False
			ids.firstTermId = 'empty'
			ids.firstWeekId = 'empty'
		};

		Paths.insert({
			studentId: ids.studentId,
			schoolYearId: ids.schoolYearId,
			firstTermId: ids.firstTermId,
			firstWeekId: ids.firstWeekId,
		});
	})
};

export function updateYearPath(schoolYearId) {
	let groupId = Meteor.user().info.groupId;
	let students = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}});

	students.forEach(student => {
		let ids = {}
		ids.studentId = student._id;
		ids.schoolYearId = schoolYearId;

		let firstIncompleteLesson = Lessons.findOne(
			{studentId: student._id, schoolYearId: schoolYearId, completed: false, deletedOn: { $exists: false }},
			{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1}}
		);
		let firstCompletedLesson = Lessons.findOne(
			{studentId: student._id, schoolYearId: schoolYearId, completed: true, deletedOn: { $exists: false }},
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
				{groupId: groupId, schoolYearId: schoolYearId, deletedOn: { $exists: false }},
				{sort: {order: 1}, fields: {_id: 1}}
			)

			if (firstTerm) { // First Term: True
				ids.firstTermId = firstTerm._id
				let firstWeek = Weeks.findOne(
					{groupId: groupId, schoolYearId: schoolYearId, termId: firstTerm._id, deletedOn: { $exists: false }},
					{sort: {order: 1}, fields: {_id: 1}}
				)
				if (firstWeek) {ids.firstWeekId = firstWeek._id} else {ids.weekId = 'empty'};
			} else { // First Term: False
				ids.firstTermId = 'empty'
				ids.firstWeekId = 'empty'
			};
		}

		Paths.insert({studentId: student._id, schoolYearId, schoolYearId}, {
			studentId: ids.studentId,
			schoolYearId: ids.schoolYearId,
			firstTermId: ids.firstTermId,
			firstWeekId: ids.firstWeekId,
		});
	})
};

export function updateLessonPath(lessonId) {
	let lesson = Lessons.findOne({_id: lessonid});
	let studentId = lesson.studentId;
	let schoolYearId = lesson.schoolYearId;

	let ids = {}
	ids.studentId = studentId;
	ids.schoolYearId = schoolYearId;

	let firstIncompleteLesson = Lessons.findOne(
		{studentId: studentId, schoolYearId: schoolYearId, completed: false, deletedOn: { $exists: false }},
		{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1}}
	);
	let firstCompletedLesson = Lessons.findOne(
		{studentId: studentId, schoolYearId: schoolYearId, completed: true, deletedOn: { $exists: false }},
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
			{groupId: groupId, schoolYearId: schoolYearId, deletedOn: { $exists: false }},
			{sort: {order: 1}, fields: {_id: 1}}
		)

		if (firstTerm) { // First Term: True
			ids.firstTermId = firstTerm._id
			let firstWeek = Weeks.findOne(
				{groupId: groupId, schoolYearId: schoolYearId, termId: firstTerm._id, deletedOn: { $exists: false }},
				{sort: {order: 1}, fields: {_id: 1}}
			)
			if (firstWeek) {ids.firstWeekId = firstWeek._id} else {ids.weekId = 'empty'};
		} else { // First Term: False
			ids.firstTermId = 'empty'
			ids.firstWeekId = 'empty'
		};
	}

	Paths.insert({studentId: studentId, schoolYearId, schoolYearId}, {
		studentId: ids.studentId,
		schoolYearId: ids.schoolYearId,
		firstTermId: ids.firstTermId,
		firstWeekId: ids.firstWeekId,
	});
};







