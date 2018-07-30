Inject.rawBody("loader", Assets.getText('loading.html'));


import { ReactiveVar } from 'meteor/reactive-var'
import './browser-policy.js';
import './accounts.js';
import './admin.js';
import './stripe.js';
import './mailchimp.js';
import './migrations.js';
import './endpoints.js';
import './fixtures.js';

import '../../api/stats/server/publications.js';

import '../../api/groups/groups.js';
import '../../api/groups/methods.js';
import '../../api/groups/server/publications.js';

import '../../api/users/methods.js';
import '../../api/users/server/publications.js';

import '../../api/students/students.js';
import '../../api/students/methods.js';
import '../../api/students/server/publications.js';

import '../../api/schoolYears/schoolYears.js';
import '../../api/schoolYears/methods.js';
import '../../api/schoolYears/server/publications.js';

import '../../api/terms/terms.js';
import '../../api/terms/methods.js';
import '../../api/terms/server/publications.js';

import '../../api/weeks/weeks.js';
import '../../api/weeks/methods.js';
import '../../api/weeks/server/publications.js';

import '../../api/resources/resources.js';
import '../../api/resources/methods.js';
import '../../api/resources/server/publications.js';

import '../../api/schoolWork/schoolWork.js';
import '../../api/schoolWork/methods.js';
import '../../api/schoolWork/server/publications.js';

import '../../api/lessons/lessons.js';
import '../../api/lessons/methods.js';
import '../../api/lessons/server/publications.js';

import '../../api/reports/reports.js';
import '../../api/reports/methods.js';
import '../../api/reports/server/publications.js';
