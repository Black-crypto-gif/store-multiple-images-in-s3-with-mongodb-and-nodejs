// Load the AWS SDK and MongoDB Driver
const AWS = require("aws-sdk");
const MongoClient = require("mongodb").MongoClient;

// Connect to the MongoDB database
const mongoUrl = "mongodb://localhost:27017";
MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(err, client) {
  if (err) throw err;
  const db = client.db("test");
  
  // Upload an image to Amazon S3
  const s3 = new AWS.S3({
    accessKeyId: "ACCESS_KEY_ID",
    secretAccessKey: "SECRET_ACCESS_KEY"
  });
  const image = ...; // binary data of the image
  const imageName = ...; // name of the image
  const imageType = ...; // type of the image (e.g., "image/jpeg")
  const params = {
    Bucket: "BUCKET_NAME",
    Key: imageName,
    Body: image,
    ContentType: imageType
  };
  s3.upload(params, function(err, data) {
    if (err) throw err;
    console.log("Image uploaded to S3:", data.Location);
    
    // Store the image metadata in MongoDB
    const imageMetadata = {
      name: imageName,
      type: imageType,
      url: data.Location
    };
    db.collection("images").insertOne(imageMetadata, function(err, result) {
      if (err) throw err;
      console.log("Image metadata stored in MongoDB:", result.insertedId);
      client.close();
    });
  });
});
