import Application from 'eai-cached-decorator-polyfill-reproduction/app';
import config from 'eai-cached-decorator-polyfill-reproduction/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
