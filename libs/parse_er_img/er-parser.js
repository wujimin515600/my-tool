class ERDiagramParser {
    constructor() {
      this.entities = new Map();
      this.relationships = [];
    }
  
    // 添加实体
    addEntity(name, attributes, isWeak = false) {
      this.entities.set(name, {
        name,
        attributes,
        isWeak,
        primaryKey: null,
        foreignKeys: []
      });
      return this;
    }
  
    // 设置主键
    setPrimaryKey(entityName, primaryKey) {
      const entity = this.entities.get(entityName);
      if (!entity) throw new Error(`实体 ${entityName} 不存在`);
      entity.primaryKey = primaryKey;
      return this;
    }
  
    // 添加外键
    addForeignKey(entityName, attribute, references, referencesPK = null) {
      const entity = this.entities.get(entityName);
      if (!entity) throw new Error(`实体 ${entityName} 不存在`);
      
      entity.foreignKeys.push({
        attribute,
        references,
        referencesPK: referencesPK || attribute
      });
      return this;
    }
  
    // 添加关系
    addRelationship(name, fromEntity, toEntity, type, attributes = []) {
      this.relationships.push({
        name,
        fromEntity,
        toEntity,
        type, // '1:1', '1:N', 'N:M'
        attributes
      });
      return this;
    }
  
    // 生成Mongoose数据模型
    generateMongooseModels() {
      let code = `const mongoose = require('mongoose');\n\n`;
      
      // 生成实体Schema
      for (const [name, entity] of this.entities) {
        code += `// ${name}模型\n`;
        code += `const ${name}Schema = new mongoose.Schema({\n`;
        
        entity.attributes.forEach(attr => {
          const isPK = attr === entity.primaryKey;
          const isFK = entity.foreignKeys.some(fk => fk.attribute === attr);
          
          if (isFK) {
            const fkInfo = entity.foreignKeys.find(fk => fk.attribute === attr);
            code += `  ${attr}: { type: mongoose.Schema.Types.ObjectId, ref: '${fkInfo.references}', ${isPK ? 'required: true, ' : ''}${isPK ? 'unique: true' : ''} },\n`;
          } else {
            let attrType = 'String';
            if (attr.toLowerCase().includes('date')) attrType = 'Date';
            if (attr.toLowerCase().includes('amount') || attr.toLowerCase().includes('price')) attrType = 'Number';
            if (attr.toLowerCase().includes('is') || attr.toLowerCase().includes('has')) attrType = 'Boolean';
            
            code += `  ${attr}: { type: ${attrType}${isPK ? ', required: true, unique: true' : ''} },\n`;
          }
        });
        
        // 添加虚拟字段用于反向引用
        this.relationships.forEach(rel => {
          if (rel.type === '1:N' && rel.fromEntity === name) {
            code += `}, {\n  toJSON: { virtuals: true },\n  toObject: { virtuals: true }\n});\n\n`;
            code += `${name}Schema.virtual('${rel.toEntity.toLowerCase()}s', {\n`;
            code += `  ref: '${rel.toEntity}',\n`;
            code += `  localField: '_id',\n`;
            code += `  foreignField: '${name.toLowerCase()}Id'\n`;
            code += `});\n\n`;
          }
        });
        
        if (!code.endsWith('});\n\n')) {
          code += `});\n\n`;
        }
      }
      
      // 生成模型定义
      code += '// 创建模型\n';
      for (const name of this.entities.keys()) {
        code += `const ${name} = mongoose.model('${name}', ${name}Schema);\n`;
      }
      
      code += '\nmodule.exports = { ';
      code += Array.from(this.entities.keys()).join(', ') + ' };\n';
      
      return code;
    }
  
    // 生成关系型数据库SQL
    generateSQLSchema(dialect = 'mysql') {
      // 与之前相同...
    }
  }
  
//   module.exports = { ERDiagramParser }; 
// module.exports = ERDiagramParser;
export default ERDiagramParser;