import { Template } from 'meteor/templating';
import { Groups } from '../../../api/groups/groups.js';
import './officeAccountView.html';

Template.officeAccountView.onCreated( function() {
  let template = Template.instance();

  template.autorun(() => {
    this.accountData = Meteor.subscribe('account', FlowRouter.getParam('selectedGroupId'));
    this.accountTotals = Meteor.subscribe('accountTotals', FlowRouter.getParam('selectedGroupId'));
  });

});

Template.officeAccountView.onRendered(function()  {

});

Template.officeAccountView.helpers({
  subscriptionReady: function() {
    if (Template.instance().accountData.ready() && Template.instance().accountTotals.ready()) {
      return true;
    }
    return false;
  },

  account() {
    return Groups.findOne({ _id: FlowRouter.getParam('selectedGroupId') });
  },

  accountUsers() {
    return Meteor.users.find({ 'info.groupId': FlowRouter.getParam('selectedGroupId') });
  },

  accountStats() {
    return Session.get('accountStats');
  },

  userName(first, last) {
    if (first && last) {
      Session.set({ labelTwo: `${first} ${last}` });
    }
    return false;
  },

  isPending(status) {
    if (status === 'pausePending') {
      return 'Pause Pending';
    }
    return status;
  },
});
