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

<!-- Important
{: .label .label-yellow } -->

The following guide assumes that the user/maintainer has a basic understanding of [AWS](https://aws.amazon.com/console/) (particularly [S3](https://s3.console.aws.amazon.com/) buckets), **Python** and some basic **HTML**. However, do not worry in case you have never used them before, we will guide you through and illustrate below where and how each component comes into play.

To download papertool on your local machine, run:
```
git clone papertool
```

## Folder structure
Once you have papertool on your machine, you will see the following main folders/files:

```markdown
./papertool
├── aws_resources
|   ├── cloudformation_templates
|   |   ├── CreateLambdaFunction.yaml
|   |   └── CreateS3Buckets.yaml
|   └── s3_buckets
|       ├── code_bucket
|       ├── site_bucket
|       └── working_papers_bucket
...
```

## Setting up
1. [Log in](https://aws.amazon.com/console/) or create your AWS account
2. Once you have access to the AWS Console, launch the [CloudFormation](https://console.aws.amazon.com/cloudformation) service. Then:
    - Click on the `Create Stack`
    - Enter name of the stack as **s3-stack**
    - Under `Prerequisite - Prepare template` select `Template is ready`
    - Under `Specify template` select `Upload a template file` and upload `CreateS3Buckets.yaml` file.
    - Under `Specify stack details` please enter your working paper series details (such as RePEc codes for the series and archive)
    - `Configure stack options`
    - Review and finally click on `Create Stack`
    - Wait till the `Status` shows `CREATE_COMPLETE`
<!-- > Note: This creates a the neccesary S3 buckets to store your working papers and the code. -->
<img src="/assets/images/cloudformation1.png"/>
3. Navigate to [S3](https://s3.console.aws.amazon.com/) and your `CodeBucket` (Note: You can also directly access the created buckets from `Resources` under the Stack. The name of the bucket will be the one you entered earlier along with the suffix `"-code"`)

4. Once you are inside the S3 `CodeBucket`, upload (or drag-and-drop):
    - `layer.zip`
    - `uploadWorkingPaper.zip`

5. Now once again under [CloudFormation](https://console.aws.amazon.com/cloudformation), create a new stack by repeating Step 2 with:
    - Name of the stack as **lambda-stack**, and
    - Upload `CreateLambdaAPI.yaml` as the template this time

6. Copy the appropriate values from the Stack `Outputs` to `site_bucket/assets/js/settings.js` 
6. As before, navigate to `Resources` under the newly created stack
7. Go to your site bucket (ends in `"-site"`) and 
7. That's it! You can now start uploading working papers on your site.
<!-- > Note: This creates a Lambda function, REST API interface to it, and all required associated resources. -->

Navigate to the `Outputs` tab under the Stacks to access all the neccessary fields. 