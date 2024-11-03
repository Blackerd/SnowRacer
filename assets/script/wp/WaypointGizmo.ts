import { _decorator, Component, Color, Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WaypointGizmo')
export class WaypointGizmo extends Component {
    private graphics: Graphics = null;

    onLoad() {
        this.graphics = this.node.addComponent(Graphics);
        this.drawGizmo();
    }

    drawGizmo() {
        // Vẽ một vòng tròn để đại diện cho waypoint
        this.graphics.clear(); // Xóa bất kỳ hình ảnh nào đã vẽ trước đó
        this.graphics.circle(0, 0, 10); // Bán kính có thể điều chỉnh
        this.graphics.fillColor = Color.RED; // Màu sắc chấm
        this.graphics.fill();
    }

    update() {
        // Cập nhật vị trí gizmo để hiển thị chính xác theo vị trí của node
        this.graphics.node.position = this.node.position;
    }
}
