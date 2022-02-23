// To the user: Please assign the appropriate values to the following variables.
// NOTE: Only proceed with this step once you have run the CloudFormation scripts and have
// obtained the outputs corresponding to variables below. 
const config = {
                archiveCode: "mos", //  your working paper archive code
                seriesCode: "moswps", // your working paper series code
                siteBucket: "econ-mos", // name of the site bucket in S3 e.g. monash-econ
                bucketRegion: "ap-southeast-2", // name of your AWS region e.g. ap-southeast-2
                repecHandle: "RePEc:mos:moswps", // your RePEc handle e.g. RePEc:aaa:ssssss, where aaa is the archive code and ssssss is the series
                template_url: "https://econ-mos-archive.s3.ap-southeast-2.amazonaws.com/template/cover.png", // url for thr WP template
                apiEndpoint: "https://3xtoxp9969.execute-api.ap-southeast-2.amazonaws.com/v1/upload", // eg. https://ogi4iv7vei.execute-api.ap-southeast-2.amazonaws.com/v1/upload
                identityPoolId: "ap-southeast-2:f773ea91-9183-4eba-ae84-31d20ccd2852" // your identity poolID from AWS Congito e.g. 39b53048-8af5-..
            }