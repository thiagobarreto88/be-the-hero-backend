const connection = require('../database/connection')

module.exports = {

    async create (request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({id});
    },

    async list (request, response) {
        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .select(['incidents.*', 'ongs.name', 'ongs.email', 'ongs.whatsapp', 'ongs.city', 'ongs.uf']);

        return response.json(incidents);
    },

    async delete (request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
           .select('ong_id')
           .where('id', id)
           .first();
        
        if (incident.ong_id != ong_id){
            return response.status(401).send();
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();

    }

};