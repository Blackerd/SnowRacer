import { _decorator, Component, Node, Vec3, BoxCollider } from 'cc'; 
const { ccclass, property } = _decorator;

@ccclass('RoadController')
export class RoadController extends Component {
    @property(Node)
    roadSegment1: Node = null;

    @property(Node)
    roadSegment2: Node = null;

    @property(Node)
    character: Node = null; // Node nhân vật

    private roadLength: number;

    start() {
        // Lấy kích thước của đoạn đường
        const collider = this.roadSegment1.getComponent(BoxCollider); 
        if (collider) {
            this.roadLength = collider.size.z; // Lấy chiều dài của đoạn đường 
        } else {
            console.error("No BoxCollider found on roadSegment1");
        }
        // Đặt vị trí ban đầu cho đoạn đường
        this.roadSegment2.setPosition(new Vec3(this.roadSegment1.position.x, this.roadSegment1.position.y, this.roadSegment1.position.z + this.roadLength));
    }

    update(deltaTime: number) {
        // this.loopRoad();
    }

    private loopRoad() {
        // Cập nhật vị trí của đoạn đường dựa vào vị trí của nhân vật
        const position1 = this.roadSegment1.position;
        const position2 = this.roadSegment2.position;
        const characterPositionZ = this.character.position.z; // Lấy vị trí của nhân vật

        // Cập nhật vị trí đường đi
        // Di chuyển đoạn đường về phía trước (theo trục Z)
        const moveSpeed = 0.1; // Tốc độ di chuyển
        this.roadSegment1.setPosition(new Vec3(position1.x, position1.y, position1.z - moveSpeed));
        this.roadSegment2.setPosition(new Vec3(position2.x, position2.y, position2.z - moveSpeed));

        if (this.roadSegment1.position.z - characterPositionZ > this.roadLength) {
            this.roadSegment1.setPosition(new Vec3(this.roadSegment1.position.x, this.roadSegment1.position.y, this.roadSegment2.position.z + this.roadLength));
        }

        if (this.roadSegment2.position.z - characterPositionZ > this.roadLength) {
            this.roadSegment2.setPosition(new Vec3(this.roadSegment2.position.x, this.roadSegment2.position.y, this.roadSegment1.position.z + this.roadLength));
        }

    }

    private swapSegments() {
        // Hoán đổi vị trí của đoạn đường
        const temp = this.roadSegment1;
        this.roadSegment1 = this.roadSegment2;
        this.roadSegment2 = temp;
    }
}
