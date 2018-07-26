import {Template} from 'meteor/templating';
import './editor.html';
import strip from 'strip';

Template.editor.onCreated( function() {
	let template = Template.instance();
	template.editorId = new ReactiveVar(Random.id());
});

Template.editor.onRendered( function() {
	let template = Template.instance();

	template.autorun( () => {
		let existingContent = Template.currentData().existingContent;
		$('#' + template.editorId.get()).html(existingContent)
	})

	Session.set(template.editorId.get(), $('#' + template.editorId.get()).html());

	document.execCommand('defaultParagraphSeparator', false, 'p');
	document.execCommand('styleWithCSS', false, null);
});

Template.editor.helpers({
	editorId: function() {
		return Template.instance().editorId.get();
	},

	content: function() {
		return Session.get(Template.instance().editorId.get())
	}
});

Template.editor.events({
	'click .js-editor-btn'(event) {
		event.preventDefault();

		let command = $(event.currentTarget).attr('data-command');
		document.execCommand(command, false, '');
		$('.editor-content').focus();
	},

	'click .editor-content, keyup .editor-content, click .js-editor-btn'(event, template) {
		if (document.getElementById(template.editorId.get()).firstChild && document.getElementById(template.editorId.get()).firstChild.nodeType === 3) {
			document.execCommand('formatBlock', false, '<p>')
		}

		if (document.queryCommandState('bold')) {
			$('.js-bold-btn').addClass('active');
		} else {
			$('.js-bold-btn').removeClass('active');
		}

		if (document.queryCommandState('italic')) {
			$('.js-italic-btn').addClass('active');
		} else {
			$('.js-italic-btn').removeClass('active');
		}

		if (document.queryCommandState('underline')) {
			$('.js-underline-btn').addClass('active');
		} else {
			$('.js-underline-btn').removeClass('active');
		}

		if (document.queryCommandState('insertUnorderedList')) {
			$('.js-ul-btn').addClass('active');
		} else {
			$('.js-ul-btn').removeClass('active');
		}

		if (document.queryCommandState('insertOrderedList')) {
			$('.js-ol-btn').addClass('active');
		} else {
			$('.js-ol-btn').removeClass('active');
		}

		let content = $('#' + template.editorId.get()).html();
		if (strip(content).length) {
			Session.set(template.editorId.get(), content);
		} else {
			Session.set(template.editorId.get(), '');
		}
	}
});