import  {processERDiagramImage} from "./er-image-parser.js";
import fsExtra from "fs-extra";
import path from "path";
import { Jimp } from "jimp";
import { createWorker } from "tesseract.js";
// import cv from "opencv4nodejs";

async function main() {
    try {
        const filePath = path.join(process.cwd(), '/img/3.png');
        const detected = await detectFaces(filePath);
        return;
        // const file = await readFile(filePath);
        const image = await Jimp.read(filePath);

        // // 修改为传递对象参数
        image.resize({ w: 256, h: 256 }); // resize

        await image.write('test-small.jpg'); // save
        const text = await OCR('test-small.jpg')
        console.log('text:', text);
        await fsExtra.writeFile('test-small.txt', text);
        // fsExtra.writeFileSync(path.join(process.cwd(), 'test-small.jpg'), f);
        return;
        const res = await processERDiagramImage(filePath); 
        // console.log('res:', res);
        // fsExtra.writeFileSync(path.join(process.cwd(), 'er-model.json'), JSON.stringify(res, null, 2));
       fsExtra.writeJsonSync(path.join(process.cwd(), 'er-model.json'), res, { spaces: 2 });
        console.log('ER模型已生成并保存到 er-model.json');
    } catch (error) {
        console.error('生成失败:', error);
    }
}

async function OCR(params) {
    // const worker = await createWorker('eng');
    const worker = await createWorker('chi_sim+eng');

            const ret = await worker.recognize(params);
            console.log(ret.data.text);
            await worker.terminate();
            return ret.data.text;
}

async function detectFaces(imagePath) {
    const image = await cv.imreadAsync(imagePath);
    const faceCascade = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    const faces = faceCascade.detectMultiScale(image);
    console.log('Faces detected:', faces); // 输出检测到的人脸位置和大小
}

async function readFile(filePath) {
    const file = await fsExtra.readFile(filePath);
    if (!file) {
        console.error('文件不存在或无法读取');
    }
    return file;
}
await main();