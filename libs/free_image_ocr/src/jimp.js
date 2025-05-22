import { Jimp } from "jimp";

main(filePath);

async function main() {
    try {
        const image = await Jimp.read(filePath);
        const { data, width, height } = image.bitmap;
        const imageData = new Uint8ClampedArray(data);
    }catch(err) {
        console.log(err);
    }
}