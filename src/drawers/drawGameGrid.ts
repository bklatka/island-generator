import { times } from 'lodash-es'
// recommended resolutions
// 48,

const RATIO = [4, 3];
const X_RESOLUTION = 24;
const Y_RESOLUTION = X_RESOLUTION/RATIO[0] * RATIO[1];


const GRID_COLOR = '#76c4ff'



export const drawGameGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = GRID_COLOR;

    drawVerticalLines(ctx);
    drawHorizontalLines(ctx);
}

function drawVerticalLines(ctx: CanvasRenderingContext2D) {
    const step = getXStep(ctx);


    times(X_RESOLUTION, (current) => {
        ctx.beginPath();
        ctx.moveTo(step * current, 0);
        ctx.lineTo(step * current, ctx.canvas.height);
        ctx.closePath();
        ctx.stroke();
    })

}

function drawHorizontalLines(ctx: CanvasRenderingContext2D) {
    const step = getYStep(ctx);

    times(Y_RESOLUTION, (current) => {
        ctx.beginPath();
        ctx.moveTo(0, step * current);
        ctx.lineTo(ctx.canvas.width, step * current);
        ctx.closePath();
        ctx.stroke();
    })
}

function getXStep(ctx: CanvasRenderingContext2D): number {
    const {  width } = ctx.canvas;
    return width/X_RESOLUTION;
}

function getYStep(ctx: CanvasRenderingContext2D): number {
    const { height } = ctx.canvas;
    return height/Y_RESOLUTION;
}