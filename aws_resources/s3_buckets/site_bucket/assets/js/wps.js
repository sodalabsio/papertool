$(document).ready(function () {
  // please provide the appropriate values to the following variables
  // load variables
  const date = new Date();
  let suggestedWpn = ""
  const maxAllowedSize = 25 * 1024 * 1024; // 5 MB
  let currentYear = date.getFullYear();
  let currentPapers = 0;
  // config variables
  const apiEndpoint = config.apiEndpoint
  let prefix = `RePEc/${config.archiveCode}/${config.seriesCode}/${date.getFullYear()}-`;
  const siteBucket = config.siteBucket;
  const workingPaperBucket = config.workingPapersBucket;
  const awsRegion = config.awsRegion;
  const IdentityPoolId = config.identityPoolId;
  const templateUrl = config.templateUrl;
  const formatNumber = n => ("0" + n).slice(-2);

  function triggerError(msg) {
    $("#errorModal .modal-body").html("");
    $('#errorModal .modal-body').prepend(msg)
    $("#spinner").remove();
    $('button').prop('disabled', false);
    $('#errorModal').modal('show');
  }
  // aws cognito
  AWS.config.update({
    region: awsRegion,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IdentityPoolId
    })
  });
  let s3 = new AWS.S3({
    // apiVersion: "2012-10-17",
    params: { Bucket: workingPaperBucket }
  });
  var params = {
    Bucket: workingPaperBucket,
    Delimiter: '/',
    Prefix: prefix
  }
  // get the no of papers
  // Test - max key limit (1000?)
  s3.listObjects(params, function (error, data) {
    if (error) {
      console.log(`Error ${error}`)
      let msg = `<p><strong>Oops!</strong></p><p>An error has occurred. Please try again later.</p>`
      triggerError(msg)
    }
    else {
      currentPapers = data.Contents.length / 2 // ignoring RDF files
      if (currentPapers > 0) { // if there are papers
        suggestedWpn = currentYear + "-" + formatNumber(currentPapers + 1) // note: only handles 01-99
      }
      else {
        suggestedWpn = currentYear + "-" + "01"
      }
      // Set as placeholder and value, but now user can edit it
      $("#wpn").attr("placeholder", suggestedWpn);
      $("#wpn").val(suggestedWpn)
    }
  });

  // Add the following code if you want the name of the file appear on select
  $(".custom-file-input").on("change", function () {
    let fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
  });

  $(document).on('click', '.btn-add', function (e) {
    e.preventDefault();

    var dynaForm = $('.dynamic-wrap'),
      currentEntry = $(this).parents('.entry:first'),
      newEntry = $(currentEntry.clone()).appendTo(dynaForm);

    newEntry.find('input').val('');
    dynaForm.find('.entry:not(:last) .btn-add')
      .removeClass('btn-add').addClass('btn-remove')
      .removeClass('btn-primary').addClass('btn-secondary')
      .html('<i class="fa fa-times"></i>');
  }).on('click', '.btn-remove', function (e) {
    $(this).parents('.entry:first').remove();

    e.preventDefault();
    return false;
  });

  $("#confirmSubmission").click(function (e) {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var form = document.getElementById('wpForm');
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
    }
    else {
      fileSize = $('#inputFile')[0].files[0].size
      if (fileSize > maxAllowedSize) {
        let msg = `<p><strong>File too large.</strong></p><p>Please upload a PDF file which is less than 25 MB in size.</p>`
        triggerError(msg)
      }
      else {
        // Get the user-provided WPN value
        let userWpn = $('#wpn').val();
        
        // clear any content (previously generated)
        $('#confirmModal .modal-body').html("")
        let authorData = [];
        let affiliation = "";
        $('.dynamic-wrap input').each(function (index) { authorData.push($(this).val()) });

        let authors = []
        for (var i = 0; i < authorData.length; i += 3) {
          authors.push(authorData[i])
          affiliation += `${authorData[i]}: ${authorData[i + 1]} (email: ${authorData[i + 2]})`
          if (i != authorData.length - 1) { affiliation += "; " }
          else { affiliation += "." }
        }
        if (authors.length > 1) {
          authors = authors.slice(0, -1).join(',') + ' and ' + authors.slice(-1);
        }
        else {
          authors = authors[0]
        }
        let wpTemplate = `
                       <head>
                         <meta charset="utf-8">
                         <style>
                         img.template {
                             height: 1500px
                         }
                         .box {
                           position: relative;
                         }
                         div.paper {
                             position: absolute;
                             top: 290px;
                             left: 125px;
                             width: 823px;
                             max-width: 823px;
                         }
                         div.paper p {
                             color: #414141;
                             font-family: 'Source Code Pro', monospace;
                         }
                         p.title {
                             border-style: solid none solid none;
                             border-width: thin;
                             font-size: 18pt;
                             font-weight: 900;
                             text-align: center;
                             padding-top: 25px;
                             padding-bottom: 25px;
                         }
                         p.paper-no {
                             font-size: 15pt;
                             text-align: center;
                         }
                         p.author {
                             font-size: 18pt;
                             text-align: center;
                         }
                         p.abstract-fixed {
                             font-size: 15pt;
                         }
                         p.abstract {
                             font-size: 15pt;
                             text-align: justify;
                         }
                         p.keywords {
                             font-size: 15pt;
                             text-align: left;
                         }
                         p.jel-codes {
                             font-size: 15pt;
                             text-align: left;
                         }
                         p.affiliation {
                             font-size: 15pt;
                             text-align: left;
                         }
                         </style>
                       </head>
                       <body>
                       👉 Here is a preview of the front cover generated for your working paper.
                       <br></br>
                         <div class="box">
                           <img class="template" src="${templateUrl}" alt="econ wp background"/>
                           <div class="paper">
                           <p class="title">${$('#title').val()}</p>
                           <p class="paper-no">Discussion Paper no. ${userWpn}</p>
                           <p class="author"><b>${authors}</b></p>
                           <p class="abstract-fixed"><b>Abstract:</b></p>
                           <p class="abstract">${$('#abstract').val()}</p>
                           <p class="keywords"><b>Keywords: </b>${$("#keyword").tagsinput('items').join(', ')}</p>
                           <p class="jel-codes"><b>JEL Classification: </b>${$('#jel').val()}</p>
                           <p class="affiliation">${affiliation}</p>
                           </div>
                           </div>
                           <br></br>
                           By clicking <b>CONFIRM</b> below, your paper will be added to the Monash Econ working paper series and become available on a public server, with indexing by RePEc to follow. If you'd prefer not to go ahead, click <b>CANCEL</b> to return to the form and make edits as required. 
                         </body>
                     `
        $('#confirmModal .modal-body').prepend(wpTemplate)
        $('#confirmModal').modal('show');
      }
    }
  });

  $("#confirmUpdate").click(function (e) {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var form = document.getElementById('wpFormUpdate');
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
    }
    else {
      fileSize = $('#inputUpdateFile')[0].files[0].size
      if (fileSize > maxAllowedSize) {
        let msg = `<p><strong>File too large.</strong></p><p>Please upload a PDF file which is less than 25 MB in size.</p>`
        triggerError(msg)
      }
      else {
        let wpn = $('#wpn-update').val()
        let s3 = new AWS.S3({
          // apiVersion: "2012-10-17",
          params: { Bucket: siteBucket }
        });
        var params = {
          Bucket: siteBucket,
          Key: "metadata.json"
        };
        // fetch details from metadata.json
        s3.getObject(params, function (error, data) {
          if (error) {
            console.log(`Error ${error}`)
            let msg = `<p><strong>Oops!</strong></p><p>An error has occurred. Please try again later.</p>`
            triggerError(msg)
          }
          else {
            data = data.Body.toString('utf-8'); // Use the encoding necessary
            if (typeof data == 'string') {
              data = JSON.parse(data)
            }
            console.log(data)
            let currentPaper = data.papers.filter(a => a.wpn == wpn);
            console.log(currentPaper)
            if (currentPaper.length > 0) {
              $("#updateModal .modal-body").html("");
              let authors = []
              currentPaper[0].author.forEach(function (a) {
                authors.push(a.name)
              });
              let verifyMsg = `<p>You are about to overwrite the following paper: 
              <ul>
                <li>WPN: <b>${currentPaper[0].wpn}</b></li>
                <li>Title: <b>${currentPaper[0].title}</b></li>
                <li>Authors: <b>${authors.join(", ")}</b></li>
              </ul> with a new version. Please ensure that the details are correct.</p>
                <p>Doing so will make the existing version unavailable and only the new version will be available from now.</p>
                <p>If you wish to continue, click CONFIRM, or click Cancel, to go back</p>`
              $('#updateModal .modal-body').prepend(verifyMsg)
              $('#updateModal').modal('show');
            }
            else {
              let msg = `<p><strong>Oops!</strong></p><p>The paper you requested for does not exist. Please enter a valid working paper number.</p>`
              triggerError(msg)
            }
          }
        });
      }
    }
  });

  $("#closeBtn").click(function (e) {
    $('form').get(0).reset();
    window.location.reload();
  });

  $("#submitPaper").click(function (e) {
    $('#confirmModal').modal('hide');
    $('button').prop('disabled', true);
    $('#confirmSubmission').prepend(`<span id="spinner" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
    console.log('Processing ..')
    
    // Get the user-provided WPN value - ensure we capture it at submission time
    let userWpn = $('#wpn').val();
    
    let base64;
    let author = [];
    var reader = new FileReader(),
      file = $('#inputFile')[0];
    $('.dynamic-wrap input').each(function (index) { author.push($(this).val()) });
    reader.onload = function () {
      let result = reader.result;
      base64 = result.replace(/^[^,]*,/, '')

      var s3 = new AWS.S3({ params: { Bucket: workingPaperBucket } });

      // Use the user-provided WPN for the S3 key
      var data = {
        Key: `temp/${userWpn}`,
        Body: base64,
        ContentEncoding: 'base64',
        ContentType: 'application/pdf'
      };
      
      s3.putObject(data, function (err, data) {
        if (err) {
          console.log(err);
          console.log('Error uploading data: ', data);
          let msg = `<p><strong>Error uploading file.</strong></p><p>An error occurred while uploading your file: ${err.message}</p>`
          triggerError(msg)
        } else {
          console.log('Successfully uploaded the file!');

          // all values are string - use the user-provided WPN
          let data = {
            wpn: userWpn,
            title: $('#title').val(),
            author: author.join('|'),
            keyword: $("#keyword").tagsinput('items').join(', '),
            jel_code: $('#jel').val(),
            abstract: encodeURI($('#abstract').val()),
            pub_online: date.getDate() + ' ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear(),
            site_bucket: config.siteBucket,
            working_paper_bucket: config.workingPapersBucket,
            repec_handle: config.repecHandle,
            template_url: templateUrl,
            region: awsRegion,
            mode: 'upload'
          }
          
          // Log the data being sent to ensure WPN is correct
          console.log("Sending data to API:", data);
          
          // send paper metadata and trigger Lambda function
          $.ajax({
            url: apiEndpoint,
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            accept: 'application/json',
            processData: true,
            data: data,
            success: function (response) {
              console.log("API response:", response)
              if ('errorMessage' in response) {
                let msg = `<p><strong>Oops!</strong></p><p>An error has occurred: ${response.errorMessage}</p>`
                triggerError(msg)
              }
              else {
                $("#messageModal .modal-body").html("");
                $('#messageModal .modal-body').prepend(`<p><strong>Done!</strong></p><p>Your paper has been successfully submitted. Here's the link below:</p><p><a href="${response.body.url}">${response.body.url}</a></p>`)
                $("#spinner").remove();
                $('button').prop('disabled', false);
                $('#messageModal').modal('show');
                console.log('Done!')
              }
            },
            error: function (xhr, status, error) {
              console.log("AJAX error:", xhr, status, error)
              let errorMsg = xhr.responseJSON && xhr.responseJSON.errorMessage ? xhr.responseJSON.errorMessage : error;
              let msg = `<p><strong>Oops!</strong></p><p>An error has occurred: ${errorMsg}</p>`
              triggerError(msg)
            }
          });
        }
      });
    };
    reader.readAsDataURL(file.files[0]);
  });
  
  $("#updatePaper").click(function (e) {
    $('#updateModal').modal('hide');
    $('button').prop('disabled', true);
    $('#confirmUpdate').prepend(`<span id="spinner" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
    console.log('Processing ..')
    let base64;
    
    // Get the user-provided WPN value for update
    let wpn = $('#wpn-update').val();
    
    var reader = new FileReader(),
      file = $('#inputUpdateFile')[0];
    reader.onload = function () {
      let result = reader.result;
      base64 = result.replace(/^[^,]*,/, '')
      
      // upload raw PDF file to S3
      var s3 = new AWS.S3({ params: { Bucket: workingPaperBucket } });
      var data = {
        Key: `temp/${wpn}`,
        Body: base64,
        ContentEncoding: 'base64',
        ContentType: 'application/pdf'
      };
      
      s3.putObject(data, function (err, data) {
        if (err) {
          console.log(err);
          console.log('Error uploading data: ', data);
          let msg = `<p><strong>Error uploading file.</strong></p><p>An error occurred while uploading your file: ${err.message}</p>`
          triggerError(msg)
        } else {
          console.log('Successfully uploaded the file!');

          let data = {
            wpn: wpn,
            site_bucket: config.siteBucket,
            working_paper_bucket: config.workingPapersBucket,
            repec_handle: config.repecHandle,
            template_url: templateUrl,
            region: awsRegion,
            mode: 'update'
          }
          
          // Log the data being sent to ensure WPN is correct
          console.log("Sending update data to API:", data);
          
          $.ajax({
            url: apiEndpoint,
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            accept: 'application/json',
            processData: true,
            data: data,
            success: function (response) {
              console.log("API response:", response)
              if ('errorMessage' in response) {
                let msg = `<p><strong>Oops!</strong></p><p>An error has occurred: ${response.errorMessage}</p>`
                triggerError(msg)
              }
              else {
                $("#messageModal .modal-body").html("");
                $('#messageModal .modal-body').prepend(`<p><strong>Done!</strong></p><p>Your paper has been successfully updated. Here's the link below:</p><p><a href="${response.body.url}">${response.body.url}</a></p>`)
                $("#spinner").remove();
                $('button').prop('disabled', false);
                $('#messageModal').modal('show');
                console.log('Done!')
              }
            },
            error: function (xhr, status, error) {
              console.log("AJAX error:", xhr, status, error)
              let errorMsg = xhr.responseJSON && xhr.responseJSON.errorMessage ? xhr.responseJSON.errorMessage : error;
              let msg = `<p><strong>Oops!</strong></p><p>An error has occurred: ${errorMsg}</p>`
              triggerError(msg)
            }
          });
        }
      });
    };
    reader.readAsDataURL(file.files[0]);
  });
});