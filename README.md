# 修仙传 - 问道长生

修仙题材的放置类修行游戏，支持网页版和 PWA 安装为 App。

## 功能

- **修行系统**：点击进度条开始修行，读条 10 秒后获得修为
- **境界体系**：练气期→筑基期→金丹期→元婴期→化神期→合体期→渡劫期→大乘期，每境界 1-10 层
- **突破机制**：积攒足够修为可突破，突破后修炼效率提升，但下次突破所需修为大幅增加
- **进度保存**：自动本地存储，刷新不丢失

## 运行方式

### 开发（网页测试）

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`

### 打包部署

```bash
npm run build
```

生成 `dist` 目录，可部署到任意静态托管。

### 安装为 App（PWA）

1. 部署到 HTTPS 域名
2. 在手机/电脑浏览器打开
3. 使用「添加到主屏幕」或「安装应用」即可

## 技术栈

- React 18 + Vite 5
- 纯 CSS（无 UI 框架）
- 响应式布局，兼容手机与电脑

## 协作开发（GitHub）

### 首次推送到 GitHub

1. 在 [GitHub](https://github.com/new) 新建一个仓库（例如 `xiuxian`），**不要**勾选「Add a README」。
2. 在项目目录执行（把 `你的用户名/xiuxian` 换成你的仓库地址）：

```bash
git remote add origin https://github.com/你的用户名/xiuxian.git
git branch -M main
git push -u origin main
```

3. 若尚未配置 Git 身份，请先设置（只需一次）：

```bash
git config --global user.email "你的邮箱@example.com"
git config --global user.name "你的名字"
```

### 别人如何参与

- **克隆**：`git clone https://github.com/你的用户名/xiuxian.git`
- **拉取更新**：`git pull`
- **提交并推送**：修改后执行 `git add .` → `git commit -m "说明"` → `git push`（需被添加为协作者或 fork 后提 PR）
- **邀请协作者**：仓库 → Settings → Collaborators → Add people，添加对方 GitHub 账号即可一起编辑
