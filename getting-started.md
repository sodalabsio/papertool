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

<!-- **Important**
{: .label .label-yellow } -->

The following guide assumes that the user/maintainer has a basic understanding of [AWS](https://aws.amazon.com/console/) (particularly [S3](https://s3.console.aws.amazon.com/) buckets), **Python** and some basic **HTML**. However, do not worry in case you have never used them before, we will guide you through and illustrate below where and how each component comes into play.

To download papertool on your local machine, run:
```
git clone https://github.com/sodalabsio/papertool.git
```

You will need valid RePEc Archive and Series codes associated with you working paper series. Please check out the [RePEc step-by-step](https://ideas.repec.org/stepbystep.html) for the same.

## Folder structure
Once you have papertool on your machine, you will see the following main folders/files:

```markdown
./papertool
├── aws_resources
|   ├── cloudformation_templates
|   |   ├── CreateLambdaAPI.yaml
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
    - Enter name of the stack (any name of your choosing)
    - Under `Prerequisite - Prepare template` select `Template is ready`
    - Under `Specify template` select `Upload a template file` and upload `CreateS3Buckets.yaml` file.
    <img src="https://raw.githubusercontent.com/sodalabsio/papertool/main/assets/images/cloudformation1.png"/>
    - Under `Specify stack details` please enter your working paper series details (such as RePEc codes for the series and archive). **Important:** Please assign the name of this bucket as per your lab/department name. E.g. If you set the bucket name as `econdept`, it will create a site under `http://econdept.s3-website-ap-southeast-2.amazonaws.com/`.
    - `Configure stack options`
    - Review and finally click on `Create Stack`
    - Wait till the `Status` shows `CREATE_COMPLETE`
<!-- > Note: This creates a the neccesary S3 buckets to store your working papers and the code. -->
3. Navigate to [S3](https://s3.console.aws.amazon.com/) and into your `CodeBucket` (Note: You can also directly access the created buckets from `Resources` under the Stack. The name of the bucket will be the one you entered earlier along with the suffix `"-code"`)

4. Once you are inside the S3 `CodeBucket`, upload (or drag-and-drop) the contents from `s3_buckets/code_bucket/`. The files are:
    - `layer.zip`
    - `uploadWorkingPaper.zip`

5. Now once again under [CloudFormation](https://console.aws.amazon.com/cloudformation), create a new stack by repeating Step 2 and uploading `CreateLambdaAPI.yaml` as the template this time.
  - Make sure to click on "I acknowledge that AWS CloudFormation might create IAM resources" before hitting  `Create Stack`

6. Editing site bucket:
  - Enter (copy) the appropriate values from the Stack `Outputs` to `s3_buckets/site_bucket/assets/js/settings.js` 
  - Upload the contents of `s3_buckets/site_bucket/` to your `SiteBucket`
7. Editing working papers bucket:
  - Rename the `aaa` and `ssssss` folders to your `ArchiveCode` and `SeriesCode` respectively
  - Replace "aaa" in both `aaaarch.rdf` and `aaaseri.rdf` with your `ArchiveCode`
  - Fill the rdf files with appropriate working paper information. **Important:** The `URL` in `aaaarch.rdf` should be the `RePEcArchiveURL` as it links your archive to RePEc
  - Open `RePEc/aaa/index.html` and replace ssssss with your `SeriesCode` and the names of redif files
  - Replace `s3_buckets/working_papers_bucket/template/cover.png` with your own template. **Important:** The template should be identical in dimensions (2487 x 3516 px) and layout.
  - Finally copy the contents of `s3_buckets/working_papers_bucket/` to your actual S3 `WorkingPapersBucket`
  
8. And that's it! You can now start uploading working papers on your site (refer to your `WebsiteURL`)
  <img src="https://raw.githubusercontent.com/sodalabsio/papertool/main/assets/images/website.png"/>

Incase you have any questions please refer to our [FAQ](/faq) page.