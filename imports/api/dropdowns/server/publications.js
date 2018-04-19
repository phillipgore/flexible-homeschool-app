import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Subjects} from '../../subjects/subjects.js';
import {Weeks} from '../../weeks/weeks.js';
import {Lessons} from '../../lessons/lessons.js';
import _ from 'lodash'

Meteor.publish('schoolYearsSubbar', function(studentId) {
	this.autorun(function (computation) {
		if (!this.userId || !SchoolYears.find().count() || !Subjects.find().count() || !Lessons.find().count() || !Terms.find().count()) {
			return this.ready();
		}

		let self = this;

		let schoolYears = [];
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let originalSchoolYears = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}});

		originalSchoolYears.map((schoolYear) => {
			function getSubjectIds(studentId, schoolYear) {
				if (_.isNil(studentId)) {
				    return Subjects.find({schoolYearId: schoolYear._id}).map(subject => (subject._id));
				} else {
					return Subjects.find({studentId: studentId, schoolYearId: schoolYear._id}).map(subject => (subject._id));
				}
			}

			let subjectIds = getSubjectIds(studentId, schoolYear);

			let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}}).count();
			let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, completed: true}).count();

			let weekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}}).map(lesson => (lesson.weekId)) );
			let termIds = _.uniq( Weeks.find({_id: {$in: weekIds}}, {sort: {order: 1}}).map(week => (week.termId)) );

			let LessonsCompleteWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: true}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );
			let LessonsIncompleteWeekId = Lessons.findOne({weekId: {$in: weekIds}, completed: false}, {sort: {order: 1}}).weekId;
			let LessonsPartialWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: LessonsCompleteWeekIds}, completed: false}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );

			let weekPartial = Weeks.findOne({_id: {$in: LessonsPartialWeekIds}}, {sort: {order: 1}});
			let weekIncomplete = Weeks.findOne({_id: LessonsIncompleteWeekId});

			schoolYear.schoolYearId = schoolYear._id;
			if (!lessonsCompletedTotal) {
				schoolYear.firstTermId = Terms.findOne({_id: {$in: termIds}}, {sort: {order: 1}})._id;
				schoolYear.firstWeekId = Weeks.findOne({_id: {$in: weekIds}}, {sort: {order: 1}})._id;
				schoolYear.status = 'pending'
			} else if (lessonsCompletedTotal > 0 && lessonsTotal != lessonsCompletedTotal) {
				if (weekPartial) {
					schoolYear.firstTermId = weekPartial.termId;
					schoolYear.firstWeekId = weekPartial._id;
				} else {
					schoolYear.firstTermId = weekIncomplete.termId;
					schoolYear.firstWeekId = weekIncomplete._id;
				}
				schoolYear.status = 'partial'
			} else if (lessonsTotal === lessonsCompletedTotal) {
				schoolYear.firstTermId = Terms.findOne({_id: {$in: termIds}}, {sort: {order: 1}})._id;
				schoolYear.firstWeekId = Weeks.findOne({_id: {$in: weekIds}}, {sort: {order: -1}})._id
				schoolYear.status = 'completed'
			}

			schoolYears.push(schoolYear);
		});

		schoolYears.forEach(function(schoolYear) {
			self.added('schoolYearsSubbar', Random.id(), schoolYear);
		});

		self.ready();
	});
});

