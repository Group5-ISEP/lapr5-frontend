import Segment from "./Segment";

export default interface Path {
    lineCode: string;
    direction: string;
    segmentList: Segment[];
    firstNode: string;
    lastNode: string;
    isEmpty: boolean
}
