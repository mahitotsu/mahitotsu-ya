#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { MahitotsuYaStack } from '../lib/MahitotsuYaStack';

const app = new App();
new MahitotsuYaStack(app, 'MahitotsuYaStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' }
})