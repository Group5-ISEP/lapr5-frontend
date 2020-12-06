

/**
* Your favorite port
*/
exports.port = parseInt(process.env.PORT, 10) || 3000

/**
* Master data api prefix
*/
exports.api = {
    prefix: '/api',
}

exports.masterDataURL = process.env.MASTERDATA_URL || 'https://localhost:3000'