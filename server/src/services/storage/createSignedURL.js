const client = require("./bucketClient");
//surrond in a try-catch block
async function createSignedURL(path, bucketName, expiresIn = 3600) {
  const { data, error } = await client.storage
    .from(bucketName)
    .createSignedUrl(path, expiresIn);
  return { data, error };
}
module.exports = createSignedURL;
