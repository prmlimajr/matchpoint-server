const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'YOUR_REGION'
});

const upload = (file) => {
  const params = {
    Bucket: 'YOUR_BUCKET_NAME',
    Key: 'path/to/your/file', 
    Body: fileContent
  };

  s3.putObject(params, function(err, data) {
    if (err) console.log(err);
    else console.log(`File uploaded successfully. ETag: ${data.ETag}`);
  });
}

module.exports = { upload }