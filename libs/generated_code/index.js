#!/usr/bin/env node
const { Command } = require('commander');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { resolve, dirname } = require('path');
const Handlebars = require('handlebars');

const program = new Command();

// 注册 Handlebars 助手函数
Handlebars.registerHelper('kebabCase', (str) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
});

const templatePath = 'templates/components.hbs'
// const outputPath = './output/components.js'

program
  .name('codegen')
  .description('代码生成 CLI 工具')
  .version('1.0.0');

program
  .command('generate')
  .description('根据模板生成代码')
  // .argument('<templatePath>', '模板文件路径')
  .argument('<outputPath>', '输出文件路径')
  .option('-d, --data <data>', '变量数据 (JSON 字符串)')
  .option('-f, --file <file>', '变量数据文件 (JSON)')
  .action((outputPath, options) => {
    try {
      // 解析变量数据
      let variables = {};
      
      if (options.data) {
        variables = JSON.parse(options.data);
      } else if (options.file) {
        const dataPath = resolve(process.cwd(), options.file);
        variables = JSON.parse(readFileSync(dataPath, 'utf8'));
      }

      // 读取模板
      const templatePathResolved = resolve(process.cwd(), templatePath);
      const templateContent = readFileSync(templatePathResolved, 'utf8');

      // 编译模板
      const template = Handlebars.compile(templateContent);
      const generatedCode = template(variables);

      // 写入文件
      const outputPathResolved = resolve(process.cwd(), outputPath);
      mkdirSync(dirname(outputPathResolved), { recursive: true });
      writeFileSync(outputPathResolved, generatedCode, 'utf8');

      console.log(`✅ 代码生成成功: ${outputPathResolved}`);
    } catch (error) {
      console.error(`❌ 代码生成失败: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();    