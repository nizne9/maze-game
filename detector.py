import math
import cv2
import numpy as np
import dlib

# 初始化 dlib 的面部检测器和姿态估计器
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
myaw = []
mpitch = []
mroll = []

# 3D模型的3D关键点坐标（基于dlib关键点索引）
model_points = [
    (0.0, 0.0, 0.0),  # 鼻子
    (0.0, -330.0, -65.0),  # 下巴
    (-225.0, 170.0, -135.0),  # 左眼角
    (225.0, 170.0, -135.0),  # 右眼角
    (-150.0, -150.0, -125.0),  # 左嘴角
    (150.0, -150.0, -125.0),  # 右嘴角
]


def get_rotation_vector(image):
    # 转换图像为灰度
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # 使用 dlib 检测面部特征点
    faces = detector(gray)

    if len(faces) == 0:
        return None

    face = faces[0]
    landmarks = predictor(gray, face)

    # 从面部特征点中获取头部姿态信息
    image_points = []
    for i in [30, 8, 36, 45, 48, 54]:  # 使用所需的关键点索引
        x = landmarks.part(i).x
        y = landmarks.part(i).y
        image_points.append((x, y))

        # 在图像上绘制关键点
        cv2.circle(image, (x, y), 3, (0, 255, 0), -1)

    # 相机内参（根据1280x720相机分辨率）
    focal_length = 1280
    center = (640, 360)

    # 计算相机的畸变系数
    camera_matrix = np.array(
        [[focal_length, 0, center[0]], [0, focal_length, center[1]], [0, 0, 1]],
        dtype=np.float32,
    )

    # 使用 solvePnP 函数计算旋转向量和平移向量
    _, rotation_vector, _ = cv2.solvePnP(
        np.array(model_points, dtype=np.float32),
        np.array(image_points, dtype=np.float32),
        camera_matrix,
        None,
    )

    return rotation_vector


def detect_face_orientation(image):
    # 检测人脸朝向并获取带有标记的图像

    rotation_vector = get_rotation_vector(image)

    if rotation_vector is None:
        return "unknow", image

    # 将旋转向量转换为欧拉角

    rotation_matrix, _ = cv2.Rodrigues(rotation_vector)
    euler_angles = cv2.RQDecomp3x3(rotation_matrix)

    # 提取欧拉角中的偏航、俯仰和滚转角度
    yaw = euler_angles[0][1]  # Y 轴
    pitch = euler_angles[0][0]  # X 轴
    roll = euler_angles[0][2]  # Z 轴

    myaw.append(yaw)
    mpitch.append(pitch)
    mroll.append(roll)

    # 判断头的朝向
    if yaw < 20 and yaw > -20 and (-170 < pitch < -180 or 170 < pitch < 180):
        direction = "center"
    elif yaw < -10 and roll < -5:
        direction = "right"
    elif yaw > 10 and roll < 5:
        direction = "left"
    elif -160 < pitch < -180 or roll > 5:
        direction = "down"
    elif 160 < pitch < 170:
        direction = "up"
    else:
        direction = "center"

    # 在画面上绘制人脸框和姿态信息
    cv2.putText(
        image,
        str(yaw),
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),
        2,
    )
    cv2.putText(
        image,
        str(pitch),
        (10, 60),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),
        2,
    )
    cv2.putText(
        image,
        str(roll),
        (10, 90),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),
        2,
    )

    return direction, image


if __name__ == "__main__":
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 360)

    while True:
        # 读取摄像头图像帧
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.flip(frame, 1)
        # 检测人脸朝向并获取带有标记的图像
        direction, marked_frame = detect_face_orientation(frame)

        # 显示带有标记的图像
        cv2.imshow("Frame", marked_frame)

        # 按下 'q' 键退出循环
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    # 关闭摄像头和窗口
    cap.release()
    cv2.destroyAllWindows()
