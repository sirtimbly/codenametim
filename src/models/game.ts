export class Game {
    _id:string;
    _rev:string;
    wordList:string[];
    tiles: Array<Tile>;
    redSpymaster:string;
    redClues: string[];
    blueSpymaster:string;
    blueClues: string[];

    public constructor(obj:any) {
        this._id = obj._id || '';
        this.wordList = obj.wordList || [];
        this.tiles = obj.tiles || [];
        this.redClues = [];
        this.blueClues = [];
        this.redSpymaster = 'pending';
        this.blueSpymaster = 'pending';
    } 
}

export class Tile {
    word:string;
    position:Number;
    type:TileType;
    hidden:boolean;
}

export enum TileType {
    Assassin,
    Civilian,
    Blue,
    Red
}