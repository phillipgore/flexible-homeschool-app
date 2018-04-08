import {Groups} from '../../api/groups/groups.js';
import {Students} from '../../api/students/students.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {Resources} from '../../api/resources/resources.js';
import {Subjects} from '../../api/subjects/subjects.js';
import {Lessons} from '../../api/lessons/lessons.js';


const studentProperties = [
	{
		firstName: 'Lanaya',
		middleName: 'Elizabeth',
		lastName: 'Gore',
		nickname: 'Liz',
		preferredFirstName: {
			type: 'middleName',
			name: 'Elizabeth',
		},
		birthday: 'Dec 3, 2001',
	},
	{
		firstName: 'Jonathan',
		middleName: 'Ashford',
		lastName: 'Gore',
		nickname: 'Jon',
		preferredFirstName: {
			type: 'firstName',
			name: 'Jonathan',
		},
		birthday: 'Jun 2, 2004',
	},
	{
		firstName: 'Phoebe',
		middleName: 'Ruth',
		lastName: 'Gore',
		nickname: 'The Phebes',
		preferredFirstName: {
			type: 'firstName',
			name: 'Phoebe',
		},
		birthday: 'Apr 13, 2006',
	},
	{
		firstName: 'Harrison',
		middleName: 'Lee',
		lastName: 'Gore',
		nickname: 'Harry',
		preferredFirstName: {
			type: 'firstName',
			name: 'Harrison',
		},
		birthday: 'Jun 6, 2010',
	},
];

const schoolYearProperties = [
	{
		startYear: '2016',
		endYear: '2017',
		terms: [
			{order: 1, weeksPerTerm: 12},
			{order: 2, weeksPerTerm: 12},
			{order: 3, weeksPerTerm: 12},
		],
	},
	{
		startYear: '2017',
		endYear: '2018',
		terms: [
			{order: 1, weeksPerTerm: 9},
			{order: 2, weeksPerTerm: 9},
			{order: 3, weeksPerTerm: 9},
			{order: 4, weeksPerTerm: 9},
		],
	},
	{
		startYear: '2018',
		endYear: '2019',
		terms: [
			{order: 1, weeksPerTerm: 12},
			{order: 2, weeksPerTerm: 12},
			{order: 3, weeksPerTerm: 12},
		],
	},
	{
		startYear: '2019',
		endYear: '2020',
		terms: [
			{order: 1, weeksPerTerm: 9},
			{order: 2, weeksPerTerm: 9},
			{order: 3, weeksPerTerm: 9},
			{order: 4, weeksPerTerm: 9},
		],
	},
];

const resources = [
	{
		type: 'book',
		searchIndex: ['Books', 'KindleStore'],
		title: 'Exploring Creation with Chemistry',
		authorFirstName: 'Jay L.',
		authorLastName: 'Wile',
		availability: 'own',
		publisher: 'Apologia Educational Ministries',
		publicationDate: 'May 2011',
		description: "This course is designed to be a first-year high school chemistry course. The course covers significant figures, units, classification, the mole concept, stoichiometry, thermochemistry, thermodynamics, kinetics, acids and bases, redox reactions, solutions, atomic structure, Lewis structures, molecular geometry, the gas laws, and equilibrium. Requires the completion of algebra 1 as a prerequisite.",
	},
	{
		type: 'app',
		searchIndex: ['Software', 'MobileApps'],
		title: 'Photoshop',
		availability: 'own',
		link: 'https://www.adobe.com/products/photoshop.html',
		description: 'Digital photo editing app.',
	},
	{
		type: 'book',
		searchIndex: ['Books', 'KindleStore'],
		title: 'My Texas',
		authorFirstName: 'Robert C.',
		authorLastName: 'Law',
		availability: 'own',
		publisher: 'Our Land Publications',
		publicationDate: '2013',
		link: 'http://www.ourlandpublications.com',
		description: 'A Texas history cirriculum in a format tailor made for the elementary age student explorer.',
	},
	{
		type: 'book',
		searchIndex: ['Books', 'KindleStore'],
		title: 'Spelling Wisdom, Book 1',
		authorFirstName: 'Sonya',
		authorLastName: 'Shafer',
		availability: 'own',
		publisher: 'Simply Charlotte Mason',
		publicationDate: '2006',
		link: 'https://simplycharlottemason.com/store/spelling-wisdom-book-1/',
		description: "Learn today’s 6,000 most frequently used words presented in the writings of great men and women of history! Now you can have the confidence that you’re teaching the words your student needs to know, using the Charlotte Mason method of prepared dictation.",
	},
	{
		type: 'book',
		searchIndex: ['Books', 'KindleStore'],
		title: 'The Grammar Key',
		authorFirstName: 'Rober L.',
		author: 'Conklin',
		availability: 'need',
		publisher: 'RLC Company',
		publicationDate: '1996',
	},
	{
		type: 'link',
		searchIndex: [],
		title: 'Daily Grammar Geek',
		link: 'http://www.dailygrammargeek.com/',
	},
	{
		type: 'book',
		searchIndex: ['Books', 'KindleStore'],
		title: 'Hymns and Prose',
		authorFirstName: 'Lanaya',
		authorLastName: 'Gore',
		availability: 'own',
		publisher: 'Simply Charlotte Mason',
	},
	{
		type: 'book',
		searchIndex: ['Books', 'KindleStore'],
		title: 'Rightstart Mathematics, Level C',
		authorFirstName: 'John A.',
		authorLastName: 'Cotter',
		availability: 'own',
		publisher: 'Activities for Learning',
		description: 'The RS2 Level C Lessons continues to build on known addition and subtraction facts, works with 4-digit addition and subtraction and 2-digit mental calculations and introduces multiplication and fractions.',
	},
	{
		type: 'app',
		searchIndex: ['Software', 'MobileApps'],
		title: 'Times Warp App',
		availability: 'own',
		publisher: 'Tinman Learning',
		link: 'https://itunes.apple.com/us/app/times-tables-warp/id414018536?mt=12',
	},
	{
		type: 'book',
		searchIndex: ['Books', 'KindleStore'],
		title: "In Freedom's Cause: A Story of Wallace and Bruce",
		authorFirstName: 'G. A.',
		authorLastName: 'Henty',
		availability: 'borrowed',
		publisher: 'CreateSpace Independent Publishing Platform',
		publicationDate: 'February 6, 2016',
		description: "Another stirring tale from the master of historical fiction set in the time of Robert Bruce and William Wallace and their struggle for Scotland's independence.",
	}
];

