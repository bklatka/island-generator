

export function loadImage(imageSrc: string): HTMLImageElement {
    const image = new Image();
    image.src = imageSrc;
    return image;
}