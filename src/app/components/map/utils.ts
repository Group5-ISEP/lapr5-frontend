export const rgbToHex = (r: number, g: number, b: number) => {
    let hex = '0x' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')

    return parseInt(hex, 16)
}

/**
 * Returns the distance of two geo coordinates in METERS
 * 
 * source from this site https://www.movable-type.co.uk/scripts/latlong.html
 * 
 * @param lat1 latitude of first point
 * @param lon1 longitude of first point
 * @param lat2 latitude of second point
 * @param lon2 longitude of second point
 */
export const distanceBetween2GeoPoints = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres

    return d
}

/**
 * Returns the inclination (angle in RADIANS) of the line formed by 2 given points
 * 
 * @param lat1 latitude of first point
 * @param lon1 longitude of first point
 * @param lat2 latitude of second point
 * @param lon2 longitude of second point
 */
export const inclinationOfLineBetween2Points = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const slope = (lat1 - lat2) / (lon1 - lon2)
    const angle = Math.atan(slope)

    return angle
}
