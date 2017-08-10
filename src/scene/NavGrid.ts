module egret3d {
    export class NavGrid {

        private _offsetX: number;
        private _offsetY: number;
        private _gridRow: number;
        private _gridCol: number;
        private _gridWidth: number;
        private _gridHeight: number;
        private _gridoffsetX: number;
        private _gridoffsetY: number;
        private _datas: Array<AStarNode>;

        constructor(gridWidth: number, gridHeight: number, gridRow: number, gridCol: number, datas: Array<AStarNode>) {
            this._gridWidth = gridWidth;
            this._gridHeight = gridHeight;
            this._gridRow = gridRow;
            this._gridCol = gridCol;
            this._datas = datas;
//            this._gridoffsetX = -(this._gridCol * this._gridWidth * 0.5 - this._gridWidth * 0.5);
//            this._gridoffsetY = -(this._gridRow * this._gridHeight * 0.5 - this._gridHeight * 0.5);
            this._gridoffsetX = 0;// -(this._gridCol * this._gridWidth * 0.5 - this._gridWidth * 0.5);
            this._gridoffsetY = 0;// -(this._gridRow * this._gridHeight * 0.5 - this._gridHeight * 0.5);
        }

        //网格宽度;
        public get gridWidth(): number {
            return this._gridWidth;
        }

        //网格高度;
        public get gridHeight(): number {
            return this._gridHeight;
        }

        //网格行数;
        public get rowNum(): number {
            return this._gridRow;
        }

        //网格列数;
        public get colNum(): number {
            return this._gridCol;
        }

        //网格源数据;
        public get datas(): Array<AStarNode> {
            return this._datas;
        }

        //网格列索引转X坐标;
        public gridXToX(gridX: number): number {
            var value: number = gridX * this._gridWidth;
            value += this._gridoffsetX;
            value += this._gridWidth * 0.5;
            return value;
        }

        //网格行索引转Y坐标;
        public gridYToY(gridY: number): number {
            var value: number = (this._gridRow - gridY - 1) * this._gridHeight;
            value += this._gridoffsetY;
            value += this._gridHeight * 0.5;
            return value;
        }

        //X坐标转网格列索引;
        public xToGridX(x: number): number {
            var value: number = x;
            value -= this._gridoffsetX;
            value = Math.floor(value / this._gridWidth);
            return value;
        }

        //Y坐标转网格行索引;
        public yToGridY(y: number): number {
            var value: number = y;
            value -= this._gridoffsetY;
            value = this._gridRow - Math.floor(value / this._gridHeight) - 1;
            return value;
        }

        //设置用户数据(data is unsigned short.);
        public setUserData(x: number, y: number, data: number) {

            var aStarNode: AStarNode = this._datas[y * this._gridCol + x];

            aStarNode.userData = (data << 1) | (aStarNode.userData & 0x01);
        }

        //是否存在单位对象;
        public isExistsUnit(x: number, y: number): boolean {
            return (this._datas[y * this._gridCol + x].userData >> 1) != 0;
        }

        //获取指定位置的用户数据;
        public getUserData(x:number, y:number): number {
            return this._datas[y * this._gridCol + x].userData >> 1;
        }



        //通过内存Buffer创建NavGrid对象;
        public static createNavGridFromBuffer(buffer: ArrayBuffer): NavGrid {

            var navGrid: NavGrid = null;

            var bytes: egret3d.ByteArray = new egret3d.ByteArray(buffer);

            //读取标识符;
            var flag: number = bytes.readUnsignedInt();

            if (flag != 0x4E415647) { //'NAVG'
                return null;
            }

            //读取版本号;
            var version: number = bytes.readUnsignedShort();

            switch (version) {
                case 1:
                    //读取网格宽度;
                    var gridWidth: number = bytes.readUnsignedByte();

                    //读取网格高度;
                    var gridHeight: number = bytes.readUnsignedByte();

                    //读取网格行数;
                    var gridRow: number = bytes.readUnsignedByte();

                    //读取网格列数;
                    var gridCol: number = bytes.readUnsignedByte();

                    //计算网格数据个数;
                    var nCount: number = gridRow * gridCol;

                    //网格数据8字节对齐;
                    nCount += (nCount % 8) ? (8 - (nCount % 8)) : 0;

                    var datas: Array<AStarNode> = new Array<AStarNode>(nCount);

                    var nIndex: number = 0;

                    //读取网格数据字节数;
                    var byteCount: number = bytes.readUnsignedShort();

                    for (var i: number = 0; i < byteCount; i++) {

                        //读取字节数据;
                        var byte: number = bytes.readUnsignedByte();

                        //解出8个网格数据;
                        datas[nIndex] = new AStarNode(nIndex % gridCol, Math.floor(nIndex / gridCol));
                        datas[nIndex++].userData = (byte & 0x80) >> 7;

                        datas[nIndex] = new AStarNode(nIndex % gridCol, Math.floor(nIndex / gridCol));
                        datas[nIndex++].userData = (byte & 0x40) >> 6;

                        datas[nIndex] = new AStarNode(nIndex % gridCol, Math.floor(nIndex / gridCol));
                        datas[nIndex++].userData = (byte & 0x20) >> 5;

                        datas[nIndex] = new AStarNode(nIndex % gridCol, Math.floor(nIndex / gridCol));
                        datas[nIndex++].userData = (byte & 0x10) >> 4;

                        datas[nIndex] = new AStarNode(nIndex % gridCol, Math.floor(nIndex / gridCol));
                        datas[nIndex++].userData = (byte & 0x08) >> 3;

                        datas[nIndex] = new AStarNode(nIndex % gridCol, Math.floor(nIndex / gridCol));
                        datas[nIndex++].userData = (byte & 0x04) >> 2;

                        datas[nIndex] = new AStarNode(nIndex % gridCol, Math.floor(nIndex / gridCol));
                        datas[nIndex++].userData = (byte & 0x02) >> 1;

                        datas[nIndex] = new AStarNode(nIndex % gridCol, Math.floor(nIndex / gridCol));
                        datas[nIndex++].userData = (byte & 0x01);
                    }

                    //创建NavGrid对象;
                    navGrid = new NavGrid(gridWidth , gridHeight , gridRow, gridCol, datas);

                    break;
                default:
                    console.log("Unknown file version! version: " + version + ".");
                    return null;
            }

            return navGrid;
        }

        private findNearbyNode(startNode: AStarNode, endNode: AStarNode): AStarNode {

            var count: number = Math.max(Math.floor(this.rowNum / 2), Math.floor(this.colNum / 2));

            var test: Vec2 = new Vec2();

            var node: AStarNode;

            for (var i: number = 1; i < count; i++) {

                //上边;
                test.x = endNode.x - i;
                test.y = endNode.y - i;
                for (var offset: number = 0; offset <= i * 2; offset++) if ((node = this.getNode(test.x + offset, test.y)) && node.isPass) {
                    node.H = this.diagoal(node, endNode);
                    return node;
                }

                //右边;
                test.x = endNode.x + i;
                test.y = endNode.y - i;
                for (var offset: number = 0; offset <= i * 2; offset++) if ((node = this.getNode(test.x, test.y + offset)) && node.isPass) {
                    node.H = this.diagoal(node, endNode);
                    return node;
                }

                //下边;
                test.x = endNode.x - i;
                test.y = endNode.y + i;
                for (var offset: number = 0; offset <= i * 2; offset++) if ((node = this.getNode(test.x + offset, test.y)) && node.isPass) {
                    node.H = this.diagoal(node, endNode);
                    return node;
                }

                //左边;
                test.x = endNode.x - i;
                test.y = endNode.y - i;
                for (var offset: number = 0; offset <= i * 2; offset++) if ((node = this.getNode(test.x, test.y + offset)) && node.isPass) {
                    node.H = this.diagoal(node, endNode);
                    return node;
                }
            }

            return null;
        }

        //查找可移动路径;
        private _cector3DPool: Vector3D[] = [];
        public findPath(start: Vector3D, end: Vector3D, paths: Vector3D[], nearby: boolean = true): boolean {

            let self = this;

            //回收Vector3D对象;
            for (var i: number = paths.length - 1; i >= 0; i--) {
                self._cector3DPool.push(paths[i]);
            }
            paths.length = 0;

            let startNode: AStarNode = self.getNode(self.xToGridX(start.x), self.yToGridY(start.z));

            let endNode: AStarNode = self.getNode(self.xToGridX(end.x), self.yToGridY(end.z));

            if (true == nearby && false == endNode.isPass) {

                endNode = self.findNearbyNode(startNode, endNode);

                if (null == endNode) {
                    return false;
                }
            }

            if (self._findPath(startNode, endNode)) {
                var vector3D: Vector3D;
                for (var i: number = 0; i < self._path.length; i++) {
                    if (self._cector3DPool.length > 0) {
                        vector3D = self._cector3DPool.shift();
                        vector3D.x = self.gridXToX(self._path[i].x);
                        vector3D.y = 0;
                        vector3D.z = self.gridYToY(self._path[i].y);
                        paths.push(vector3D);
                    }
                    else {
                        paths.push(new Vector3D(self.gridXToX(self._path[i].x), 0, self.gridYToY(self._path[i].y)));
                    }
                }
            }
            if (paths.length > 1) paths.shift();//去除第一个自身的点

            return paths.length > 0;
        }

        public isPass(x: number, y: number): boolean {
            return this.getNode(x, y).isPass;
        }

        private _path: AStarNode[];
        private _openList: Array<AStarNode>;
        private _closeList: Array<AStarNode>;
        private STRAIGHT_COST: number = 1;
        private DIAG_COST: number = Math.SQRT2;
        private _findPath(start: AStarNode, end: AStarNode): boolean {
            this._openList = [];
            this._closeList = [];
            this._path = [];
            var node: AStarNode = start;
            node.G = 0;
            node.H = this.diagoal(node, end);
            node.F = node.G + node.H;

            while (node !== end) {
                var startX: number = Math.max(0, node.x - 1);
                var startY: number = Math.max(0, node.y - 1);
                var endX: number = Math.min(this.colNum - 1, node.x + 1);
                var endY: number = Math.min(this.rowNum - 1, node.y + 1);

                for (var i = startX; i <= endX; i++) {
                    for (var j = startY; j <= endY; j++) {
                        var testNode: AStarNode = this.getNode(i, j);
                        if (testNode === node || testNode.isPass === false) {
                            continue;;
                        }
                        var cost: number = this.STRAIGHT_COST;
                        if (!((node.x === testNode.x) || (node.y === testNode.y))) {
                            cost = this.DIAG_COST;
                        }
                        var g: number = node.G + cost;
                        var h: number = this.diagoal(testNode, end);
                        var f: number = g + h;

                        if (this.isOpen(testNode) || this.isClose(testNode)) {
                            if (f < testNode.F) {
                                testNode.F = f;
                                testNode.G = g;
                                testNode.H = h;
                                testNode.parent = node;
                            }
                        } else {
                            testNode.F = f;
                            testNode.G = g;
                            testNode.H = h;
                            testNode.parent = node;
                            this._openList.push(testNode);
                        }

                    }
                }
                this._closeList.push(node);
                if (this._openList.length === 0) {
                    return false;
                }
                this._openList.sort(function (a: AStarNode, b: AStarNode): number {
                    return a.F < b.F ? -1 : 1;
                });
                node = this._openList.shift();

            }

            node = end;
            this._path.unshift(node);
            while (node !== start) {
                node = node.parent;
                this._path.unshift(node);
            }

            return true;
        }

        private getNode(x: number, y: number): AStarNode {
            return this._datas[y * this.colNum + x];
        }

        private isClose(node: AStarNode): boolean {
            return this._closeList.indexOf(node) > -1;
        }

        private isOpen(node: AStarNode): boolean {
            return this._openList.indexOf(node) > -1;
        }

        private diagoal(start: AStarNode, end: AStarNode): number {
            var dx: number = Math.abs(start.x - end.x);
            var dy: number = Math.abs(start.y - end.y);
            var diag: number = Math.min(dx, dy);
            var straight: number = dx + dy;
            return this.DIAG_COST * diag + this.STRAIGHT_COST * (straight - 1 * diag);
        }
    }

    export class AStarNode {

        public x: number;
        public y: number;
        public G: number;
        public H: number;
        public F: number;
        public parent: AStarNode;
        public userData: number;

        public constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        public get isPass(): boolean {
            return 0 == this.userData;
        }
    }    
}
