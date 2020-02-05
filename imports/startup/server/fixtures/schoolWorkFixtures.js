import {Groups} from '../../../api/groups/groups.js';
import {Students} from '../../../api/students/students.js';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Terms} from '../../../api/terms/terms.js';
import {Weeks} from '../../../api/weeks/weeks.js';
import {Resources} from '../../../api/resources/resources.js';
import {SchoolWork} from '../../../api/schoolWork/schoolWork.js';

import {primaryInitialIds, resourcesInitialIds, usersInitialId, reportsInitialId, groupsInitialId} from '../../../modules/server/initialIds';
import {upsertPaths, upsertSchoolWorkPaths} from '../../../modules/server/paths';
import {upsertStats} from '../../../modules/server/stats';

Meteor.methods({
	addSchoolWorkFixtures() {
		let groupId = Meteor.user().info.groupId;
		let userId = Meteor.userId();

		let studentCount = Students.find({groupId: groupId}, {fields: {_id: 1}}).count();
		let schoolYearCount = SchoolYears.find({groupId: groupId}, {fields: {_id: 1}}).count();

		if (!Groups.findOne({_id: groupId}).appAdmin) {
			throw new Meteor.Error('no-role-app', 'You do not have permission to add test data.');
		}

		if (!studentCount || !schoolYearCount) {
			throw new Meteor.Error('no-students', 'You must add Students and School Years before adding School Work.');
		}

		let sourceSchoolWork = [
			{
				name: "Artist Study: Vermeer",
				description: "<p>1632-1675 Dutch Baroque. Morning Time.</p>",
				resourceTitles: ['Vermeer Picture Study Portfolio'],
			},
			{
				name: "Composer Study: Baroque Era",
				description: "<p>Morning Time.</p>",
				resourceTitles: [],
			},
			{
				name: "Current Events",
				description: "<p>Listen to News Podcasts. Read Student Daily News. Watch talk shows and discuss with Dad. Read weekly blogs about current interests.</p>",
				resourceTitles: [],
			},
			{
				name: "Botany",
				description: "<p>Read magazine article first day.</p>",
				resourceTitles: ["First Studies of Plant Life", "Jr Botany", "Science’s Useful Fallacy"],
			},
			{
				name: "Daily Grammar Geek",
				description: "<p>Morning Time.</p>",
				resourceTitles: ["Daily Grammar Geek"],
			},
			{
				name: "History of English Literature",
				description: "<p>Chapters 60-85. Read 2 chapters a week. Read 3 chapters one week.</p>",
				resourceTitles: ["History of English Literature for Boys and Girls"],
			},
			{
				name: "Tale of Two Cities",
				description: "",
				resourceTitles: ["Tale of Two Cities", "Ready Readers High School"],
			},
			{
				name: "Vocabulary",
				description: "<p>Morning Time</p>",
				resourceTitles: ["English from the Roots Up"],
			},
			{
				name: "Geography: Heidi's Alps",
				description: "<p>Read about 8 pages a week. Follow the Mapwork document ~ there are some things for map work that you'll do for every chapter in this book.</p>",
				resourceTitles: ["Heidi's Alp: One Family's Search for Storybook Europe"],
			},
			{
				name: "Geometry / Trigonometry",
				description: "<p>Look at two sources of help before coming to ask for help from parents.</p>",
				resourceTitles: ["Geometry/Trig"],
			},
			{
				name: "Government: Miracle at Philadelphia",
				description: "<p>Do one chapter a week.</p>",
				resourceTitles: ["Miracle at Philadelphia"],
			},
			{
				name: "History: Ancient Egypt and Near East",
				description: "<p>Morning Time.</p>",
				resourceTitles: ["Ancient Egypt and Her Neighbors", "Hungry Planet", "Khan Academy on Ancient Egypt", "Pharaoh's Boat", "The Great Pyramid", "Unwrapping the Pharaohs"],
			},
			{
				name: "Great Speeches",
				description: "<p>Morning Time. Read long ones over two weeks.</p>",
				resourceTitles: ['"Give Me Liberty or Give Me Death!" Patrick Henry', '"Letters to his Son" by Lord Chesterfield', 'Did Marie Antoinette Actually Say “Let Them Eat Cake”?', 'How the French Revolution Worked podcast'],
			},
			{
				name: "Logic: How to Read a Book",
				description: "<p>Start at page 363. Do 2 or 3 of the tests.</p>",
				resourceTitles: ["How to Read a Book"],
			}
		];

		let fixtureSchoolWork = [];

		// Insert School Work
		sourceSchoolWork.forEach(schoolWork => {
			if (schoolWork.resourceTitles) {
				schoolWork.resources = Resources.find({groupId: groupId, title: {$in: schoolWork.resourceTitles}}).map(resource => resource._id);
			} else {
				schoolWork.resources = [];
			}
			delete schoolWork.resourceTitles
		});

		SchoolYears.find({groupId: groupId}, {sort: {startYear: 1}, fields: {_id: 1}, limit: 2}).forEach(schoolYear => {
			Students.find({groupId: groupId}, {fields: {_id: 1}}).forEach(student => {
				sourceSchoolWork.forEach(schoolWork => {
					fixtureSchoolWork.push({
						name: schoolWork.name,
						description: schoolWork.description,
						resources: schoolWork.resources,
						schoolYearId: schoolYear._id,
						studentId: student._id,
						groupId: groupId, 
						userId: userId, 
						createdOn: new Date()
					});
				});
			});
		});

		SchoolWork.batchInsert(fixtureSchoolWork, function() {
			Groups.update(groupId, {$set: {'fixtureData.hasSchoolWorkData': true}});

			let pathProperties = {
				studentIds: Students.find({groupId: groupId}).map(student => student._id),
				schoolYearIds: SchoolYears.find({groupId: groupId}).map(schoolYear => schoolYear._id),
				termIds: Terms.find({groupId: groupId}).map(term => term._id),
			}

			upsertPaths(pathProperties, false, groupId);
			upsertSchoolWorkPaths(pathProperties, groupId);

			let statProperties = {
				studentIds: Students.find({groupId: groupId}).map(student => student._id),
				schoolYearIds: SchoolYears.find({groupId: groupId}).map(schoolYear => schoolYear._id),
				termIds: Terms.find({groupId: groupId}).map(term => term._id),
				weekIds: Weeks.find({groupId: groupId}).map(week => week._id),
			}
			
			upsertStats(statProperties, groupId);
			primaryInitialIds(groupId);
		});

		return Groups.findOne({_id: groupId}).initialIds;
	}
});