import { createWorker } from "tesseract.js";
// import * as JimpModule from "jimp";
// const Jimp = JimpModule.default;
import { Jimp } from "jimp";
import natural from "natural";
import ERDiagramParser from "./er-parser.js"; // 之前实现的解析器
import fsExtra from "fs-extra";

const dumpFile = 'processed_image.png';

class ERImageParser { 
  constructor() { 
    // 暂时先不初始化 worker，改为在 initialize 方法中异步初始化 
    this.worker = null; 
    this.tokenizer = new natural.WordTokenizer(); 
    this.entityRegex = /^(Entity|实体):\s*(.+)$/i; 
    this.attributeRegex = /^\s*(\w+)\s*:\s*(\w+)(\s*\*)?\s*$/; // 属性:类型 [主键] 
    this.relationshipRegex = 
      /^(Relationship|关系):\s*(.+)\s*\[(\w+)\]\s*->\s*(.+)\s*\[(\w+)\]\s*:\s*(\w+)$/i; 
  } 

  async initialize() { 
    try { 
      // 异步初始化 worker 
      this.worker = await createWorker('eng'); 
    } catch (error) { 
      console.error('初始化失败:', error); 
    } 
  } 

  async parseImage(imagePath) {
    try {
      // 图像预处理
      const processedImage = await this.preprocessImage(imagePath);
      // OCR识别文本
      const {
        data: { text },
      } = await this.worker.recognize(dumpFile);
      await fsExtra.writeJSONSync('text.json', text, { spaces: 2});
      // 分析识别的文本
      const erModel = this.analyzeText(text);
      await fsExtra.writeJSONSync('er-model-test.json', erModel, { spaces: 2});
      // 生成Mongoose模型
      return this.generateMongooseModels(erModel);
    } catch (error) {
      console.error("解析失败:", error);
      throw error;
    } finally {
      await this.worker.terminate();
    }
  }

  async preprocessImage(imagePath) {
    const image = await Jimp.read(imagePath);
    // 图像预处理：灰度化、二值化、降噪
    image.greyscale().contrast(1).threshold({ max: 150 });
    return await image.write(dumpFile);
    return image
      .greyscale()
      .contrast(1)
      .threshold({ max: 150 })
      .write("processed_image.png");
  }

  analyzeText(text) {
    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    const parser = new ERDiagramParser();
    console.log('lines:', lines);
    
    let currentEntity = null;
    let relationships = [];

    lines.forEach((line) => {
      // 识别实体
      const entityMatch = line.match(this.entityRegex);
      console.log('entityMatch:', entityMatch);
      if (entityMatch) {
        const entityName = entityMatch[2].trim();
        currentEntity = entityName;
        parser.addEntity(entityName, []);
        return;
      }

      // 识别属性
      if (currentEntity) {
        const attrMatch = line.match(this.attributeRegex);
        if (attrMatch) {
          const attrName = attrMatch[1];
          const attrType = this.mapToMongooseType(attrMatch[2]);
          const isPrimary = attrMatch[3] !== undefined;

          parser.entities.get(currentEntity).attributes.push(attrName);

          if (isPrimary) {
            parser.setPrimaryKey(currentEntity, attrName);
          }
        }
      }

      // 识别关系
      const relMatch = line.match(this.relationshipRegex);
      if (relMatch) {
        const fromEntity = relMatch[2].trim();
        const fromCardinality = relMatch[3].trim();
        const toEntity = relMatch[4].trim();
        const toCardinality = relMatch[5].trim();
        const relName = relMatch[6].trim();

        // 判断关系类型
        let relType;
        if (fromCardinality === "1" && toCardinality === "*") {
          relType = "1:N";
        } else if (fromCardinality === "*" && toCardinality === "1") {
          relType = "N:1";
        } else if (fromCardinality === "*" && toCardinality === "*") {
          relType = "N:M";
        } else {
          relType = "1:1";
        }

        relationships.push({
          name: relName,
          fromEntity,
          toEntity,
          type: relType,
        });
      }
    });

    // 处理关系，添加外键
    relationships.forEach((rel) => {
      parser.addRelationship(rel.name, rel.fromEntity, rel.toEntity, rel.type);

      if (rel.type === "1:N" || rel.type === "N:1") {
        const childEntity = rel.type === "1:N" ? rel.toEntity : rel.fromEntity;
        const parentEntity = rel.type === "1:N" ? rel.fromEntity : rel.toEntity;
        const parentPK = parser.entities.get(parentEntity).primaryKey;

        const child = parser.entities.get(childEntity);
        if (child && !child.attributes.includes(`${parentEntity}Id`)) {
          child.attributes.push(`${parentEntity}Id`);
          child.foreignKeys.push({
            attribute: `${parentEntity}Id`,
            references: parentEntity,
            referencesPK: parentPK,
          });
        }
      } else if (rel.type === "N:M") {
        // 多对多关系，创建连接实体
        const joinEntityName = `${rel.fromEntity}${rel.toEntity}`;
        parser.addEntity(joinEntityName, [
          `${rel.fromEntity}Id`,
          `${rel.toEntity}Id`,
        ]);

        const joinEntity = parser.entities.get(joinEntityName);
        joinEntity.foreignKeys.push(
          { attribute: `${rel.fromEntity}Id`, references: rel.fromEntity },
          { attribute: `${rel.toEntity}Id`, references: rel.toEntity }
        );

        // 设置复合主键
        parser.setPrimaryKey(joinEntityName, `${rel.fromEntity}Id`);
        // 实际应该是复合主键，但ERDiagramParser目前只支持单字段主键
      }
    });

    return parser;
  }

  mapToMongooseType(type) {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("int") || lowerType.includes("number"))
      return "Number";
    if (lowerType.includes("date") || lowerType.includes("time")) return "Date";
    if (lowerType.includes("bool")) return "Boolean";
    if (lowerType.includes("array") || lowerType.includes("list"))
      return "Array";
    if (lowerType.includes("object") || lowerType.includes("map"))
      return "Object";
    return "String";
  }

  generateMongooseModels(erModel) {
    return erModel.generateMongooseModels();
  }
}

// 使用示例

export async function processERDiagramImage(imagePath) {
  const parser = new ERImageParser();
  await parser.initialize();

  try {
    const mongooseCode = await parser.parseImage(imagePath);
    console.log(mongooseCode);
    return mongooseCode;
  } catch (error) {
    console.error("处理图像失败:", error);
  }
}

export async function demo() {
    const text = await fsExtra.readJSONSync('text.json');
}
// 调用示例
// processERDiagramImage('path/to/er-diagram.png');
