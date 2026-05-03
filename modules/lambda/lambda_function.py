import gzip
import boto3

def lambda_handler(event, context):
    s3 = boto3.client('s3')

    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']

        if "AWSLogs" not in key:
            continue

        obj = s3.get_object(Bucket=bucket, Key=key)
        data = gzip.decompress(obj['Body'].read()).decode('utf-8')

        for line in data.splitlines():
            print(line)