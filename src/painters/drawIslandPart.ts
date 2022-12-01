import { Coordinates } from "../types/Coordinates";

import Center1 from '../assets/tiles/center1.png';
import Center2 from '../assets/tiles/center2.png';
import Center3 from '../assets/tiles/center3.png';
import Center4 from '../assets/tiles/center4.png';
import Bottom1 from '../assets/tiles/bottom1.png';
import Bottom2 from '../assets/tiles/bottom2.png';
import BottomLeft from '../assets/tiles/bottomLeft.png';
import BottomRight from '../assets/tiles/bottomRight.png';
import TopLeft from '../assets/tiles/topLeft.png';
import TopRight from '../assets/tiles/topRight.png';
import Top1 from '../assets/tiles/top1.png';
import Top2 from '../assets/tiles/top2.png';
import Right1 from '../assets/tiles/right1.png';
import Right2 from '../assets/tiles/right2.png';
import Left1 from '../assets/tiles/left1.png';
import Left2 from '../assets/tiles/left2.png';
import InnerBottomLeft from '../assets/tiles/innerBottomLeft.png';
import InnerBottomRight from '../assets/tiles/innerBottomRight.png';
import InnerTopLeft from '../assets/tiles/innerTopLeft.png';
import InnerTopRight from '../assets/tiles/innerTopRight.png';


import { drawImageInGrid, drawImageInGridWithSrc } from "./drawImageInGrid";
import { IslandTiles } from "../types/IslandTiles";


export const TileMap: Record<IslandTiles, string> = {
    center1: Center1,
    center2: Center2,
    center3: Center3,
    center4: Center4,
    bottom1: Bottom1,
    bottom2: Bottom2,
    bottomLeft: BottomLeft,
    bottomRight: BottomRight,
    topLeft: TopLeft,
    topRight: TopRight,
    top1: Top1,
    top2: Top2,
    right1: Right1,
    right2: Right2,
    left1: Left1,
    left2: Left2,
    innerBottomLeft: InnerBottomLeft,
    innerBottomRight: InnerBottomRight,
    innerTopLeft: InnerTopLeft,
    innerTopRight: InnerTopRight,
}


export function drawIslandPart(ctx: CanvasRenderingContext2D, tileImage: HTMLImageElement, coord: Coordinates) {
    drawImageInGrid(ctx, tileImage, coord)
}
