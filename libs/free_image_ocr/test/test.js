import { free_image_ocr } from "../src/OCR.js";
import path from "path";

main();
async function main() {
  try {
    const filePath = path.join(process.cwd(), '/img/2.png');
    const text = await free_image_ocr(filePath);
    console.log("text:", text);
  } catch (err) {
    console.log("图片识别内容失败", err);
  }
}