import { Cloudinary } from "@cloudinary/url-gen";

const { CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET } = process.env;

export default new Cloudinary({
  cloud: {
    cloudName: CLOUD_NAME ? CLOUD_NAME : "",
    apiKey: CLOUD_KEY ? CLOUD_KEY : "",
    apiSecret: CLOUD_SECRET ? CLOUD_SECRET : "",
  },
});
