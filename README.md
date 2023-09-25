# 程设作业---基于人机交互的走迷宫游戏
本项目或许仍会继续更新，毕竟完成的太过仓促了
## 使用方法
* 下载项目
```bash
git clone https://github.com/nizne9/maze-game.git
```
* 切换到此目录下
* 下载所需的包
```bash
conda env create -f maze-game.yaml -n your_env_name
```
* 启动虚拟环境
```bash
conda activate your_env_name
```
* 启动服务器
```bash
uvicorn demo:app --reload
```
* 浏览器打开网址 `localhost:8000/index.html`
* 进行游玩
