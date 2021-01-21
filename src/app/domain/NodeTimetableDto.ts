export interface NodeTimetableDto {
    schedule: BusPassingTime[]
}

export interface BusPassingTime {
    line: string,
    destinationName: string,
    timeInstant: number
}