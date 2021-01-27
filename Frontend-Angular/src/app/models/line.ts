import { Bus } from './bus';
import { Station } from './station';

export class Arrival {
    id: string;
    arrivalTimes: Date[];
    bus: Bus;
    station: Station;
    dayType: string;
}
