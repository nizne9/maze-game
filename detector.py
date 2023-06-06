import cv2

# 为了方便模块化设计故使用了全局变量，防止重复赋初值影响检测结果
thresholdValue = 5
# 定义变量用于存储上一次和当前的人脸位置
last_loc_x, last_loc_y, next_loc_x, next_loc_y = 0, 0, 0, 0
cx, cy = 0, 0
frame_count = 0


def detect_face_orientation(frame):
    global last_loc_x, last_loc_y, next_loc_x, next_loc_y, cx, cy
    # 加载人脸方向分类器
    face_direction_cascade = cv2.CascadeClassifier("haarcascade_frontalface_alt.xml")
    # 将图像转换为灰度图像
    frame = cv2.flip(frame, 1)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # 检测人脸
    faces = face_direction_cascade.detectMultiScale(gray, 1.3, 5)

    # 只处理第一个检测到的人脸
    if len(faces) > 0:
        x, y, w, h = faces[0]
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
        face_direction = face_direction_cascade.detectMultiScale(
            gray[y : y + h, x : x + w], 1.3, 5
        )

        # 判断人脸方向并返回结果
        if len(face_direction) > 0:
            fx, fy, fw, fh = face_direction[0]
            cx, cy = fx + fw // 2, fy + fh // 2
            if (next_loc_x == 0 and next_loc_y == 0) or (cx == 0 and cy == 0):
                # 第一次检测或者检测不到时
                last_loc_x, last_loc_y = 0, 0
                next_loc_x, next_loc_y = cx, cy
            else:
                last_loc_x, last_loc_y = next_loc_x, next_loc_y
                next_loc_x, next_loc_y = cx, cy
            Hor = next_loc_x - last_loc_x
            Ver = next_loc_y - last_loc_y

            if Ver < -thresholdValue:
                direction = "up"
            elif Ver > thresholdValue:
                direction = "down"
            elif Hor < -thresholdValue:
                direction = "left"
            elif Hor > thresholdValue:
                direction = "right"
            else:
                direction = "center"

            cv2.putText(
                frame,
                direction,
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 0, 255),
                2,
            )
            return frame, direction

    # 如果没有检测到人脸，返回原图和"unknown"方向
    return frame, "unknown"


if __name__ == "__main__":
    cap = cv2.VideoCapture(0)
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
        if direction != "unknown":
            print(direction)
    cap.release()
    cv2.destroyAllWindows()
