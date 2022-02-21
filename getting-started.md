---
layout: default
title: Getting Started
nav_order: 2
description: "..."
permalink: /getting-started/
---

# Getting started
{: .no_toc }

<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
1. TOC
{:toc}
</details>

---

## Prerequisites
{: .d-inline-block }

Important
{: .label .label-yellow }

The following guide assumes that the user/maintainer has a basic understanding of **AWS** (particularly S3 and Lambda), **Python** and **HTML**. We will see below in detail where and how each component comes into play.

## Overview

<img src="/assets/images/schematic.png"/>


The basic papertool blueprint (including relevant files) can be downloaded using
```
git clone papertool
```

Once you have the `papertool` folder, please follow the instructions below.

## Using AWS Cloudformation

1. In the AWS Console and CloudFormation service, create a stack using the repository's CreateS3Bucket.yaml template file. The file creates an S3 bucket called gwdoc-lambda-functions.
2. In the S3 service, copy the test.zip file to the bucket.
3. In CloudFormation, create another stack using the repository's CreateLambdaFunction.yaml template file. The file creates a Lambda function, REST API interface to it, and all required associated resources.

## S3 Directory Stucture

PaperTool requires two primary S3 buckets (folders):

### Site bucket
{: .fs-5 .text-purple-000}

It contains the main PaperTool site files (HTML, JS and CSS) and is used for hosting the working paper series portal (specific to each lab/department).

**Note**: Please assign the name of this bucket as per your lab/department name. E.g. If you set the bucket name as `econdept`, it will create a site under `http://econdept.s3-website-ap-southeast-2.amazonaws.com/`.

The folder structure for the site bucket is as follows:

```
.
├── metadata.json
├── index.html
├── assets
│   ├── css
│   ├── img
│   ├── js
```

The main site is hosted completely *free of cost*.


### Working papers repository
{: .fs-5 .text-purple-000}

It contains the uploaded papers (as `PDF`) and their respective metadata (`RDF` or `REDIF` files). This is the core repository that will point to RePEc for automated archival of papers on their end.



sodalabs.io: Code for the SoDa WP series website. The file sodalabs.io/metadata.json contains all the working paper meta-data.
soda-wps: Code for simulating directory listing on S3 as per RePEc's documentation.
uploadWorkingPaper: AWS Lambda function which performs all the post-processing and serves as the backend. Contains all project dependencies.
wkhtmltopdf: AWS Lambda layer for binaries required by the PyPDF2 package. PyPDF2 is used by uploadWorkingPaper for HTML to PDF conversion.
api-gateway.md: Documentation for configuring an AWS API Gateway endpoint


References
RePEc step-by-step tutorial

..

## Lambda function

At the heart of the working paper site is the ability to do postprocessing on the uploaded paper and store in within the working papers repository. We use AWS Lambda function `uploadWorkingPaper` to accomplish the same. Lambda functions are relatively inexpensive and are used only a need-by-need basis when a user uses the site.

Simply upload the uploadWorkingPaper function in your personal/lab AWS Lambda interface.
Additionally, the user might need to give necessary persmissions:
- PUT/GET request on S3
- 
..

## API Gateway

Set up an API endpoint to route the data from the website to `uploadWorkingPaper` lambda function. The endpoint should be provided to `<site-bucket>/assets/js/wps.js`.
1. Create a new endpoint: /upload
2. Select Method: POST
3. Make sure to enable CORS
4. Select POST and under Integration Request:
5. Select Lambda Function as the Integration Type
6. Configure the following in Mapping template:
```
Content-Type: application/json
Template:
{
    "content": {
        #foreach( $token in $input.path('$').split('&') )
            #set( $keyVal = $token.split('=') )
            #set( $keyValSize = $keyVal.size() )
            #if( $keyValSize >= 1 )
                #set( $key = $util.urlDecode($keyVal[0]) )
                #if( $keyValSize >= 2 )
                    #set( $val = $util.urlDecode($keyVal[1]) )
                #else
                    #set( $val = '' )
                #end
                "$key": "$val"#if($foreach.hasNext),#end
            #end
        #end
    }
}
```

## Dependencies

- wkhtmltopdf