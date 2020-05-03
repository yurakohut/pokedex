export interface IPokemonMain {
    id: number;
    name: string;
    image: string;
    types: Array<{ slot: number, type: { name: string, url: string } }>;
    weight: number;
    totalMoves: number;
    stats: Array<{ name: string, score: number }>;
};

export interface IPokemonTop {
    id: number;
    name: string;
    weight: number;
    totalMoves: number;
    attack: number
    defense: number
    hp: number
    spAttack: number
    spDefense: number
    speed: number
};