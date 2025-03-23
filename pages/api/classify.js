import nextConnect from 'next-connect';
import multer from 'multer';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

const upload = multer({ storage: multer.memoryStorage() });
const apiRoute = nextConnect();
apiRoute.use(upload.single('image'));

let modelPromise = mobilenet.load();

apiRoute.post(async (req, res) => {
  try {
    const model = await modelPromise;
    const imageBuffer = req.file.buffer;

    const imageTensor = tf.node
      ? tf.node.decodeImage(imageBuffer)
      : tf.browser.fromPixels(new ImageData(new Uint8ClampedArray(imageBuffer), 224, 224));

    const predictions = await model.classify(imageTensor);

    res.status(200).json({ result: predictions[0].className });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Model prediction failed.' });
  }
});

export default apiRoute;

export const config = {
  api: { bodyParser: false },
};
