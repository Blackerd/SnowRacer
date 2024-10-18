import { _decorator, Component, Node, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ThirdPersonCamera')
export class ThirdPersonCamera extends Component {
    @property(Node)
    target: Node = null; // Nhân vật mà camera sẽ theo dõi

    @property
    distance: number = 10; // Khoảng cách từ camera đến nhân vật

    @property
    height: number = 200; // Chiều cao của camera so với nhân vật

    @property
    smoothSpeed: number = 0.2; // Tốc độ di chuyển camera, giúp camera di chuyển mượt mà hơn

    private currentVelocity: Vec3 = new Vec3(); // Biến tạm để lưu tốc độ hiện tại của camera

    update(deltaTime: number) {
        if (this.target) {
            this.updateCameraPosition(deltaTime);
        }
    }

    private updateCameraPosition(deltaTime: number) {
        // Lấy vị trí hiện tại của nhân vật
        const targetPosition = this.target.worldPosition.clone();

        // Tính toán vị trí mong muốn của camera, giữ khoảng cách và độ cao
        const desiredPosition = new Vec3(
            targetPosition.x,                   // Cùng trục X với nhân vật
            targetPosition.y + this.height,     // Đặt camera cao hơn nhân vật
            targetPosition.z - this.distance    // Đặt camera phía sau nhân vật
        );

        // Lerp (Linear Interpolation) để di chuyển camera mượt mà
        Vec3.lerp(this.node.position, this.node.position, desiredPosition, deltaTime * this.smoothSpeed);

        // Đảm bảo camera luôn nhìn về phía nhân vật
        this.node.lookAt(targetPosition);
    }
}