Meteor.publish('termsSubbar', function(studentId, schoolYearId) {
	this.autorun(function (computation) {
		if (!this.userId || !SchoolYears.find().count() || !Subjects.find().count() || !Lessons.find().count() || !Terms.find().count()) {
			return this.ready();
		}

		let self = this;

		let terms = []
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let originalTerms = Terms.find({schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});

		originalTerms.map((term) => {
		    function getSubjectIds(studentId, schoolYearId) {
				if (studentId) {
				    return Subjects.find({studentId: studentId, schoolYearId: schoolYearId}).map(subject => (subject._id));
				} else {
					return Subjects.find({schoolYearId: schoolYearId}).map(subject => (subject._id));
				}
			}

			let subjectIds = getSubjectIds(studentId, schoolYearId);
			let weekIds = Weeks.find({termId: term._id}, {sort: {order: 1}}).map(week => (week._id));

			let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}}).count();
			let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: true}).count();

			let LessonsCompleteWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: true}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );
			let LessonsIncompleteWeekId = Lessons.findOne({weekId: {$in: weekIds}, completed: false}, {sort: {order: 1}}).weekId;
			let LessonsPartialWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: LessonsCompleteWeekIds}, completed: false}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );

			let weekPartial = Weeks.findOne({_id: {$in: LessonsPartialWeekIds}}, {sort: {order: 1}});
			let weekIncomplete = Weeks.findOne({_id: LessonsIncompleteWeekId});

			term.termId = term._id;
			if (!lessonsCompletedTotal) {
				term.firstWeekId = Weeks.findOne({_id: {$in: weekIds}}, {sort: {order: 1}})._id;
				term.status = 'pending'
			} else if (lessonsCompletedTotal > 0 && lessonsTotal != lessonsCompletedTotal) {
				if (weekPartial) {
					term.firstWeekId = weekPartial._id;
				} else {
					term.firstWeekId = weekIncomplete._id;
				}
				term.status = 'partial'
			} else if (lessonsTotal === lessonsCompletedTotal) {
				term.firstWeekId = Weeks.findOne({_id: {$in: weekIds}}, {sort: {order: -1}})._id;
				term.status = 'completed'
			}
			
			terms.push(term);
		});

		terms.forEach(function(term) {
			self.added('termsSubbar', Random.id(), term);
		});

		self.ready();
	});
});

Meteor.publish('weeksSubbar', function(studentId, schoolYearId, termId) {
	this.autorun(function (computation) {
		if (!this.userId || !SchoolYears.find().count() || !Subjects.find().count() || !Lessons.find().count() || !Terms.find().count()) {
			return this.ready();
		}

		let self = this;

		let weeks = []
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let originalWeeks = Weeks.find({termId: termId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, termId: 1}});

		originalWeeks.map((week) => {
		    let subjectIds = Subjects.find({studentId: studentId, schoolYearId: schoolYearId}).map(subject => (subject._id));

			let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: week._id}).count();
			let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: week._id, completed: true}).count();

			week.weekId = week._id;
			if (!lessonsCompletedTotal) {
				week.status = 'pending'
			} else if (lessonsCompletedTotal > 0 && lessonsTotal != lessonsCompletedTotal) {
				week.status = 'partial'
			} else if (lessonsTotal === lessonsCompletedTotal) {
				week.status = 'completed'
			}
			
			weeks.push(week);
		});

		weeks.forEach(function(week) {
			self.added('weeksSubbar', Random.id(), week);
		});

		self.ready();
	});
});

Meteor.publish('trackingStudents', function(schoolYearId, termId) {
	this.autorun(function (computation) {
		if (!this.userId || !SchoolYears.find().count() || !Subjects.find().count() || !Lessons.find().count() || !Terms.find().count()) {
			return this.ready();
		}

		let self = this;

		let students = []
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let originalStudents = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {_id: 1}});

		originalStudents.map((student) => {

			let subjectIds = Subjects.find({studentId: student._id, schoolYearId: schoolYearId}).map(subject => (subject._id));
			let weekIds = Weeks.find({termId: termId}, {sort: {order: 1}}).map(week => (week._id));

			let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}}).count();
			let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: true}).count();

			let LessonsCompleteWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: true}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );
			let LessonsIncompleteWeekId = Lessons.findOne({weekId: {$in: weekIds}, completed: false}, {sort: {order: 1}}).weekId;
			let LessonsPartialWeekIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: LessonsCompleteWeekIds}, completed: false}, {sort: {order: 1}}).map(lesson => (lesson.weekId)) );

			let weekPartial = Weeks.findOne({_id: {$in: LessonsPartialWeekIds}}, {sort: {order: 1}});
			let weekIncomplete = Weeks.findOne({_id: LessonsIncompleteWeekId});

			student.studentId = student._id;

			if (!lessonsCompletedTotal) {
				student.firstWeekId = Weeks.findOne({_id: {$in: weekIds}}, {sort: {order: 1}})._id;
			} else if (lessonsCompletedTotal > 0 && lessonsTotal != lessonsCompletedTotal) {
				if (weekPartial) {
					student.firstWeekId = weekPartial._id;
				} else {
					student.firstWeekId = weekIncomplete._id;
				}
			} else if (lessonsTotal === lessonsCompletedTotal) {
				student.firstWeekId = Weeks.findOne({_id: {$in: weekIds}}, {sort: {order: -1}})._id;
			}
			
			students.push(student);
		});

		students.forEach(function(student) {
			self.added('trackingStudents', Random.id(), student);
		});

		self.ready();
	});
});



























