

export type ItemName = 'canonPowerUp' | 'shipSpeedUp' | 'canonDistanceUp';

export interface ItemEffect {
    speed?: number;
    power?: number;
    shootDistance?: number;
}

export interface ItemType {
    name: ItemName;
    effect: ItemEffect[];
}