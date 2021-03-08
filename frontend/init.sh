#!/bin/bash
set -e
IFS='|'

VUECONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"dist\",\
\"BuildCommand\":\"npm run-script build\",\
\"StartCommand\":\"npm run-script start\"\
}"

AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"default\",\
\"region\":\"eu-west-1\",\
\"accessKeyId\":$AWS_ACCESS_KEY_ID,\
\"secretAccessKey\":$AWS_SECRET_ACCESS_KEY\
}"

AMPLIFY="{\
\"projectName\":\"chatApp\",\
\"envName\":\"dev\",\
\"defaultEditor\":\"code\",\
\"appId\":\"d173wp33kkso7c\"\
}"

FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"vue\",\
\"config\":$VUECONFIG\
}"

PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

amplify init \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--yes
