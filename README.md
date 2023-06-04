# 程设作业---基于人机交互的走迷宫游戏(仍在更新中)
## 依赖
TODO
## 使用方法
* 切换到此目录下
* 下载所需的包
```bash
conda env create -f MazeGame.yaml -n your_env_name
```
* 启动虚拟环境
```bash
conda activate your_env_name
```
* 启动服务器
```bash
uvicorn demo:app --reload
```
* 从浏览器打开文件 `index.html`
* 进行游玩