const subjects = [
	[
		{
			order: 1,
			name: 'Chemistry',
			description: 'Learn basic chemistry.',
			resources: [],
			timesPerWeek: 3,
		},
		{
			order: 2,
			name: 'Photography',
			description: 'Learn basic photography skills.',
			resources: [],
			studentId: '',
			schoolYearId: '',
			timesPerWeek: 1,
		},
	],

	[
		{
			order: 1,
			name: 'Texas History', 
			description: 'Learn an overview of Texas history.',
			resources: [],
			timesPerWeek: 3,
		},
		{
			order: 2,
			name: 'Spelling',
			description: 'Improve spelling.',
			resources: [],
			timesPerWeek: 2,
		},
	],

	[
		{
			order: 1,
			name: 'Grammar',
			description: 'Learn basic grammar.',
			resources: [],
			timesPerWeek: 2,
		},
		{
			order: 2,
			name: 'Read Aloud',
			description: 'Read assigned material outloud.',
			resources: [],
			timesPerWeek: 5,
		},
	],

	[
		{
			order: 1,
			name: 'Math',
			description: 'Learn basic math.',
			resources: [],
			timesPerWeek: 5,
		},
		{
			order: 2,
			name: 'Free Reads',
			description: 'Practice reading.',
			resources: [],
			timesPerWeek: 5,
		}
	],
];

Meteor.methods({
	addTestData() {
		if (!Groups.findOne({_id: Meteor.user().info.groupId}).appAdmin) {
			throw new Meteor.Error('no-role-app', 'You do not have permission to add test data.');
		}
		let groupId = Meteor.user().info.groupId;

		studentProperties.forEach((student, index) => {
			let studentId = Students.insert(student);
		});

		schoolYearProperties.forEach((schoolYear, index) => {
			let termProperties = schoolYear.terms;
			delete schoolYear.terms;
			let schoolYearId = SchoolYears.insert(schoolYear);

			termProperties.forEach((term, index) => {
				term.schoolYearId = schoolYearId;
				let weekCount = term.weeksPerTerm;
				delete term.weeksPerTerm;
				let termId = Terms.insert(term);

				for (i = 0; i < weekCount; i++) { 
				    Weeks.insert({order: i + 1, termId: termId});
				} 
			})
		});

		resources.forEach((resource, index) => {
			Resources.insert(resource);
		});

		Students.find({groupId: groupId}).forEach((student, index) => {
			SchoolYears.find({groupId: groupId}).forEach((schoolYear, index) => {
				subjects[index].forEach((subject) => {
					subject.studentId = student._id;
					subject.schoolYearId = schoolYear._id;
					let timesPerWeek = subject.timesPerWeek;
					delete subject.timesPerWeek;

					let subjectId = Subjects.insert(subject);

					subject.timesPerWeek = timesPerWeek;

					Terms.find({schoolYearId: schoolYear._id}).forEach((term, index) => {
						Weeks.find({termId: term._id}).forEach((week, index) => {
							for (i = 0; i < timesPerWeek; i++) { 
							    Lessons.insert({order: parseFloat((index + 1) + '.' + (i + 1)), weekId: week._id, subjectId: subjectId});
							}
						});
					});
				})
			});
		});

		Groups.update(groupId, {$set: {testData: true}});
	},

	removeTestData() {
		if (!Groups.findOne({_id: Meteor.user().info.groupId}).appAdmin) {
			throw new Meteor.Error('no-role-app', 'You do not have permission to add test data.');
		}

		let groupId = Meteor.user().info.groupId

		Lessons.remove({groupId: groupId});
		Subjects.remove({groupId: groupId});
		Weeks.remove({groupId: groupId});
		Terms.remove({groupId: groupId});
		SchoolYears.remove({groupId: groupId});
		Students.remove({groupId: groupId});
		Resources.remove({groupId: groupId});
		Groups.update(groupId, {$set: {testData: false}});
	}
});







