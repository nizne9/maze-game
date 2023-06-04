import cv2
import dlib


thresholdValue = 5
last_loc_x, last_loc_y, next_loc_x, next_loc_y = 0, 0, 0, 0
cx, cy = 0, 0


def detect_face_orientation(frame):
    # 在这里实现人脸朝向检测算法，根据检测结果生成移动指令
    # 加载人脸方向分类器
    face_cascade = cv2.CascadeClassifier("MazeGame\haarcascade_frontalface_default.xml")
    face_direction_cascade = cv2.CascadeClassifier(
        "MazeGame\haarcascade_frontalface_alt.xml"
    )
    # 将图像转换为灰度图像
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # 检测人脸
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    global last_loc_x, last_loc_y, next_loc_x, next_loc_y
    global cx, cy
    # 对于每个检测到的人脸，进行方向分类
    for x, y, w, h in faces:
        # 对人脸进行方向分类
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
        face_direction = face_direction_cascade.detectMultiScale(
            gray[y : y + h, x : x + w], 1.3, 5
        )

        # 判断人脸方向并返回结果
        if len(face_direction) > 0:
            fx, fy, fw, fh = face_direction[0]
            cx, cy = fx + fw // 2, fy + fh // 2
            if (next_loc_x == 0 and next_loc_y == 0) or (
                cx == 0 and cy == 0
            ):  # 第一次检测或者检测不到
                last_loc_x, last_loc_y = 0, 0
                next_loc_x, next_loc_y = cx, cy

            else:  # 非第一次检测
                last_loc_x, last_loc_y = next_loc_x, next_loc_y
                next_loc_x, next_loc_y = cx, cy
            Hor = next_loc_x - last_loc_x
            Ver = next_loc_y - last_loc_y

            if Ver < -1 * thresholdValue:
                return "up"
            elif Ver > thresholdValue:
                return "down"
            elif Hor < -1 * thresholdValue:
                return "left"
            elif Hor > thresholdValue:
                return "right"
            else:
                return "center"

    # 如果没有检测到人脸，返回默认结果
    return "unknown"


if __name__ == "__main__":
    cap = cv2.VideoCapture(0)
    while True:
        # 读取摄像头图像帧
        ret, frame = cap.read()

        if not ret:
            break
        ret, frame = cap.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # 检测人脸朝向生成移动指令
        direction = detect_face_orientation(frame)
        # 显示返回的每帧
        cv2.imshow("frame", frame)
        cv2.waitKey(1)
        print(direction)
    cap.release()
    cv2.destroyAllWindows()
