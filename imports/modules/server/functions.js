import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Subjects} from '../../api/subjects/subjects.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {Lessons} from '../../api/lessons/lessons.js';
import _ from 'lodash'

function status (lessonsTotal, lessonsCompletedTotal) {
	if (!lessonsCompletedTotal) {
		return 'pending'
	} else if (lessonsTotal === lessonsCompletedTotal) {
		return 'completed'
	}
	return 'partial'
};

export function studentStatusAndUrlIds(student, schoolYearId, termId) {
	let subjectIds = Subjects.find({studentId: student._id, schoolYearId: schoolYearId}).map(subject => (subject._id));

	// Year Status
	let yearLessonsTotal = Lessons.find({subjectId: {$in: subjectIds}}).count();
	let yearLessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, completed: true}).count();
	let yearPercentComplete = yearLessonsCompletedTotal / yearLessonsTotal * 100;
	
	if (yearPercentComplete > 0 && yearPercentComplete < 1) {
		student.yearProgress = 1;
	} else {
		student.yearProgress = Math.floor(yearPercentComplete);
	}

	// Term Status
	let termWeeksIds = Weeks.find({termId: termId}).map(week => (week._id));

	let termLessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: termWeeksIds}}).count();
	let termLessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: termWeeksIds}, completed: true}).count();
	let termPercentComplete = termLessonsCompletedTotal / termLessonsTotal * 100;

	if (termPercentComplete > 0 && termPercentComplete < 1) {
		student.termProgress = 1;
	}
	student.termProgress =  Math.floor(termPercentComplete);

	// First Week URL ID
	let LessonsCompleteWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: termWeeksIds}, completed: true}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );
	let LessonsPartialWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: LessonsCompleteWeekIds}, completed: false}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );

	let LessonsIncompleteWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: termWeeksIds}, completed: false}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );

	let weekPartial = Weeks.findOne({_id: {$in: LessonsPartialWeekIds}}, {sort: {order: 1}});
	let weekIncomplete = Weeks.findOne({_id: LessonsIncompleteWeekIds[0]});

	student.studentId = student._id;

	if (!termLessonsCompletedTotal) {
		student.firstWeekId = Weeks.findOne({_id: {$in: termWeeksIds}}, {sort: {order: 1}})._id;
	} else if (termLessonsCompletedTotal > 0 && termLessonsTotal != termLessonsCompletedTotal) {
		if (weekPartial) {
			student.firstWeekId = weekPartial._id;
		} else {
			student.firstWeekId = weekIncomplete._id;
		}
	} else if (termLessonsTotal === termLessonsCompletedTotal) {
		student.firstWeekId = Weeks.findOne({_id: {$in: termWeeksIds}}, {sort: {order: -1}})._id;
	}

	return student;
};

export function schoolYearsStatusAndUrlIds(schoolYear, studentId) {
	function getSubjectIds(schoolYear, studentId) {
		if (_.isNil(studentId)) {
		    return Subjects.find({schoolYearId: schoolYear._id}).map(subject => (subject._id));
		} else {
			return Subjects.find({studentId: studentId, schoolYearId: schoolYear._id}).map(subject => (subject._id));
		}
	}

	let subjectIds = getSubjectIds(schoolYear, studentId);

	// Status
	let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}}).count();
	let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, completed: true}).count();
	schoolYear.status = status(lessonsTotal, lessonsCompletedTotal);

	// First Term and First Week
	let termIds = Terms.find({schoolYearId: schoolYear._id}).map(term => (term._id))
	let weekIds = Weeks.find({termId: {$in: termIds}}).map(week => (week._id))

	let LessonsCompleteWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: true}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );
	let LessonsPartialWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: LessonsCompleteWeekIds}, completed: false}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );

	let LessonsIncompleteWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: false}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );

	let weekPartial = Weeks.findOne({_id: {$in: LessonsPartialWeekIds}}, {sort: {order: 1}});
	let weekIncomplete = Weeks.findOne({_id: LessonsIncompleteWeekIds[0]});

	if (!lessonsCompletedTotal) {
		schoolYear.firstTermId = Terms.findOne({_id: {$in: termIds}}, {sort: {order: 1}})._id;
		schoolYear.firstWeekId = Weeks.findOne({_id: {$in: weekIds}}, {sort: {order: 1}})._id;
	} else if (lessonsCompletedTotal > 0 && lessonsTotal != lessonsCompletedTotal) {
		if (weekPartial) {
			schoolYear.firstTermId = weekPartial.termId;
			schoolYear.firstWeekId = weekPartial._id;
		} else {
			schoolYear.firstTermId = weekIncomplete.termId;
			schoolYear.firstWeekId = weekIncomplete._id;
		}
	} else if (lessonsTotal === lessonsCompletedTotal) {
		schoolYear.firstTermId = Terms.findOne({_id: {$in: termIds}}, {sort: {order: 1}})._id;
		schoolYear.firstWeekId = Weeks.findOne({_id: {$in: weekIds}}, {sort: {order: -1}})._id
	}

	return schoolYear;
};

export function termStatusAndUrlIds(term, studentId) {
	function getSubjectIds(term, studentId) {
		if (_.isNil(studentId)) {
		    return Lessons.find({termId: term._id}).map(lesson => (lesson.subjectId));
		} else {
			return Lessons.find({studentId: studentId, termId: term._id}).map(lesson => (lesson.subjectId));
		}
	}

	let subjectIds = getSubjectIds(term, studentId);
	let termWeeksIds = Weeks.find({termId: term._id}).map(week => (week._id));

	let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: termWeeksIds}}).count();
	let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: termWeeksIds}, completed: true}).count();
	term.status = status(lessonsTotal, lessonsCompletedTotal);

	let LessonsCompleteWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: termWeeksIds}, completed: true}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );
	let LessonsPartialWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: LessonsCompleteWeekIds}, completed: false}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );

	let LessonsIncompleteWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: termWeeksIds}, completed: false}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );

	let weekPartial = Weeks.findOne({_id: {$in: LessonsPartialWeekIds}}, {sort: {order: 1}});
	let weekIncomplete = Weeks.findOne({_id: LessonsIncompleteWeekIds[0]});

	if (!lessonsCompletedTotal) {
		term.firstWeekId = Weeks.findOne({_id: {$in: termWeeksIds}}, {sort: {order: 1}})._id;
	} else if (lessonsCompletedTotal > 0 && lessonsTotal != lessonsCompletedTotal) {
		if (weekPartial) {
			term.firstWeekId = weekPartial._id;
		} else {
			term.firstWeekId = weekIncomplete._id;
		}
	} else if (lessonsTotal === lessonsCompletedTotal) {
		term.firstWeekId = Weeks.findOne({_id: {$in: termWeeksIds}}, {sort: {order: -1}})._id;
	}

	return term;
};

export function weekStatsAndUrlIds(week) {
	let lessonsTotal = Lessons.find({weekId: week._id}).count();
	let lessonsCompletedTotal = Lessons.find({weekId: week._id, completed: true}).count();
	week.status = status(lessonsTotal, lessonsCompletedTotal);

	return week;
};