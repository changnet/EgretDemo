/**
 *	辅助数学函数 
 */
 class EMathEx {
    // 规范化角度 把[0，360]转换为[-180, 180]
     public static normalizeAngle(a: number): number {
        while (a > 180) a -= 360;
        while (a < -180) a += 360;

        return a;
    }
    //
     public static fNormalizeAngle(a: number): number {
        while (a > 180) a -= 360;
        while (a < -180) a += 360;
        return a;
    }
    // 弧度转换为角度
     public static radianToAngle(radian: number): number {
        return radian * 180 / Math.PI;
    }

    // Return the sign (-1, 0, 1) of the given number;
     public static sign(n: number): number {
        if (n == 0) return 0;

        return n / Math.abs(n);
    }
}