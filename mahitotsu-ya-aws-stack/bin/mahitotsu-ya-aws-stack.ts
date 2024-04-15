#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { MahitotsuYaAwsStack } from '../lib/MathitotsuYaAwsStack';

const app = new App();
new MahitotsuYaAwsStack(app, 'MahitotsuYaAwsStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
});