from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
import cv2
from detector import detect_face_orientation
import uvicorn

app = FastAPI()

# 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/index.html", response_class=HTMLResponse)
async def get_frontend():
    with open("index.html", "r") as file:
        frontend = file.read()
    return frontend


@app.get("/css/{filename}")
async def get_css(filename):
    return FileResponse(f"css/{filename}")


@app.get("/js/{filename}")
async def get_js(filename):
    return FileResponse(f"js/{filename}")


@app.get("/images/{filename}")
async def get_js(filename):
    return FileResponse(f"images/{filename}")


@app.websocket("/ws/move")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    # 打开摄像头
    cap = cv2.VideoCapture(0)

    try:
        while True:
            # 读取摄像头图像帧
            ret, frame = cap.read()

            if not ret:
                break

            # 检测人脸朝向生成移动指令
            frame, direction = detect_face_orientation(frame)
            # 显示返回的每帧
            cv2.imshow("frame", frame)
            cv2.waitKey(1)
            # 发送移动指令给前端
            await websocket.send_text(direction)
    except WebSocketDisconnect:
        # WebSocket连接断开时执行的操作
        print("WebSocket connection closed")

    finally:
        # 关闭摄像头和WebSocket连接
        cap.release()
        cv2.destroyAllWindows()
        await websocket.close()


# uvicorn demo:app --reload

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
