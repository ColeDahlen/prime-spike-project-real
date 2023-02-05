// npm install aws-sdk in command line
// { S3 } HAS TO BE WRITTEN LIKE THAT

const {S3} = require("aws-sdk")
const uuid = require('uuid').v4





exports.s3Uploadv2 = async (file) =>{
    const s3 = new S3()
// has to be Bucket with a capital B
    const params ={
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${uuid()}-${file.originalname}`,
        Body: file.buffer,
    };
    return await s3.upload(params).promise()
}