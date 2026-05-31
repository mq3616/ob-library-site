# OB Library Site

个人图书馆静态网页。

## 发布方式

1. 在 GitHub 新建公开仓库，例如 `ob-library-site`
2. 将本目录 push 到新仓库
3. 在 GitHub 仓库 `Settings -> Pages` 中选择：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
4. 访问 `https://mq3616.github.io/ob-library-site/`

## 数据结构

- `data/library-data.js`：图书馆分类、书籍元数据、精读路线
- `data/shangjunshu-content.js`：商君书原文底本数据
- `data/shangjunshu-explain.js`：章节摘要、关键词、矛盾点
- `data/shangjunshu-translations.js`：完整白话译文

新增书籍时，复制现有数据结构并在 `library-data.js` 中登记即可。
