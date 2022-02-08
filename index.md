---
layout: default
title: Home
nav_order: 1
description: "Just the Docs is a responsive Jekyll theme with built-in search that is easily customizable and hosted on GitHub Pages."
permalink: /
---

# Simplifying the Working Papers machinery.
{: .fs-8 }

PaperTool is a highly customizable tool from SoDa Labs for any standard Working Paper Series that handles:

- Automatically adding Department or Lab specific front cover template(s),
- Previewing the final paper,
- Uploading working papers to a central repository
- Updating previous working papers, and
- Archiving papers on RePEc

It is a fully cloud-based solution to one of the most common problems plaguing academics: Dissemination of working papers with minimal hassle.

{: .fs-6 .fw-300 }

[Get started now](#getting-started){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 } [View it on GitHub](https://github.com/pmarsceill/just-the-docs){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## Getting started

### Prerequisites

The following guide assumes that the user/maintainer has a basic understanding of AWS (particularly S3 and Lambda), Python and HTML. We will see below in detail where each component comes into play.



### S3 Directory Stucture

PaperTool creates two primary S3 buckets (folders):

#### Site bucket
{: .fs-5 .text-purple-000}

It contains the main PaperTool site files and is used for hosting the working paper series portal (specific to each lab/department).

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

This site is hosted completely *free of cost*.

#### Working papers repository
{: .fs-5 .text-purple-000}

It contains the uploaded papers (as `PDF`) and their respective metadata (`RDF` or `REDIF` files). 



sodalabs.io: Code for the SoDa WP series website. The file sodalabs.io/metadata.json contains all the working paper meta-data.
soda-wps: Code for simulating directory listing on S3 as per RePEc's documentation.
uploadWorkingPaper: AWS Lambda function which performs all the post-processing and serves as the backend. Contains all project dependencies.
wkhtmltopdf: AWS Lambda layer for binaries required by the PyPDF2 package. PyPDF2 is used by uploadWorkingPaper for HTML to PDF conversion.
api-gateway.md: Documentation for configuring an AWS API Gateway endpoint


References
RePEc step-by-step tutorial

..

### Dependencies

..