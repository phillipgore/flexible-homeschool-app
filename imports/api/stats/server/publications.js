import {Counts} from 'meteor/tmeasday:publish-counts';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Resources} from '../../resources/resources.js';
import {Subjects} from '../../subjects/subjects.js';
import {Weeks} from '../../weeks/weeks.js';
import {Lessons} from '../../lessons/lessons.js';
import {allSchoolYearsStatusAndPaths} from '../../../modules/server/functions';

Meteor.publish('initialIds', function() {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
		
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

		let studentId = Students.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}})._id;
		let resourceId = Resources.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {title: 1}})._id;
		
		self.added('initialIds', Random.id(), {studentId: studentId, resourceId: resourceId});

		self.ready();
	});
});

Meteor.publish('initialStats', function() {
	if (!this.userId) {
		return this.ready();
	}
	
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	Counts.publish(this, 'schoolYearCount', SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'studentCount', Students.find({groupId: groupId, deletedOn: { $exists: false }}));
});

Meteor.publish('initialPaths', function() {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let schoolYears = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}});

		schoolYears.map((schoolYear) => {
			schoolYear = allSchoolYearsStatusAndPaths(schoolYear, schoolYear._id);
			schoolYear.schoolYearId = schoolYear._id;
			self.added('initialPaths', Random.id(), schoolYear);
		});

		self.ready();
	});
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