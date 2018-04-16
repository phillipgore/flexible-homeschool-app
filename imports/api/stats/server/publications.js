import {Counts} from 'meteor/tmeasday:publish-counts';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Resources} from '../../resources/resources.js';
import {Subjects} from '../../subjects/subjects.js';
import {Weeks} from '../../weeks/weeks.js';
import {Lessons} from '../../lessons/lessons.js';

Meteor.publish('planningStatusStats', function() {
	if (!this.userId) {
		return this.ready();
	}
	
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	Counts.publish(this, 'schoolYearCount', SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'studentCount', Students.find({groupId: groupId, deletedOn: { $exists: false }}));
});

Meteor.publish('resourceStats', function() {
	if (!this.userId) {
		return this.ready();
	}
	
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	Counts.publish(this, 'allAllCount', Resources.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'bookAllCount', Resources.find({type: 'book', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'linkAllCount', Resources.find({type: 'link', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'videoAllCount', Resources.find({type: 'video', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'audioAllCount', Resources.find({type: 'audio', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'appAllCount', Resources.find({type: 'app', groupId: groupId, deletedOn: { $exists: false }}));

	Counts.publish(this, 'allOwnCount', Resources.find({availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'bookOwnCount', Resources.find({type: 'book', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'linkOwnCount', Resources.find({type: 'link', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'videoOwnCount', Resources.find({type: 'video', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'audioOwnCount', Resources.find({type: 'audio', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'appOwnCount', Resources.find({type: 'app', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));

	Counts.publish(this, 'allBorrowedCount', Resources.find({availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'bookBorrowedCount', Resources.find({type: 'book', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'linkBorrowedCount', Resources.find({type: 'link', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'videoBorrowedCount', Resources.find({type: 'video', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'audioBorrowedCount', Resources.find({type: 'audio', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'appBorrowedCount', Resources.find({type: 'app', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));

	Counts.publish(this, 'allNeedCount', Resources.find({availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'bookNeedCount', Resources.find({type: 'book', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'linkNeedCount', Resources.find({type: 'link', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'videoNeedCount', Resources.find({type: 'video', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'audioNeedCount', Resources.find({type: 'audio', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'appNeedCount', Resources.find({type: 'app', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
});

Meteor.publish('trackingStats', function(schoolYearId, termId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let students = [];
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let originalStudents = Students.find(
			{groupId: groupId, deletedOn: { $exists: false }}, 
			{sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}}
		);

		originalStudents.map((student) => {
			let subjectIds = Subjects.find({studentId: student._id, schoolYearId: schoolYearId}).map(subject => (subject._id));

			let yearLessonsTotal = Lessons.find({subjectId: {$in: subjectIds}}).count();
			let yearLessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, completed: true}).count();
			let yearPercentComplete = yearLessonsCompletedTotal / yearLessonsTotal * 100;
			
			student.studentId = student._id;
			if (yearPercentComplete > 0 && yearPercentComplete < 1) {
				student.yearProgress = 1;
			} else {
				student.yearProgress = Math.floor(yearPercentComplete);
			}

			let termWeeksIds = Weeks.find({termId: termId}).map(week => (week._id))
			let termLessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: termWeeksIds}}).count();
			let termLessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: termWeeksIds}, completed: true}).count();
			let termPercentComplete = termLessonsCompletedTotal / termLessonsTotal * 100;

			if (termPercentComplete > 0 && termPercentComplete < 1) {
				student.termProgress = 1;
			}
			student.termProgress =  Math.floor(termPercentComplete);

			students.push(student);
		});

		students.forEach(function(student) {
			self.added('trackingStats', Random.id(), student);
		});

		self.ready();
	});
});