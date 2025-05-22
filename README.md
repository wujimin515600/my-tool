# my-tool
通过pnpm+Monorepo管理多个工具

## 管理项目

```
# 全局安装
pnpm install

# 安装全局依赖
pnpm add -D typescript eslint -w

# 为 frontend 安装 vite
pnpm add vite -D -r --filter frontend

# 查看依赖关系图
pnpm mvdeps

# 检查特定包的依赖
pnpm why @myorg/utils --filter web-app
``` 