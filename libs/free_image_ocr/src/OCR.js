import { createWorker } from "tesseract.js";
import fs from "fs";
import {getEnv} from "@myorg/utils"

export const free_image_ocr = async function(filePath) {
  try {
    const env = getEnv();
    const status = env == 'node' ? getFileExist(filePath) : true;
    if(!status) return;
    
    const text = await OCR(filePath);
    // console.log("text:", text);
    return text;
  } catch (err) {
    console.log("图片识别内容失败", err);
  }
}

function getFileExist(path) {
  const exists = fs.existsSync(filePath);
  if (!exists) {
    console.log("文件不存在");
    return false;
  }
  return true;
}

async function OCR(params) {
  const worker = await createWorker("chi_sim+eng");
  const ret = await worker.recognize(params);
  await worker.terminate();
  return ret.data.text;
}
