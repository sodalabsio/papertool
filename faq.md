---
layout: default
title: FAQ
nav_order: 4
description: "..."
permalink: /faq/
---

## FAQ
- Where can I find the values for `settings.json`?  
   CloudFormation, select the Lambda stack you created, and navigate to the `Outputs` tab on the right hand side of the page. You may need to expand the size of your window to see this tab.
  <!-- <img src="https://raw.githubusercontent.com/sodalabsio/papertool/main/assets/images/cloudformation2.png"> -->
    <img src="/assets/images/cloudformation_outputs.png">
  - You will see a table with 2 rows, each with a `Key` and `Value`. These are the values you can add to `settings.json`.