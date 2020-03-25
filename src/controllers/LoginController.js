const connection = require('../database/connection')

module.exports = {
    async login (request, response) {

        const { login } = request.body;

        const ong = await connection('ongs')
            .select('*')
            .where('id', login)
            .first();

        if (!ong){
            return response.status(401).send();
        }else{
            return response.status(200).json({ ong });
        }
       
    }
};