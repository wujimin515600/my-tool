import { Command } from 'commander';
import {  } from 'fs-extra';
import { resolve, dirname } from 'path';
import Handlebars from 'handlebars';

const program = new Command();

// 注册 Handlebars 助手函数
Handlebars.registerHelper('kebabCase', (str) => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  });

  const templatePath = 'templates/components.hbs'
const outputPath = 'output/components'

  program
  .name('codegen')
  .description('代码生成 CLI 工具')
  .version('1.0.0');

  program
  .command('g')
  .description('根据模板生成代码')
//   .argument('<outputPath>', '输出文件路径')
  .option('-d, --data <data>', '变量数据 (JSON 字符串)')
  .option('-f, --file <file>', '变量数据文件 (JSON)')
  .action(async (options) => {
    try {
      // 解析变量数据
      let variables = {};

      if(options.data){
        variables = JSON.parse(options.data);
      }

      console.log(options)
    }catch(error){
        console.error(`❌ 代码生成失败: ${error.message}`);
        process.exit(1);
    }
  });

  program.parse(); 