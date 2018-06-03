import {Template} from 'meteor/templating';
import './print.html';

Template.print.events({
	'click .js-print'(event) {
		window.print();
	},
});

