import Segment from "./Segment";

export default interface Path {
    id: string;
    lineCode: string;
    direction: string;
    segmentList: Segment[];
    firstNode: string;
    lastNode: string;
    isEmpty: boolean;
}
