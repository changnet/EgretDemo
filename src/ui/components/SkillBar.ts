// 技能按钮
class SkillButton extends egret.Sprite {
    private cd: number; // 蒙皮总时长，毫秒
    private _id: number; // 唯一id，用于识别

    private maskArea: egret.Rectangle; // 蒙皮区域
    private maskTexture: egret.Shape;  // 蒙皮纹理

    constructor(bgRes: string,frameRes: string,width: number,height: number) {
        super();

        this.width = width;
        this.height = height;

        // 按钮背景图片
        var button = new egret.Bitmap();
        button.texture = RES.getRes(bgRes);
        button.width = width;
        button.height = height;
        this.addChild(button);

        // 外框
        var frame = new egret.Bitmap();
        frame.texture = RES.getRes(frameRes);
        frame.width = width;
        frame.height = height;
        this.addChild(frame);

        this.touchEnabled = true;
    }

    // 设置蒙皮相关参数
    public setMask(cd: number,color: number,alpha: number) {
        this.cd = cd;

        var maskTexture = new egret.Shape();
        maskTexture.graphics.beginFill(color,alpha);
        maskTexture.graphics.drawRect(0,0,this.width,this.height);
        maskTexture.graphics.endFill();

        this.maskArea = new egret.Rectangle(0,0,this.width,this.height);
        maskTexture.mask = this.maskArea

        this.maskTexture = maskTexture;
        this.addChild(maskTexture);
    }

    public startMask() {
        if (!this.cd) {
            throw Error("no mask parameter set");
        }

        this.maskTexture.visible = true;

        // TweenLite是一个H5动画库
        TweenLite.to(this.maskArea,this.cd/1000,{
            y: this.height,
            onUpdate: () => {
                this.maskArea.height = this.height - this.maskArea.y;
                this.maskTexture.mask = this.maskArea;
            },
            onComplete: () => {
                this.maskTexture.visible = false;
                this.stopMask();
            }
        })
    }

    private stopMask() {
        this.maskArea.x = 0;
        this.maskArea.y = 0;
        this.maskArea.width = this.width;
        this.maskArea.height = this.height;
        this.maskTexture.mask = this.maskArea;
        if (this.maskTexture.visible) {
            this.maskTexture.visible = false;
        }
    }

    public isMask(): boolean {
        return this.maskTexture.visible;
    }

    set id(id: number) {
        this._id = id;
    }

    get id(): number {
        return this._id;
    }
}

class SkillBarEvent extends egret.Event {
    public static SKILL_CLICK: string = "skill_click";

    public id: number;

    public constructor(type:string, id:number, 
        bubbles:boolean = false, cancelable:boolean = false)
    {
        super(type,bubbles,cancelable);

        this.id = id;
    }
}

class SkillBar extends egret.Sprite {

    private skillList: SkillButton[] = [];
    private skillWidth: number;
    private skillHeight: number;

    constructor(skillWidth: number = 64,skillHieght: number = 64) {
        super();

        // 设置每个技能的宽高
        this.skillWidth = skillWidth;
        this.skillHeight = skillHieght;
    }

    public addSkill(bgRes: string,frameRes: string,cd: number) {
        var button = new SkillButton(
            bgRes,frameRes,this.skillWidth,this.skillHeight);
        button.setMask(cd,0x000000,0.75);
        this.skillList.push(button);

        var idx = this.skillList.length;
        button.x = this.skillWidth*(idx - 1);
        this.width = this.skillWidth*idx;
        this.addChild(button);

        button.id = idx
        button.addEventListener(
            egret.TouchEvent.TOUCH_BEGIN,this.onSkillClick,this);

        return idx
    }

    private onSkillClick(e: egret.TouchEvent) {
        var button = <SkillButton>e.target;

        var skillBarEv = new SkillBarEvent(SkillBarEvent.SKILL_CLICK,button.id);
        this.dispatchEvent(skillBarEv);
    }
}