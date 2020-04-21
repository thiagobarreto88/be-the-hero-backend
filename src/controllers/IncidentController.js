const connection = require('../database/connection')

module.exports = {

    async create (request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        if(typeof ong_id === "undefined" || ong_id == ""){

            return response.status(400).send({ "error": "Request inválido"});

        }else{

            console.log('Criando incidente');

            const [id] = await connection('incidents').insert({
                title,
                description,
                value,
                ong_id
            });
    
            console.log('Incidente criado');

            return response.json({id});
        }
        
    },

    async list (request, response) {

        const { page = 1 } = request.query;
        
        const [count] = await connection('incidents').count();
        console.log(`Buscando casos da página ${page}`);
        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .select(
               ['incidents.*', 'ongs.name', 'ongs.email', 'ongs.whatsapp', 'ongs.city', 'ongs.uf'])
            .limit(5)
            .offset((page - 1) * 5);
            
        response.header('X-Total-Count', count['count(*)']);
        return response.json(incidents);
    },

    async delete (request, response) {
        const { id } = request.params;

        const ong_id = request.headers.authorization;

        if(typeof ong_id === "undefined" || ong_id == ""){

            return response.status(401).send({ "error": "Missing authentication header"});
        }

        const incident = await connection('incidents')
           .select('ong_id')
           .where('id', id)
           .first();
        
        if(typeof incident === "undefined"){

            return response.status(404).send({ "error": "Incident not found"});

        }else if (incident.ong_id != ong_id){
            return response.status(401).send();
        }else{
            await connection('incidents').where('id', id).delete();
            return response.status(204).send();

        }

    }

};