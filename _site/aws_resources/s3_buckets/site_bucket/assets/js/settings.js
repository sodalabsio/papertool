// user needs to replace this

// To the user: Please assign the appropriate values to the following variables.
// NOTE: Only proceed with this step once you have run the CloudFormation scripts and have
// obtained the outputs corresponding to variables below. 
const config = {
    archiveCode: "aaa", //  your working paper archive code
    seriesCode: "ssssss", // your working paper series code
    siteBucket: "mydept-aaa-site", // name of the site bucket in S3 e.g. monash-econ
    workingPapersBucket: "mydept-aaa-archive", // name of your working papers bucket
    awsRegion: "ap-southeast-2", // name of your AWS region e.g. ap-southeast-2
    repecHandle: "RePEc:aaa:ssssss", // your RePEc handle e.g. RePEc:aaa:ssssss, where aaa is the archive code and ssssss is the series
    templateUrl: "https://mydept-aaa-archive.s3.ap-southeast-2.amazonaws.com/template/cover.png", // url for thr WP template
    apiEndpoint: "https://h75b85cwp0.execute-api.ap-southeast-2.amazonaws.com/v1/upload", // eg. https://ogi4iv7vei.execute-api.ap-southeast-2.amazonaws.com/v1/upload
    identityPoolId: "ap-southeast-2:d206c4bc-069f-474e-a7dc-e54bfe7b3bf3" // your identity poolID from AWS Congito e.g. 39b53048-8af5-..
}