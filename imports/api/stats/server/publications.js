import {Counts} from 'meteor/tmeasday:publish-counts';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Resources} from '../../resources/resources.js';
import {Subjects} from '../../subjects/subjects.js';
import {Weeks} from '../../weeks/weeks.js';
import {Lessons} from '../../lessons/lessons.js';
import {Reports} from '../../reports/reports.js';
import {studentSchoolYearsStatusAndPaths} from '../../../modules/server/functions';
import {allSchoolYearsStatusAndPaths} from '../../../modules/server/functions';

import _ from 'lodash'

Meteor.publish('initialIds', function(currentYear) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let ids = {};


		let userId = Meteor.users.findOne({'info.groupId': groupId, 'emails.0.verified': true, 'status.active': true}, {sort: {'info.lastName': 1, 'info.firstName': 1}})._id;
		let studentIds = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}}).map((student) => (student._id))
		let schoolYears = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}});
		let resourceTypes = ['all', 'book', 'link', 'video', 'audio', 'app'];
		let resourceAvailabilities = ['all', 'own', 'borrowed', 'need'];
		let schoolYearIds = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}}).map((schoolYear) => (schoolYear._id))
		let report = Reports.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {name: 1}});


		// Initial User
		if (userId) {ids.user = userId} else {ids.user = 'empty'};


		// Intiial Student
		if (studentIds.length) {ids.student = studentIds[0]} else {ids.student = 'empty'};


		// Intiial Report
		if (report) {ids.report = report._id} else {ids.report = 'empty'};


		// Initial Times
		function schoolYearId(currentYear) {
			if (!SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}).count()) {
				return 'empty'
			}
			if (SchoolYears.findOne({groupId: groupId, startYear: {$gte: currentYear}, deletedOn: { $exists: false }}, {sort: {starYear: 1}})) {
				return SchoolYears.findOne({groupId: groupId, startYear: {$gte: currentYear}, deletedOn: { $exists: false }}, {sort: {starYear: 1}})._id;
			}
			return SchoolYears.findOne({groupId: groupId, startYear: {$lte: currentYear}, deletedOn: { $exists: false }}, {sort: {starYear: 1}})._id;

		};
		ids.schoolYear = schoolYearId(currentYear);

		if (studentIds.length) {
			studentIds.forEach((studentId) => {
				schoolYears.map((schoolYear) => {
					schoolYear = studentSchoolYearsStatusAndPaths(schoolYear, schoolYear._id, studentId);

					let keyNameTerm = 'term' + studentId + schoolYear._id;
					let valueTerm = schoolYear.firstTermId;
					if (valueTerm) {ids[keyNameTerm] = valueTerm} else {ids[keyNameTerm] = 'empty'};

					let keyNameWeek = 'week' + studentId + schoolYear._id + schoolYear.firstTermId;
					let valueWeek = schoolYear.firstWeekId;
					if (valueWeek) {ids[keyNameWeek] = valueWeek} else {ids[keyNameWeek] = 'empty'};
				});
			});
		} else {
			if (schoolYears.count()) {
				schoolYears.map((schoolYear) => {
					schoolYear = allSchoolYearsStatusAndPaths(schoolYear, schoolYear._id);

					let keyNameTerm = 'termempty' + schoolYear._id;
					let valueTerm = schoolYear.firstTermId;
					if (valueTerm) {ids[keyNameTerm] = valueTerm} else {ids[keyNameTerm] = 'empty'};

					let keyNameWeek = 'weekempty' + schoolYear._id + schoolYear.firstTermId;
					let valueWeek = schoolYear.firstWeekId;
					if (valueWeek) {ids[keyNameWeek] = valueWeek} else {ids[keyNameWeek] = 'empty'};
				});
			} else {
				ids.termemptyempty = 'empty';
				ids.weekemptyemptyempty = 'empty';
			}
		}


		// Initial Resources
		resourceTypes.forEach((type) => {
			resourceAvailabilities.forEach((availability) => {
				function query (type, availability) {
					if (type === 'all' && availability === 'all') {
						return {groupId: groupId, deletedOn: { $exists: false }};
					}
					if (type === 'all' && availability != 'all') {
						return {availability: availability, groupId: groupId, deletedOn: { $exists: false }};
					}
					if (type != 'all' && availability === 'all') {
						return {type: type, groupId: groupId, deletedOn: { $exists: false }};
					}
					return {type: type, availability: availability, groupId: groupId, deletedOn: { $exists: false }};
				};

				let keyName = _.capitalize(type) + _.capitalize(availability);
				let valueResource = Resources.findOne(query(type, availability), {sort: {title: 1}});

				if (valueResource) {ids['resource' + keyName] = valueResource._id} else {ids['resource' + keyName] = 'empty'};
			})
		});

		let valueFirstResource = Resources.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {title: 1}});
		if (valueFirstResource) {ids['resourceCurrentType'] = valueFirstResource.type} else {ids['resourceCurrentType'] = 'empty'};


		// Initial Subjects
		if (studentIds.length && schoolYearIds.length) {
			studentIds.forEach((studentId) => {
				schoolYearIds.forEach((schoolYearId) => {
					let keyName = 'subject' + studentId + schoolYearId;
					let valueSubject = Subjects.findOne({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }}, {sort: {name: 1}});

					if (valueSubject) {ids[keyName] = valueSubject._id} else {ids[keyName] = 'empty'};
				});
			});
		}

		if (studentIds.length && !schoolYearIds.length) {
			studentIds.forEach((studentId) => {
				let keyName = 'subject' + studentId + 'empty';
				ids[keyName] = 'empty'
			});
		}

		if (!studentIds.length && schoolYearIds.length) {
			schoolYearIds.forEach((schoolYearId) => {
				let keyName = 'subjectempty' + schoolYearId;
				ids[keyName] = 'empty'
			});
		}

		if (!studentIds.length && !schoolYearIds.length) {
			ids.subjectemptyempty = 'empty';
		}


		self.added('initialIds', Random.id(), ids);
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
	Counts.publish(this, 'resourceCount', Resources.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'subjectCount', Subjects.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'reportCount', Reports.find({groupId: groupId, deletedOn: { $exists: false }}));	
	Counts.publish(this, 'userCount', Meteor.users.find({'info.groupId': groupId}));
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