import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Paths = new Mongo.Collection('paths');

Paths.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Paths.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const PathsSchema = new SimpleSchema({
	studentId: {
		type: String,
		label: "Student ID"
	},
    schoolYearId: {
		type: String,
		label: "School Year ID"
	},
	firstTermId: {
		type: String,
		label: "First Term ID"
	},
	firstWeekId: {
		type: String,
		label: "First Week ID"
	},
});

Paths.attachSchema(PathsSchema);




