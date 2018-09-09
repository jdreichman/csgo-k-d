const config = 
    {
        connectionString : 'mongodb://'+process.env.CS_DATABASE+':'+process.env.CS_DATABASE_PASSWORD+"@"+process.env.CS_BASE_URI + "/" + process.env.CS_DATABASE,
    };
module.exports = config;
