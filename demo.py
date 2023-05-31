from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import uvicorn
import cv2

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

    while True:
        # 读取摄像头图像帧
        ret, frame = cap.read()
        if not ret:
            break

        # 检测人脸朝向生成移动指令
        direction = detect_face_orientation(frame)

        # 发送移动指令给前端
        await websocket.send_text(direction)

    # 关闭摄像头和WebSocket连接
    cap.release()
    await websocket.close()


def detect_face_orientation(frame):
    # 在这里实现人脸朝向检测算法，根据检测结果生成移动指令
    # 这里使用示例代码，根据摄像头图像的宽度划分成左右两个区域，检测人脸在哪个区域，然后生成对应的移动指令

    width = frame.shape[1]
    face_x = width // 2  # 默认人脸在图像中间
    face_area = width // 4  # 人脸所在区域的宽度

    # 从图像中截取人脸所在区域
    face_region = frame[:, face_x - face_area // 2 : face_x + face_area // 2, :]

    # 在这里进行人脸朝向检测，根据检测结果生成移动指令
    # 示例代码中根据人脸所在区域与图像中心的位置关系生成移动指令
    if face_x < width // 2 - face_area // 4:
        direction = "left"
    elif face_x > width // 2 + face_area // 4:
        direction = "right"
    else:
        direction = "up"

    return direction


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
