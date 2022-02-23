// To the user: Please assign the appropriate values to the following variables.
// NOTE: Only proceed with this step once you have run the CloudFormation scripts and have
// obtained the outputs corresponding to variables below. 
const config = {apiEndpoint: "", // eg. https://ogi4iv7vei.execute-api.ap-southeast-2.amazonaws.com/v1/upload
                archiveCode: "", //  your working paper archive code
                seriesCode: "", // your working paper series code
                siteBucket: "", // name of the site bucket in S3 e.g. monash-econ
                workingPaperBucket: "", // name of the working paper bucket in S3 e.g. monash-econ-wps
                bucketRegion: "", // name of your AWS region e.g. ap-southeast-2
                repecHandle: "", // your RePEc handle e.g. RePEc:aaa:ssssss, where aaa is the archive code and ssssss is the series
                template_url: "", // url for thr WP template
                identityPoolId: "" // your identity poolID from AWS Congito e.g. 39b53048-8af5-..
            }