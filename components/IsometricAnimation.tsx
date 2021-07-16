import { createContext, useEffect, useRef, useState } from "react";
import styles from "../styles/components/IsometricAnimation.module.scss";

class Diamond {

  static directions = [30, 150, 210, 330] as const;
  static speed = 1;

  public x: number;
  public y: number;

  private color: string;
  private dir: 30 | 150 | 210 | 330;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;

    this.dir = Diamond.directions[Math.floor(Math.random() * 4)];
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    let oldStyle = ctx.fillStyle;

    let x = Math.floor(this.x);
    let y = Math.floor(this.y);

    ctx.fillStyle = "#f508f4";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 17, y + 10);
    ctx.lineTo(x, y + 20);
    ctx.lineTo(x - 17, y + 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = oldStyle;
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
    if (Math.random() > 0.99) {
      if (Math.random() > 0.5) {
        this.dirUp();
      } else {
        this.dirDown();
      }
    }
  }

  public next(): void {
    this.rollNewDirection();
    this.x += Math.cos(this.dir * Math.PI / 180) * Diamond.speed;
    this.y -= Math.sin(this.dir * Math.PI / 180) * Diamond.speed;
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
    let scale = 0.4;
    image.src = "/images/xe-isometric-outlined.png";

    let frame = 0;
    let diamonds: Diamond[] = [];
    let diamondColor = "#f508f4";
    let render = () => {
      if (canvas === null || canvas === undefined ||
        ctx === null || ctx === undefined)
        return;

      ctx.clearRect(0, 0, canvas?.width, canvas?.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, window.innerWidth, canvas.height);

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

        for (let i = 0; i < diamonds.length; i++) {
          let diamond = diamonds[i];
          diamond.next();
          if (diamond.x < -20 || diamond.x > canvas.width + 20 ||
            diamond.y < -20 || diamond.y > canvas.height + 20) {
              diamonds.splice(i, 1);
              console.log("delete");
          } else {
            diamond.draw(ctx);
          }
        }

      }

      ctx.drawImage(image, x, y, 581 * scale, 410 * scale);

      frame++;

      if (frame > popupDelay && frame < popupD + popupDelay + 2) {
        y = -popupC * popupT * (popupT - 2) + popupB;
      }

      if (frame < popupD + popupDelay + 2) {
        let base = { x: 75, y: 101 };
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(base.x, base.y);
        ctx.lineTo(base.x + 127, base.y + 73);
        ctx.lineTo(base.x + 127, base.y + 105);
        ctx.lineTo(base.x, base.y + 30);
        ctx.closePath();
        ctx.fill();

        base = { x: 75 + 127, y: 101 + 73 };
        ctx.beginPath();
        ctx.moveTo(base.x, base.y);
        ctx.lineTo(base.x + 106, base.y - 61);
        ctx.lineTo(base.x + 106, base.y - 31);
        ctx.lineTo(base.x, base.y + 30);
        ctx.closePath();
        ctx.fill();
      }

    };

    let timer = setInterval(() => requestAnimationFrame(render), 1000 / 60);
    return () => clearInterval(timer);

  }, [width]);

  return (
    <div className={styles.isometricAnimation}>
      <canvas id="isometricAnimationCanvas" width={width} height="200" ref={canvasRef} >
      </canvas>
    </div>
  );

};
