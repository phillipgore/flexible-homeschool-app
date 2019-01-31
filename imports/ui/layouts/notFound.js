import {Template} from 'meteor/templating';
import './notFound.html';

Template.notFound.onRendered( function() {
	$('.loading-initializing').fadeOut('fast', function() {
		$(this).remove();
	});
});