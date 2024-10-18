import { _decorator, Component, Node, Vec3, BoxCollider } from 'cc'; 
const { ccclass, property } = _decorator;

@ccclass('RoadController')
export class RoadController extends Component {
    @property(Node)
    roadSegment1: Node = null;

    @property(Node)
    roadSegment2: Node = null;

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
        this.loopRoad();
    }

    private loopRoad() {
        // Cập nhật vị trí của đoạn đường dựa vào vị trí của nhân vật
        const position1 = this.roadSegment1.position;
        const position2 = this.roadSegment2.position;

        console.log('Road 1 Position:', position1);
        console.log('Road 2 Position:', position2);

        // Kiểm tra nếu đoạn đường đầu tiên ra khỏi tầm nhìn
        if (position1.z < -this.roadLength) {
            this.roadSegment1.setPosition(new Vec3(position2.x, position2.y, position2.z + this.roadLength));
            this.swapSegments(); // Hoán đổi vị trí đoạn đường
            console.log('Swapped Road 1 to new position:', this.roadSegment1.position);
        }

        // Kiểm tra nếu đoạn đường thứ hai ra khỏi tầm nhìn
        if (position2.z < -this.roadLength) {
            this.roadSegment2.setPosition(new Vec3(position1.x, position1.y, position1.z + this.roadLength));
            this.swapSegments(); // Hoán đổi vị trí đoạn đường
            console.log('Swapped Road 2 to new position:', this.roadSegment2.position);
        }
    }

    private swapSegments() {
        // Hoán đổi vị trí của đoạn đường
        const temp = this.roadSegment1;
        this.roadSegment1 = this.roadSegment2;
        this.roadSegment2 = temp;
    }
}
