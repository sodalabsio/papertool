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

Alternatively, you could also fork the repository to your personal github account and work from there.

Before starting with PaperTool, you will need valid three-letter RePEc Archive code (aaa) and a six-letter Series code (ssssss) associated with your working paper series. Please check out the [RePEc step-by-step](https://ideas.repec.org/stepbystep.html) for the same.

You should also have created a **cover.png** file to serve as your working paper series cover page template. PaperTool will automatically add the working paper meta-data to this template, using the middle portion of the page. It is essential that the template is of the same dimensions as the one provided in the `s3_buckets/working_papers_bucket/template/cover.png` file (i.e. 2487 x 3516 px). Review the existing `cover.png` file to understand the layout. The section in the middle is where the working paper meta-data will be added. When you are happy with your cover page template, replace the existing `aws_resources/s3_buckets/working_papers_bucket/cover.png` file with your own.

## A note on security
By default PaperTool runs from **public buckets** on your S3. RePEc requires your archive bucket to have public read access (`s3:GetObject`) since this bucket is allowing RePEc to index your papers, and to point the world to your working paper files for download. However, in the initial installation, the archive bucket also allows write access publicly (`s3:PutObject`), since we need to allow the PaperTool functions to write new index files and pdfs to this folder. However, this also allows **anyone on the internet** to write to this bucket. By default, permissions for the site bucket are the same, read/write access is **public**.  As such, we **strongly recommend** you edit the bucket policy for each bucket to reduce this risk surface.

Now, there are a variety of ways that you may want to limit access on your PaperTool buckets, and so we leave this to your own AWS security policies and risk appetite. One example approach is to allow public read access for both buckets (since RePEc needs it for the archive, and your users will need to access the upload site), but restrict write access to the archive only to an AWS role associated with the Lambda function. You can also ensure that not just anyone can use the PaperTool upload site by adding IP address restrictions to the API Gateway. In this scenario your users will need to be on a specific network to successfully use PaperTool, but this could include a university VPN so that they can still upload from home. For more information please refer to the [AWS documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html).


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
    - **Step 1: Create stack**
      - Click on the `Create Stack`
        - Choose `With new resources (standard)` if you are using the CloudFormation > Stacks menu
      - Under `Prerequisite - Prepare template` select `Choose an existing template`
      - Under `Specify template` select `Upload a template file` and upload `CreateS3Buckets.yaml` file.
      <img src="https://raw.githubusercontent.com/sodalabsio/papertool/main/assets/images/cloudformation2.png">
      <!-- <img src="/assets/images/cloudformation2.png"> -->
      - Click `Next`
    - **Step 2: Specify stack details**
      - Under `Provide a stack name` enter the name of the stack (any name of your choosing) (e.g. `PaperTool`)
      - Under `Parameters` please enter your working paper series details (such as RePEc codes for the series and archive). **Important:** Please assign the name of this bucket as per your lab/department name. E.g. If you set the bucket name as `econdept`, it will create a site under `http://econdept.s3-website-ap-southeast-2.amazonaws.com/` (for the `ap-southeast-2` region, your region may differ).
      - Click `Next`
    - **Step 3: Configure stack options**
      - Add Tags, and Permissions if required
      - Under `Stack failure options` select `Delete all newly created resources` (second section). This is to ensure that in case of any error, the resources are deleted automatically.
      - Click `Next`
    - **Step 4: Review and create**
      - Review and finally click on `Submit`
      - Your Stacks list will show the newly created stack as `CREATE_IN_PROGRESS`. Wait until the `Status` shows `CREATE_COMPLETE`
<!-- > Note: This creates a the neccesary S3 buckets to store your working papers and the code. -->
3. Navigate to [S3](https://s3.console.aws.amazon.com/) and into your `CodeBucket` (Note: You can also directly access the created buckets from `Resources` under the Stack. The name of the bucket will be the one you entered earlier along with the suffix `"-code"`)

4. Once you are inside the S3 `CodeBucket`, upload (or drag-and-drop) the contents from `s3_buckets/code_bucket/`. The files are:
    - `layer.zip`
    - `uploadWorkingPaper.zip`

5. Now once again under [CloudFormation](https://console.aws.amazon.com/cloudformation), create a new stack by repeating all the process from above and uploading `CreateLambdaAPI.yaml` as the template this time.
  - Name the stack as you like, you might like to repeat the name from the previous stack, adding `-lambda` to the end
  - Note: on **Step 3: Configure stack options**, at the very bottom, make sure to click on "I acknowledge that AWS CloudFormation might create IAM resources" before hitting  `Create Stack`
  - Once again, wait until the `Status` shows `CREATE_COMPLETE` on your Stacks list

6. Editing site bucket:
  - Once again in CloudFormation, select the Lambda stack you just created (step 5), and navigate to the `Outputs` tab on the right hand side of the page. You may need to expand the size of your window to see this tab.
  <img src="https://raw.githubusercontent.com/sodalabsio/papertool/main/assets/images/cloudformation_outputs.png">
    <!-- <img src="/assets/images/cloudformation_outputs.png"> -->
  - You will see a table with 2 rows, each with a `Key` and `Value`. Keep this window handy.
  - Now, in a text editor, open the file `s3_buckets/site_bucket/assets/js/settings.js` and enter in the information for your archive, and bucket names as indicated in the file.
    - Be sure to replace `mydept-aaa-archive` in the `templateUrl` config with your `workingPapersBucket` name (entered above).
    - For `apiEndpoint` and `identityPoolId`, copy the `Value` from the `Outputs` tab in CloudFormation and paste it into the respective fields in `settings.js`.
    - Save the file
  - Now, over in S3, upload the contents of your local `s3_buckets/site_bucket/` to your aws S3 `SiteBucket`

7. Editing working papers bucket:
  - Rename the `aaa` and `ssssss` folders to your `ArchiveCode` and `SeriesCode` respectively
  - Replace "aaa" in both `aaaarch.rdf` and `aaaseri.rdf` with your `ArchiveCode`
  - Fill the rdf files with appropriate working paper information. **Important:** The `URL` in `aaaarch.rdf` should be the `RePEcArchiveURL` as it links your archive to RePEc
  - Open `RePEc/aaa/index.html` and replace ssssss with your `SeriesCode` and the names of redif files
  - Replace `s3_buckets/working_papers_bucket/template/cover.png` with your own template. **Important:** The template should be identical in dimensions (2487 x 3516 px) and layout.
  - Finally copy the contents of `s3_buckets/working_papers_bucket/` to your actual S3 `WorkingPapersBucket`
  
8. And that's it! You can now start uploading working papers on your site by accessing your PaperTool website. The URL will be made from your siteBucket name, and your region, like this: `http://[siteBucket].s3-website-[region].amazonaws.com/`. For example, if your siteBucket is named `econdept` and you are in the `ap-southeast-2` region, your URL will be `http://econdept.s3-website-ap-southeast-2.amazonaws.com/`
  <img src="https://raw.githubusercontent.com/sodalabsio/papertool/main/assets/images/website.png"/>

Incase you have any questions please refer to our FAQ page.