#!/usr/bin/env node
import 'source-map-support/register';
import * as dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

import * as cdk from 'aws-cdk-lib';
import { SesStack } from '../lib/ses-stack';

const app = new cdk.App();

// Amplify Hosting Stack は 2026-09-01 に撤収した（tarophotos.com の配信は
// Cloud Run + Firebase Hosting = deploy-gcp.yml）。ここに再び宣言すると
// deploy-infra が削除済みの Amplify app を作り直すので戻さないこと。

// SES Stack (optional - only deployed if SES_FROM_EMAIL or SES_DOMAIN is configured)
if (process.env.SES_FROM_EMAIL || process.env.SES_DOMAIN) {
    new SesStack(app, 'SesStack', {
        env: {
            account: process.env.CDK_DEFAULT_ACCOUNT,
            region: process.env.SES_REGION || process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
        },
        description: 'tarophotos.com - SES Email Infrastructure',
    });
}
