import { createWorker } from "tesseract.js";
import fs from "fs";

export const free_image_ocr = async function(filePath) {
  try {
    console.log("filePath:", filePath);
    const exists = fs.existsSync(filePath);
    if (!exists) {
      console.log("文件不存在");
      return;
    }
    const text = await OCR(filePath);
    console.log("text:", text);
    return text;
  } catch (err) {
    console.log("图片识别内容失败", err);
  }
}

async function OCR(params) {
  const worker = await createWorker("chi_sim+eng");
  const ret = await worker.recognize(params);
  await worker.terminate();
  return ret.data.text;
}
