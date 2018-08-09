import {Groups} from '../../api/groups/groups.js';
import {Students} from '../../api/students/students.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {Resources} from '../../api/resources/resources.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Lessons} from '../../api/lessons/lessons.js';


let studentProperties = [
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

let schoolYearProperties = [
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

let resources = [
  {
    type: "link",
    searchIndex: [],
    title: "1776 The Declaration of Independence",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "1787 Constitution of the United States",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Alexander Pope AO selections",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Brush Drawing",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Caspar David Friedrich: Chalk Cliffs on Rugen",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Caspar David Friedrich: Moon Rising Over the Sea",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Caspar David Friedrich: On Board a Sailing Ship",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Caspar David Friedrich: The Cross in the Mountains",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Caspar David Friedrich: The Wanderer above the Mists",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Caspar David Friedrich: Woman at a Window",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: "<p>Look at Khan academy video as well.</p>"
  },
  {
    type: "link",
    searchIndex: [],
    title: "Century Chart",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Christina Rossetti AO selections",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: "<p>55 poems from Sing-Song.</p>"
  },
  {
    type: "link",
    searchIndex: [],
    title: "Classics for Kids:Handel",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "CR TV",
    authorFirstName: "Steven Crowder",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Daily Grammar Geek",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: 'Did Marie Antoinette Actually Say “Let Them Eat Cake”?',
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: "<p>From How Stuff Works: Stuff You Missed in History Class. 11 minutes.</p>"
  },
  {
    type: "link",
    searchIndex: [],
    title: "Eugene Field AO selections",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: "<p>38 poems</p>"
  },
  {
    type: "link",
    searchIndex: [],
    title: "F. H. Fragonard: Education is Everything",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Fit2be Healthy Eating",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "George Gordon",
    authorFirstName: "Lord Byron AO selections",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "George Washington's Rules of Civility",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: '"Give Me Liberty or Give Me Death!" Patrick Henry',
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "High School Journal Prompts about Literature",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "History Chart",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: "<p>Explanation of how to do one.</p>"
  },
  {
    type: "link",
    searchIndex: [],
    title: "How the French Revolution Worked podcast",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: "<p>From How Stuff Works: Stuff You Missed in History Class. 30 minutes.</p>"
  },
  {
    type: "link",
    searchIndex: [],
    title: "J. H. Fragonard: A Young Girl Reading",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "J. H. Fragonard: The Music Lesson",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "J. H. Fragonard: The Visit to the Nursery",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: "<p>Also compare The Italian Family.</p>"
  },
  {
    type: "link",
    searchIndex: [],
    title: "J.H. Fragonard: The Grand Cascade at Tivoli",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "J.H. Fragonard: The See-Saw",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: "<p>YouTube 3 minute video: Love and Play: A Pair of Paintings by Fragonard.</p>"
  },
  {
    type: "link",
    searchIndex: [],
    title: "James Whitcombe Riley AO selections",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: "<p>23 poems.</p>"
  },
  {
    type: "link",
    searchIndex: [],
    title: "Jean Honore Fragonard AO Bio",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Khan Academy on Ancient Egypt",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Streams in the Desert",
    authorFirstName: "Mrs. Charles",
    authorLastName: "Cowman",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Attributes of God",
    authorFirstName: "AW",
    authorLastName: "Pink",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Life in the Word",
    authorFirstName: "Sonya",
    authorLastName: "Shafer",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "A Circe Guide to Reading",
    authorFirstName: "",
    authorLastName: "",
    availability: "need",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Ready Readers High School",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Roar on the Other Side: A Guide for Student Poets",
    authorFirstName: "Suzanne",
    authorLastName: "Clark",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Grammar Reinforcements",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "English from the Roots Up",
    authorFirstName: "Joegil",
    authorLastName: "Lundquist",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Motel of Mysteries",
    authorFirstName: "David",
    authorLastName: "Macaulay",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Uarda: A Romance of Ancient Egypt",
    authorFirstName: "Georg",
    authorLastName: "Ebers",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "A Whodehouse book",
    authorFirstName: "",
    authorLastName: "Whodehouse",
    availability: "need",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Gulliver's Travels",
    authorFirstName: "Jonathan",
    authorLastName: "Swift",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Three Men in a Boat",
    authorFirstName: "(To Say Nothing of the Dog)",
    authorLastName: "Jerome",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Fisherman's Lady",
    authorFirstName: "George",
    authorLastName: "MacDonald",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Scarlet Pimpernel",
    authorFirstName: "Emma",
    authorLastName: "Orczy",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Northanger Abbey",
    authorFirstName: "Jane",
    authorLastName: "Austen",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "A Tale of Two Cities",
    authorFirstName: "Charles",
    authorLastName: "Dickens",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "History of English Literature for Boys and Girls",
    authorFirstName: "H.E.",
    authorLastName: "Marshall",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Rasselas",
    authorFirstName: "Prince of Abyssinia",
    authorLastName: "Samuel",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Revelation",
    authorFirstName: "Flannery",
    authorLastName: "O'Connor",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Geometry/Trig",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Mapwork Document: 11th Grade",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "My Book of Centuries",
    authorFirstName: "Christie Groff",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Ancient Egypt and Her Neighbors",
    authorFirstName: "Lorene",
    authorLastName: "Lambert",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Pharaoh's Boat",
    authorFirstName: "David",
    authorLastName: "Weitzman",
    availability: "need",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Great Pyramid",
    authorFirstName: "Elizabeth",
    authorLastName: "Mann",
    availability: "need",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Unwrapping the Pharaohs",
    authorFirstName: "Ashton and",
    authorLastName: "Down",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Hungry Planet",
    authorFirstName: "Peter",
    authorLastName: "Menzel",
    availability: "need",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "America: The Last Best Hope",
    authorFirstName: "Bill",
    authorLastName: "Bennett",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "A History of England from the Landing of Julius Caesar to the Present Day",
    authorFirstName: "HO",
    authorLastName: "Arnold-Forster",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Written Out of History: The Forgotten Founders Who Fought Big Government",
    authorFirstName: "Mike",
    authorLastName: "Lee",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Lafayette and the American Revolution",
    authorFirstName: "Russell",
    authorLastName: "Freedman",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Heidi's Alp: One Family's Search for Storybook Europe",
    authorFirstName: "Christina",
    authorLastName: "Hardyment",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Miracle at Philadelphia",
    authorFirstName: "Catherine",
    authorLastName: "Drinker Bowen",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Constitution Test",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Jr Botany",
    authorFirstName: "Nicole",
    authorLastName: "Williams",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Jr Geology",
    authorFirstName: "Nicole",
    authorLastName: "Williams",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Wicked Plants: The Weed That Killed Lincoln's Mother and Other Botanical Atrocities",
    authorFirstName: "Amy",
    authorLastName: "Stewart",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Control of Nature",
    authorFirstName: "John",
    authorLastName: "McPhee",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Story of Painting",
    authorFirstName: "Horst",
    authorLastName: "Janson",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Vermeer Picture Study Portfolio",
    authorFirstName: "Emily",
    authorLastName: "Kiser",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Hallelujah: A Journey through Advent with Handel’s Messiah",
    authorFirstName: "Cindy",
    authorLastName: "Rollins",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Handel: The Story of a Little Boy Who Practiced in an Attic",
    authorFirstName: "Thomas",
    authorLastName: "Tapper",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "How to Read a Book",
    authorFirstName: "Mortimer",
    authorLastName: "Adler",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "How to Read Slowly",
    authorFirstName: "James",
    authorLastName: "Sire",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Is Reality Optional",
    authorFirstName: "Thomas",
    authorLastName: "Sowell",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Economic Board Game Instructions",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "AOP Interior Decorating",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Plutarch Project Volume Two",
    authorFirstName: "Anne",
    authorLastName: "White",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Ourselves",
    authorFirstName: "Charlotte",
    authorLastName: "Mason",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Laying Down the Rails for Children",
    authorFirstName: "Lanaya",
    authorLastName: "Gore",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Deadliest Monster",
    authorFirstName: "J",
    authorLastName: "Baldwin",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "NIV Bible",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Genesis: Finding Our Roots",
    authorFirstName: "Ruth",
    authorLastName: "Beechick",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "A Beginner's Guide to Constructing the Universe Math",
    authorFirstName: "Michael",
    authorLastName: "Schneider",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Penguin Dictionary of Curious and Interesting Numbers",
    authorFirstName: "David",
    authorLastName: "Wells",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Sacred Numbers",
    authorFirstName: "Miranda",
    authorLastName: "Lundy",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "In His Steps",
    authorFirstName: "Charles",
    authorLastName: "Sheldon",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "VideoText Algebra I",
    authorFirstName: "Tom",
    authorLastName: "Clark",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Penguin Book of Curious and Interesting Numbers",
    authorFirstName: "David",
    authorLastName: "Wells",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Spelling Wisdom",
    authorFirstName: "Sonya",
    authorLastName: "Shafer",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Oxford Book of English Verse",
    authorFirstName: "Arthur",
    authorLastName: "Quiller-Couch",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Oxford Book of American Verse",
    authorFirstName: "F.O.",
    authorLastName: "Matthiessen",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Adventures of Huckleberry Finn",
    authorFirstName: "Mark",
    authorLastName: "Twain",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Age of Fable",
    authorFirstName: "Thomas",
    authorLastName: "Bullfinch",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Cat of Bubastes : A Tale of Ancient Egypt",
    authorFirstName: "GA",
    authorLastName: "Henty",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Around the World in 80 Days",
    authorFirstName: "Jules",
    authorLastName: "Verne",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Book of Golden Deeds",
    authorFirstName: "Charlotte",
    authorLastName: "Yonge",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Screwtape Letters",
    authorFirstName: "CS",
    authorLastName: "Lewis",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Two Years Before the Mast",
    authorFirstName: "Richard",
    authorLastName: "Dana",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "White Fang",
    authorFirstName: "Jack",
    authorLastName: "London",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Innocence of Father Brown",
    authorFirstName: "GK",
    authorLastName: "Chesterton",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Pushcart War",
    authorFirstName: "Jean",
    authorLastName: "Merrill",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Jr. Chemistry",
    authorFirstName: "Nicole",
    authorLastName: "Williams",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Jr. Tech and Engineering",
    authorFirstName: "Nicole",
    authorLastName: "Williams",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Secrets from the Rocks",
    authorFirstName: "Albert",
    authorLastName: "Marrin",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "First Studies of Plant Life",
    authorFirstName: "George Francis",
    authorLastName: "Atkinson",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "America Grows Up: A History for Peter",
    authorFirstName: "Gerald",
    authorLastName: "Johnson",
    availability: "need",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Story of Briatin: From William of Orange to World War II",
    authorFirstName: "R.J.",
    authorLastName: "Unstead",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Diary of an Early American Boy",
    authorFirstName: "Eric",
    authorLastName: "Sloan",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Peter the Great",
    authorFirstName: "Jacob",
    authorLastName: "Abbott",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Case for Faith",
    authorFirstName: "Lee",
    authorLastName: "Strobel",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Book of Marvels: The Orient",
    authorFirstName: "Richard",
    authorLastName: "Halliburton",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Whatever Happened to Penny Candy",
    authorFirstName: "Richard",
    authorLastName: "Maybury",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Life of Fred Liver",
    authorFirstName: "Stanley",
    authorLastName: "Schmidt",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Life of Fred Mineshaft",
    authorFirstName: "Stanley",
    authorLastName: "Schmidt",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Magic Lens 1",
    authorFirstName: "Michael Clay",
    authorLastName: "Thompson",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Black Ships Before Troy",
    authorFirstName: "Rosemary",
    authorLastName: "Sutcliff",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Hobbit",
    authorFirstName: "JRR",
    authorLastName: "Tolkein",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Oliver Twist",
    authorFirstName: "Charles",
    authorLastName: "Dickens",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Number Stories of Long Ago",
    authorFirstName: "David Eugene",
    authorLastName: "Smith",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "What's Your Angle Pythagoras?",
    authorFirstName: "Julie",
    authorLastName: "Ellis",
    availability: "need",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Little Town on the Prairie",
    authorFirstName: "Laura",
    authorLastName: "Ingalls",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Laddie",
    authorFirstName: "Gene Stratton",
    authorLastName: "Porter",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Celtic Fairy Tales",
    authorFirstName: "Joseph",
    authorLastName: "Jacobs",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Where the Red Fern Grows",
    authorFirstName: "Wilson",
    authorLastName: "Rawls",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "School of the Woods",
    authorFirstName: "William J",
    authorLastName: "Long",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Jack and Jill",
    authorFirstName: "Louisa May",
    authorLastName: "Alcott",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Swiss Family Robinson",
    authorFirstName: "Johann",
    authorLastName: "Wyss",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Penrod",
    authorFirstName: "Booth",
    authorLastName: "Tarkington",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Calico Captive",
    authorFirstName: "Elizabeth George",
    authorLastName: "Speare",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Writing and Rhetoric Book 1",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Writing and Rhetoric Book 2",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Print to Cursive Proverbs",
    authorFirstName: "Sonya",
    authorLastName: "Shafer",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Christian Liberty Reader Book 5",
    authorFirstName: "Worthington",
    authorLastName: "Hooker",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Discovering Density",
    authorFirstName: "Jacqueline",
    authorLastName: "Barber",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Jack's Insects",
    authorFirstName: "Edmund",
    authorLastName: "Selous",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Galileo and the Magic Numbers",
    authorFirstName: "Sidney",
    authorLastName: "Rosen",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Golden Goblet",
    authorFirstName: "Eloise",
    authorLastName: "McGraw",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Story of Napoleon",
    authorFirstName: "HE",
    authorLastName: "Marshall",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Poor Richard",
    authorFirstName: "James",
    authorLastName: "Daugherty",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "What's the Big Deal?",
    authorFirstName: "Brenna and Stanton",
    authorLastName: "Jones",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Handbook of Nature Study",
    authorFirstName: "Anna Botsford",
    authorLastName: "Comstock",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "RightStart Level D",
    authorFirstName: "Joan",
    authorLastName: "Cotter",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Delightful Reading Level 3",
    authorFirstName: "Lanaya",
    authorLastName: "Gore",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Treadwell Readers",
    authorFirstName: "Harriette Taylor",
    authorLastName: "Treadwell",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Understood Betsy",
    authorFirstName: "Dorothy",
    authorLastName: "Fisher",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Jungle Book",
    authorFirstName: "Rudyard",
    authorLastName: "Kipling",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Tales from Shakespeare",
    authorFirstName: "Charles and Mary",
    authorLastName: "Lamb",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Five Little Peppers and How They Grew",
    authorFirstName: "Margaret",
    authorLastName: "Sidney",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Farmer Boy",
    authorFirstName: "Laura",
    authorLastName: "Ingalls",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Mary Poppins",
    authorFirstName: "PL",
    authorLastName: "Travers",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Pilgrim's Progress: Christiana's Journey",
    authorFirstName: "John",
    authorLastName: "Bunyan",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Stuart Little",
    authorFirstName: "EB",
    authorLastName: "White",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Alice's Adventures in Wonderland",
    authorFirstName: "Lewis",
    authorLastName: "Carroll",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "A Little Princess",
    authorFirstName: "Frances",
    authorLastName: "Hodgson Burnett",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Borrowers",
    authorFirstName: "Mary",
    authorLastName: "Norton",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Courage of Sarah Noble",
    authorFirstName: "Alice",
    authorLastName: "Dalgliesh",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "A Drop of Water",
    authorFirstName: "Walter",
    authorLastName: "Wick",
    availability: "need",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Trees and Shrubs",
    authorFirstName: "Arabella",
    authorLastName: "Buckley",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Secrets of the Woods",
    authorFirstName: "William J",
    authorLastName: "Long",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The True Story of Noah's Ark",
    authorFirstName: "Tom",
    authorLastName: "Dooley",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Stories of America I",
    authorFirstName: "Charles",
    authorLastName: "Morris",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Can't You Make Them Behave",
    authorFirstName: "King George?",
    authorLastName: "Jean",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "George Washington's Breakfast",
    authorFirstName: "Jean",
    authorLastName: "Fritz",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Where was Patrick Henry on the 29th of May?",
    authorFirstName: "Jean",
    authorLastName: "Fritz",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Viking Tales",
    authorFirstName: "Jeannie",
    authorLastName: "Hall",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "The Heroes",
    authorFirstName: "Charles",
    authorLastName: "Kingsley",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Charlotte Mason's Geographical Reader",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Play and Learn Spanish",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Logic Links",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Stepping Stones: A Path to Critical Thinking",
    authorFirstName: "Vera",
    authorLastName: "Schneider",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Drawing with Children",
    authorFirstName: "Mona",
    authorLastName: "Brooks",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Before I Was Born",
    authorFirstName: "Carolyn",
    authorLastName: "Nystrom",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Copybook",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "book",
    searchIndex: [],
    title: "Science’s Useful Fallacy",
    authorFirstName: "Martin",
    authorLastName: "Cothran",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: '"Letters to his Son" by Lord Chesterfield',
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: "<p>Choose a couple to read.</p>"
  },
  {
    type: "app",
    searchIndex: [],
    title: "Charity Miles",
    authorFirstName: "",
    authorLastName: "",
    availability: "need",
    description: ""
  },
  {
    type: "app",
    searchIndex: [],
    title: "Mavis Beacon Teaches Typing",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "app",
    searchIndex: [],
    title: "Mango Spanish",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "app",
    searchIndex: [],
    title: "State the States and Capitals",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "app",
    searchIndex: [],
    title: "Oceans and Continents",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "app",
    searchIndex: [],
    title: "Fun Spanish",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "app",
    searchIndex: [],
    title: "Times Table Warp",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "app",
    searchIndex: [],
    title: "Samorost Puzzle Game",
    authorFirstName: "",
    authorLastName: "",
    availability: "need",
    description: ""
  },
  {
    type: "app",
    searchIndex: [],
    title: "Civilization by Sid Meier",
    authorFirstName: "",
    authorLastName: "",
    availability: "need",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Newsela",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: "<p>Science News.</p>"
  },
  {
    type: "link",
    searchIndex: [],
    title: "Phillis Wheatley AO selections",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "PSAT 8/9 Student Guide",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Puzzle Paradise",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Science News for Students",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Spanish Playground game ideas",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Star Academy Class Day",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Student News Daily",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "The Briefing podcast",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "The Iliad Summary and Plot",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "video",
    searchIndex: [],
    title: "AO Folk Songs 18/19",
    authorFirstName: "",
    authorLastName: "",
    availability: "need",
    description: ""
  },
  {
    type: "video",
    searchIndex: [],
    title: "John Adams miniseries",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "video",
    searchIndex: [],
    title: "Who Was....? Thomas Jefferson",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "video",
    searchIndex: [],
    title: "Building Big video series",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "video",
    searchIndex: [],
    title: "AO Hymn Study 18/19",
    authorFirstName: "",
    authorLastName: "",
    availability: "need",
    description: ""
  },
  {
    type: "video",
    searchIndex: [],
    title: "Bernstein’s Young People’s Concerts",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "video",
    searchIndex: [],
    title: "Handel: Messiah",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "video",
    searchIndex: [],
    title: "Handel: Water Music",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "video",
    searchIndex: [],
    title: "Handel: Organ Concerti",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "video",
    searchIndex: [],
    title: "Handel: Rinaldo",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "video",
    searchIndex: [],
    title: "Handel: Harmonious Blacksmith",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "video",
    searchIndex: [],
    title: "Prager U",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Walter de la Mare AO selections",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "William Cowper AO selections",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  },
  {
    type: "link",
    searchIndex: [],
    title: "Writing Prompts",
    authorFirstName: "",
    authorLastName: "",
    availability: "own",
    description: ""
  }
];

let schoolWorkItems = [
  {
    name: "Artist Study: Vermeer",
    description: "<p>1632-1675 Dutch Baroque. Morning Time.</p>",
    resourceTitles: ['Vermeer Picture Study Portfolio'],
    timesPerWeek: 2
  },
  {
    name: "Composer Study: Baroque Era",
    description: "<p>Morning Time.</p>",
    timesPerWeek: 2
  },
  {
    name: "Current Events",
    description: "<p>Listen to News Podcasts. Read Student Daily News. Watch talk shows and discuss with Dad. Read weekly blogs about current interests.</p>",
    timesPerWeek: 5
  },
  {
    name: "Botany",
    description: "<p>Read magazine article first day.</p>",
    resourceTitles: ["First Studies of Plant Life", "Jr Botany", "Science’s Useful Fallacy"],
    timesPerWeek: 5
  },
  {
    name: "Daily Grammar Geek",
    description: "<p>Morning Time.</p>",
    resourceTitles: ["Daily Grammar Geek"],
    timesPerWeek: 2
  },
  {
    name: "History of English Literature",
    description: "<p>Chapters 60-85. Read 2 chapters a week. Read 3 chapters one week.</p>",
    resourceTitles: ["History of English Literature for Boys and Girls"],
    timesPerWeek: 3
  },
  {
    name: "Tale of Two Cities",
    description: "",
    resourceTitles: ["Tale of Two Cities", "Ready Readers High School"],
    timesPerWeek: 2
  },
  {
    name: "Vocabulary",
    description: "<p>Morning Time</p>",
    resourceTitles: ["English from the Roots Up"],
    timesPerWeek: 5
  },
  {
    name: "Geography: Heidi's Alps",
    description: "<p>Read about 8 pages a week. Follow the Mapwork document ~ there are some things for map work that you'll do for every chapter in this book.</p>",
    resourceTitles: ["Heidi's Alp: One Family's Search for Storybook Europe"],
    timesPerWeek: 2
  },
  {
    name: "Geometry / Trigonometry",
    description: "<p>Look at two sources of help before coming to ask for help from parents.</p>",
    resourceTitles: ["Geometry/Trig"],
    timesPerWeek: 5
  },
  {
    name: "Government: Miracle at Philadelphia",
    description: "<p>Do one chapter a week.</p>",
    resourceTitles: ["Miracle at Philadelphia"],
    timesPerWeek: 3
  },
  {
    name: "History: Ancient Egypt and Near East",
    description: "<p>Morning Time.</p>",
    resourceTitles: ["Ancient Egypt and Her Neighbors", "Hungry Planet", "Khan Academy on Ancient Egypt", "Pharaoh's Boat", "The Great Pyramid", "Unwrapping the Pharaohs"],
    timesPerWeek: 3
  },
  {
    name: "Great Speeches",
    description: "<p>Morning Time. Read long ones over two weeks.</p>",
    resourceTitles: ['"Give Me Liberty or Give Me Death!" Patrick Henry', '"Letters to his Son" by Lord Chesterfield', 'Did Marie Antoinette Actually Say “Let Them Eat Cake”?', 'How the French Revolution Worked podcast'],
    timesPerWeek: 2
  },
  {
    name: "Logic: How to Read a Book",
    description: "<p>Start at page 363. Do 2 or 3 of the tests.</p>",
    resourceTitles: ["How to Read a Book"],
    timesPerWeek: 2
  }
]

Meteor.methods({
	addTestData() {
		if (!Groups.findOne({_id: Meteor.user().info.groupId}).appAdmin) {
			throw new Meteor.Error('no-role-app', 'You do not have permission to add test data.');
		}
		let groupId = Meteor.user().info.groupId;

        // console.log('Students Start');
		studentProperties.forEach((student, index) => {
			let studentId = Students.insert(student);
		});
        // console.log('Students Finish');

        // console.log('School Years Start');
		schoolYearProperties.forEach((schoolYear, index) => {
			let termProperties = schoolYear.terms;
			delete schoolYear.terms;
			let schoolYearId = SchoolYears.insert(schoolYear);

			termProperties.forEach(function (term, index) {
				term.schoolYearId = schoolYearId;
				let weekCount = term.weeksPerTerm;
				delete term.weeksPerTerm;
				let termId = Terms.insert(term);

				for (i = 0; i < weekCount; i++) { 
				    Weeks.insert({order: i + 1, termId: termId});
				} 
			})
		});
        // console.log('School Years Finish');

        // console.log('Resources Start');
		resources.forEach((resource, index) => {
			Resources.insert(resource);
		});
      // console.log('Resources Finish');

      schoolWorkItems.forEach((schoolWork) => {
          if (schoolWork.resourceTitles) {
              schoolWork.resources = Resources.find({title: {$in: schoolWork.resourceTitles}}).map(resource => resource._id);
          } else {
              schoolWork.resources = [];
          }
      });

      // console.log('School Work Start');
		Students.find({groupId: groupId, firstName: 'Lanaya'}).forEach((student, index) => {
			SchoolYears.find({groupId: groupId, startYear: {$lte: '2018'}}).forEach((schoolYear, index) => {
				schoolWorkItems.forEach((schoolWork) => {
					schoolWork.studentId = student._id;
					schoolWork.schoolYearId = schoolYear._id;

                    // console.log('resources: ' + schoolWork.resources)
					let timesPerWeek = schoolWork.timesPerWeek;
					delete schoolWork.timesPerWeek;
                    delete schoolWork.resourceTitles

					let schoolWorkId = SchoolWork.insert(schoolWork);
					schoolWork.timesPerWeek = timesPerWeek;
                    // console.log('School Work Id: ' + schoolWorkId);

					Terms.find({groupId: groupId, schoolYearId: schoolYear._id}).forEach((term, index) => {
						Weeks.find({termId: term._id}).forEach((week, index) => {
							for (i = 0; i < timesPerWeek; i++) { 
                            // console.log(week._id +" "+ schoolWorkId);
                                let lessonProperties = {
                                    order: parseFloat((index + 1) + '.' + (i + 1)), 
                                    weekId: week._id, 
                                    schoolWorkId: schoolWorkId
                                }
                                if (lessonProperties.order < 4 ) {
                                    lessonProperties.completed = true
                                }

                                if (schoolYear.startYear < '2018') {
                                    lessonProperties.completed = true
                                } else if (lessonProperties.order > 3.9 && lessonProperties.order <= parseFloat('5.' + Math.floor(timesPerWeek / 2).toString())) {
                                    lessonProperties.completed = true
                                }
							    Lessons.insert(lessonProperties);
							}
						});
					});
				})
			});
		});
        // console.log('School Work Finish');

		Groups.update(groupId, {$set: {testData: true}});
	},

	removeTestData() {
		if (!Groups.findOne({_id: Meteor.user().info.groupId}).appAdmin) {
			throw new Meteor.Error('no-role-app', 'You do not have permission to add test data.');
		}

		let groupId = Meteor.user().info.groupId

		Lessons.remove({groupId: groupId});
		SchoolWork.remove({groupId: groupId});
		Weeks.remove({groupId: groupId});
		Terms.remove({groupId: groupId});
		SchoolYears.remove({groupId: groupId});
		Students.remove({groupId: groupId});
		Resources.remove({groupId: groupId});
		Groups.update(groupId, {$set: {testData: false}});
	}
});







