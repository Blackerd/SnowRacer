import { _decorator, Component, Node, Graphics, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WaypointManager')
export class WaypointManager extends Component {
    @property([Node])
    waypoints: Node[] = [];

    onLoad() {
        const graphics = this.node.addComponent(Graphics);
        graphics.strokeColor = Color.BLUE; // Màu đường nối nổi bật

        for (let i = 0; i < this.waypoints.length - 1; i++) {
            const start = this.waypoints[i].position;
            const end = this.waypoints[i + 1].position;

            graphics.moveTo(start.x, start.y);
            graphics.lineTo(end.x, end.y);
            graphics.stroke();
        }
    }
}
