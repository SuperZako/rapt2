// abstract class Screen

abstract class _Screen {
    abstract tick(seconds: number): void;
    abstract draw(c: CanvasRenderingContext2D): void;
    abstract resize(w, h);
    abstract keyDown(key);
    abstract keyUp(key);
}
