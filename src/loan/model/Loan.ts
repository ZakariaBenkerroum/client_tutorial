import { Client } from "../../client/client";
import { Game } from "../../game/model/game";


export interface Loan {
    id: number;
    client: Client;
    game: Game;
    startDate: Date;
    endDate: Date;
}