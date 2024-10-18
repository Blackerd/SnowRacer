import { _decorator, Component, Node, Vec3, input, Input, KeyCode, RigidBody, v3, EventKeyboard } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Character')
export class Cha extends Component {
    @property
    moveSpeed: number = 100; // Tốc độ di chuyển tự động

    @property
    horizontalLimit: number = 50; // Giới hạn di chuyển trái/phải

    @property
    jumpForce: number = 10; // Lực nhảy

    private rigidBody: RigidBody;
    private isMovingLeft: boolean = false; // Trạng thái di chuyển sang trái
    private isMovingRight: boolean = false; // Trạng thái di chuyển sang phải

    start() {
        // Lấy RigidBody của nhân vật để xử lý vật lý
        this.rigidBody = this.getComponent(RigidBody);
        
        // Đăng ký sự kiện phím nhấn
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        // Bắt đầu tự động di chuyển
        this.schedule(this.moveForward, 0.1); // Di chuyển tự động về phía trước
    }

    // Di chuyển về phía trước
    private moveForward() {
        const currentPos = this.node.position;
        // Di chuyển nhân vật về phía trước (theo trục Z)
        this.node.setPosition(new Vec3(currentPos.x, currentPos.y, currentPos.z - this.moveSpeed));
        
        // Xử lý di chuyển trái và phải
        if (this.isMovingLeft) {
            this.moveLeft();
        }
        if (this.isMovingRight) {
            this.moveRight();
        }
    }

    // Xử lý sự kiện phím nhấn và thả phím
    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A: // Di chuyển sang trái
                this.isMovingLeft = true;
                break;
            case KeyCode.KEY_D: // Di chuyển sang phải
                this.isMovingRight = true;
                break;
            case KeyCode.SPACE: // Nhảy
                this.jump();
                break;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A: // Ngừng di chuyển sang trái
                this.isMovingLeft = false;
                break;
            case KeyCode.KEY_D: // Ngừng di chuyển sang phải
                this.isMovingRight = false;
                break;
        }
    }

    private moveLeft() {
        const currentPos = this.node.position;
        const speedFactor = 0.6; // Tăng giá trị này để tăng tốc độ phản hồi
        const newX = Math.max(currentPos.x - this.moveSpeed * speedFactor, -this.horizontalLimit); // Giới hạn di chuyển sang trái
        this.node.setPosition(new Vec3(newX, currentPos.y, currentPos.z));
    }
    
    private moveRight() {
        const currentPos = this.node.position;
        const speedFactor = 0.6; // Tăng giá trị này để tăng tốc độ phản hồi
        const newX = Math.min(currentPos.x + this.moveSpeed * speedFactor, this.horizontalLimit); // Giới hạn di chuyển sang phải
        this.node.setPosition(new Vec3(newX, currentPos.y, currentPos.z));
    }
    

    private jump() {
        if (this.rigidBody) {
            this.rigidBody.applyImpulse(v3(0, this.jumpForce, 0)); // Nhảy theo trục Y
        }
    }
    
    // Hủy đăng ký sự kiện khi component bị hủy
    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}
