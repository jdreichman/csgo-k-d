const config = 
    {
        connectionString : 'mongodb://'+escape(process.env.CS_DATABASE)+':'+process.env.CS_DATABASE_PASSWORD+"@"+process.env.CS_DATABASE_URI + "/" + escape(process.env.CS_DATABASE),
    };
module.exports = config;
