import {Template} from 'meteor/templating';
import './dialog.html';

Dialogs = new Mongo.Collection(null);

Template.dialog.helpers({
	dialog: function() {
		return Dialogs.findOne();
	},
});

Template.dialog.events({
	'click .js-dialog-cancel'(event) {
		event.preventDefault();
		const dialogId = Dialogs.findOne()._id;
		Dialogs.remove({_id: dialogId});
	},
});