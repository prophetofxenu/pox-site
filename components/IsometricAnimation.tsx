import { createContext, useEffect, useRef, useState } from "react";
import styles from "../styles/components/IsometricAnimation.module.scss";

class Diamond {

  private static directions = [30, 150, 210, 330] as const;
  private static maxSpeed = 3;
  private static canvas: HTMLCanvasElement;

  private static nextDir = -1;
  private static nextDirection() {
    Diamond.nextDir = (Diamond.nextDir + 1) % Diamond.directions.length;
    return Diamond.directions[Diamond.nextDir];
  }

  public x: number;
  public y: number;

  private color: string;
  private speed: number;
  private dir: 30 | 150 | 210 | 330;
  private dirCooldown = 0;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;

    this.dir = Diamond.nextDirection();
    this.speed = Math.floor(Math.random() * Diamond.maxSpeed) + 1;

    if (Diamond.canvas === undefined)
      this.prerender();
  }

  private prerender() {
    let canvas = document.createElement("canvas");
    canvas.width = 34;
    canvas.height = 20;
    let context = canvas.getContext("2d");
    if (context === null)
      throw "prerender: context was null";
    
    context.fillStyle = "#f508f4";
    context.beginPath();
    context.moveTo(17, 0);
    context.lineTo(34, 10);
    context.lineTo(17, 20);
    context.lineTo(0, 10);
    context.closePath();
    context.fill();

    Diamond.canvas = canvas;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    let x = Math.floor(this.x);
    let y = Math.floor(this.y);
    ctx.drawImage(Diamond.canvas, x, y);
  }

  private dirUp() {
    switch (this.dir) {
      case 30:
        this.dir = 150;
        break;
      case 150:
        this.dir = 210;
        break;
      case 210:
        this.dir = 330;
        break;
      case 330:
        this.dir = 30;
        break;
    }
  }

  private dirDown() {
    switch (this.dir) {
      case 30:
        this.dir = 330;
        break;
      case 150:
        this.dir = 30;
        break;
      case 210:
        this.dir = 150;
        break;
      case 330:
        this.dir = 210;
        break;
    }
  }

  private rollNewDirection(): void {
    if (this.dirCooldown > 100 && Math.random() > 0.99) {
      if (Math.random() > 0.5) {
        this.dirUp();
      } else {
        this.dirDown();
      }
    }
    this.dirCooldown++;
  }

  public next(): void {
    this.rollNewDirection();
    this.x += Math.cos(this.dir * Math.PI / 180) * this.speed;
    this.y -= Math.sin(this.dir * Math.PI / 180) * this.speed;
  }

}

export default function IsometricAnimation() {

  let canvasRef = useRef<HTMLCanvasElement>(null);
  let [width, setWidth] = useState(0);

  useEffect(() => {
    if (width === 0) {
      setWidth(window.innerWidth);
      return;
    }

    // init
    let canvas = canvasRef.current;
    if (canvas === null || canvas === undefined) {
      console.error("Canvas was null");
      return;
    }
    let ctx = canvas?.getContext("2d");
    if (ctx === null || ctx === undefined) {
      console.error("Canvas context was null");
      return;
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, window.innerWidth, canvas.height);

    let image = new Image();
    let x = 75;
    let y = 40;
    const scale = 0.4;
    image.src = "/images/xe-isometric-outlined.png";

    let frame = 0;
    let diamonds: Diamond[] = [];
    const diamondColor = "#f508f4";
    let lastTime = performance.now();
    const frameThreshold = Math.floor(1000 / 60);
    let render = (now: any) => {
      if (canvas === null || canvas === undefined ||
        ctx === null || ctx === undefined)
        throw "render: context was null";

      let prerender = document.createElement("canvas");
      prerender.width = canvas.width;
      prerender.height = canvas.height;
      let pctx = prerender.getContext("2d");
      if (pctx === null)
        throw "render: prerender context was null";

      let elapsed = now - lastTime;
      if (elapsed < frameThreshold) {
        requestAnimationFrame(render);
        return;
      }
      lastTime = now;

      pctx.clearRect(0, 0, canvas?.width, canvas?.height);
      pctx.fillStyle = "black";
      pctx.fillRect(0, 0, window.innerWidth, canvas.height);

      let popupD = 50;
      let popupT = (frame - 60) / popupD;
      let popupB = 40;
      let popupC = -30;
      let popupDelay = 60;
      let maxDiamonds = 20;

      if (frame > popupD + popupDelay + 2) {

        if (diamonds.length < maxDiamonds &&
          Math.random() < (maxDiamonds - diamonds.length) / (maxDiamonds * 10)) {
          diamonds.push(new Diamond(125, 75, diamondColor));
        }

        for (let i = 0; i < diamonds.length; ) {
          let diamond = diamonds[i];
          diamond.next();
          if (diamond.x < -40 || diamond.x > canvas.width + 40 ||
            diamond.y < -30 || diamond.y > canvas.height + 30) {
              diamonds.splice(i, 1);
          } else {
            diamond.draw(pctx);
            i++;
          }
        }

      }

      pctx.drawImage(image, x, y, 581 * scale, 410 * scale);

      if (frame > popupDelay && frame < popupD + popupDelay + 2) {
        y = -popupC * popupT * (popupT - 2) + popupB;
      }

      if (frame < popupD + popupDelay + 2) {
        let base = { x: 75, y: 101 };
        pctx.fillStyle = "black";
        pctx.beginPath();
        pctx.moveTo(base.x, base.y);
        pctx.lineTo(base.x + 127, base.y + 73);
        pctx.lineTo(base.x + 127, base.y + 105);
        pctx.lineTo(base.x, base.y + 30);
        pctx.closePath();
        pctx.fill();

        base = { x: 75 + 127, y: 101 + 73 };
        pctx.beginPath();
        pctx.moveTo(base.x, base.y);
        pctx.lineTo(base.x + 106, base.y - 61);
        pctx.lineTo(base.x + 106, base.y - 31);
        pctx.lineTo(base.x, base.y + 30);
        pctx.closePath();
        pctx.fill();
      }

      ctx.drawImage(prerender, 0, 0);
      frame++;
      requestAnimationFrame(render);

    };

    requestAnimationFrame(render);

  }, [width]);

  return (
    <div className={styles.isometricAnimation}>
      <canvas id="isometricAnimationCanvas" width={width} height="200" ref={canvasRef} >
      </canvas>
    </div>
  );

};
