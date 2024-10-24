import { _decorator, Component, Node, Vec3, input, Input, KeyCode, RigidBody, v3, EventKeyboard, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Character')
export class Cha extends Component {
    @property
    moveSpeed: number = 20; // Tốc độ di chuyển tự động

    @property
    jumpForce: number = 100; // Lực nhảy

    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null; // Animation của nhân vật

    private rigidBody: RigidBody;
    private isMovingLeft: boolean = false; // Trạng thái di chuyển sang trái
    private isMovingRight: boolean = false; // Trạng thái di chuyển sang phải
    private isJumping: boolean = false; // Trạng thái nhảy

    start() {
        // Lấy RigidBody của nhân vật để xử lý vật lý
        this.rigidBody = this.getComponent(RigidBody);
        
        // Đăng ký sự kiện phím nhấn
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        // Chạy animation trượt
        this.playSlideAnimation();
    }

    update(deltaTime: number) {
        console.log(`Velocity: ${this.rigidBody.linearVelocity}`);
        this.moveForward(deltaTime); // Di chuyển liên tục về phía trước
    }

    private moveForward(deltaTime: number) {
        // Lấy vận tốc hiện tại của nhân vật
        const currentVelocity = this.rigidBody.linearVelocity.clone();

        // Tạo vận tốc mới để di chuyển về phía trước (theo trục Z)
        currentVelocity.z = -this.moveSpeed;

        // Kiểm tra trạng thái di chuyển trái/phải
        if (this.isMovingLeft) {
            currentVelocity.x = -this.moveSpeed; // Di chuyển sang trái
        } else if (this.isMovingRight) {
            currentVelocity.x = this.moveSpeed; // Di chuyển sang phải
        } else {
            currentVelocity.x = 0; // Không di chuyển ngang khi không bấm phím
        }

        // Cập nhật vận tốc mới cho RigidBody
        this.rigidBody.setLinearVelocity(currentVelocity);
    }

    // Xử lý sự kiện phím nhấn và thả phím
    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A: // Di chuyển sang trái
                this.isMovingLeft = true;
                this.isMovingRight = false; // Ngừng di chuyển sang phải khi bấm trái
                break;
            case KeyCode.KEY_D: // Di chuyển sang phải
                this.isMovingRight = true;
                this.isMovingLeft = false; // Ngừng di chuyển sang trái khi bấm phải
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

    // Hàm để phát animation trượt
    private playSlideAnimation() {
        if (this.skeletalAnimation) {
            this.skeletalAnimation.play('Action'); // 'Action' là tên animation trượt
        }
    }

    // Phát animation nhảy
    private playJumpAnimation() {
        if (this.skeletalAnimation) {
            this.skeletalAnimation.play('Jump'); // Giả sử 'Jump' là tên animation nhảy
        }
    }

    private jump() {
        if (this.rigidBody && !this.isJumping) {
            // Lấy vận tốc hiện tại và chỉ thay đổi trục Y để nhảy
            const currentVelocity = this.rigidBody.linearVelocity.clone();
            currentVelocity.y = this.jumpForce;
            this.rigidBody.setLinearVelocity(currentVelocity);

            this.isJumping = true;
            this.playJumpAnimation();
        }
    }

    onCollisionEnter() {
        // Khi nhân vật chạm đất, cho phép nhảy lại
        this.isJumping = false;
        this.playSlideAnimation();
    }

    // Hủy đăng ký sự kiện khi component bị hủy
    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}
