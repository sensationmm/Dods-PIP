#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfraStackDev } from '../lib/infra-stack';

const envDev = {account: '390773179818', region: 'eu-west-1'};

const appDev = new cdk.App();
new InfraStackDev(appDev, 'InfraStackDev', { env: envDev });
