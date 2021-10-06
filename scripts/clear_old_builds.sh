#!/bin/bash -e

: "${S3_BUCKET?Must specify S3_BUCKET}"
: "${LAMBDA_FN?Must specify LAMBDA_FN}"
# S3_BUCKET="nyulibraries-dev-web-lambdas-code"
# LAMBDA_FN="on-campus-restricted-requests"

aws s3 ls s3://${S3_BUCKET}/${LAMBDA_FN}/ --recursive | sort | tail -n 3 | awk '{print $4}' > exclude.txt

EXCLUDE_ARGS=""
EXCLUDE_FILES="$(cat exclude.txt)"

for line in $EXCLUDE_FILES
do
    EXCLUDE_ARGS="$EXCLUDE_ARGS--exclude $(echo $line | awk -F'/' '{printf("%s/%s"), $2, $3}') "
done 


aws s3 rm s3://${S3_BUCKET}/${LAMBDA_FN}/ --recursive --dryrun $EXCLUDE_ARGS
