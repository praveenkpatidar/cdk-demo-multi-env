# cdk-demo-multi-env

AWS CDK Demo for setting up multi environment project. To setup project

## Install
assuming the npm and cdk is already installed

Use `npm install` in common-config and demo-cdk directory to install the packages and run.

## Deploy the project
Setup AWS Credentials and update the dev.yaml and test.yaml with correct account ids.
Run below commands to synth\diff or deploy

    cd demo-cdk
    cdk synth --c envName=dev
    cdk diff --c envName=dev
    cdk deploy --c envName=dev
