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

  group: function() {
    return Groups.findOne({ _id: FlowRouter.getParam('selectedGroupId')});
  },

  admin: function() {
    return Meteor.users.findOne({'info.groupId': FlowRouter.getParam('selectedGroupId'), 'info.role': 'Administrator'}, {sort: {createdAt: 1}});
  },

  users: function() {
    return Meteor.users.find({'info.groupId': FlowRouter.getParam('selectedGroupId')}, {sort: {createdAt: 1}});
  },

  isPending(status) {
    if (status === 'pausePending') {
      return 'Pause Pending';
    }
    return status;
  },
});

Template.officeAccountView.events({
  'click .js-impersonate-admin': function(event) {
    Meteor.call('impersonateAdmin', event.currentTarget.id, function(error) {
      if (error) {
        Alerts.insert({
          colorClass: 'bg-danger',
          iconClass: 'icn-danger',
          message: error.reason,
        });
      } else {
        Meteor.connection.setUserId(event.currentTarget.id);
        Session.set({
          isImpersonation: true,
          appAdminId: Meteor.userId(),
          selectedFramePosition: '',
          selectedFrameClass: '',
          selectedStudentId: '',
          selectedSchoolYearId: '',
          selectedResourceType: '',
          selectedResourceAvailability: '',
          selectedResourceId: '',
          selectedResourceCurrentTypeId: '',
          selectedTermId: '',
          selectedReportingTermId: '',
          selectedWeekId: '',
          selectedReportingWeekId: '',
          selectedSchoolWorkId: '',
          selectedReportId: '',
          selectedUserId: '',
          planningPathName: '',
          selectedGroupId: '',
        })
        FlowRouter.go('/')
      }
    });
  }
});
