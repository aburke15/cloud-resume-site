#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StaticSiteStack } from '../lib/static-site-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

new StaticSiteStack(app, 'StaticSiteStack', {
  env: env,
  domainName: 'aburke.tech',
  subDomainName: 'res',
});

app.synth();
