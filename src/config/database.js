const { connect } = require('mongoose')

module.exports = async (app) => {
    try {
        await connect(process.env.DATABASE_URL)
        console.log('DB connection successful');
    } catch (error) {
        console.log('Error connecting to DB.\n ---> \n' + error);
    }
}