from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import cv2
from detector import detect_face_orientation

app = FastAPI()

# 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/index.html")
async def get_frontend():
    with open("index.html", "r") as file:
        frontend = file.read()
    return HTMLResponse(content=frontend, status_code=200)


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
            ret, frame = cap.read()
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            # 显示返回的每帧
            cv2.imshow("frame", frame)
            cv2.waitKey(1)
            # 检测人脸朝向生成移动指令
            direction = detect_face_orientation(frame)
            print(direction)

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
    app.run(host="0.0.0.0", port=8000)
