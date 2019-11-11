import {BrowserPolicy} from 'meteor/browser-policy-common';

BrowserPolicy.content.allowFontOrigin('data:');
BrowserPolicy.content.allowOriginForAll('*.stripe.com',);
BrowserPolicy.content.allowOriginForAll('*.youtube.com',);
BrowserPolicy.content.allowOriginForAll('*.ytimg.com',);
BrowserPolicy.content.allowOriginForAll('*.google-analytics.com',);
BrowserPolicy.content.allowOriginForAll('*.googletagmanager.com',);
BrowserPolicy.content.allowOriginForAll('*.googleleadservices.com',);




