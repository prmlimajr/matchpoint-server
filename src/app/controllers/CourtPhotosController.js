const { v4: uuidV4 } = require('uuid')
const fs = require('fs');
const knex = require('../../database/knex');

class CourtPhotosController {
  async store(req, res) {
    const { userId } = req;
    const { court_id } = req.params;

    const [court] = await knex('courts')
      .select('courts.*')
      .where({ 'courts.id': court_id });

    if (!court) {
      return res.status(401).json({ error: 'Court does not exists'})
    }

    if (court.user_id !== userId) {
      return res.status(403).json({ error: 'You have no permission to do that' })
    }

    for (const photo of req.files) {
      const base64 = new Buffer(fs.readFileSync(photo.path)).toString('base64');
    
      const url = `data:image/png;base64,${base64}`;

      const file = {
        id: uuidV4(),
        court_id,
        url
      };
  
      await knex('courts-photos').insert(file);
    }

    return res.status(200).json({ message: 'Files uploaded' });
  }

  async destroy(req, res) {
    const { id, court_id } = req.params;
    const { userId } = req;

    const [court] = await knex('courts')
      .select('courts.*')
      .where({ 'courts.id': court_id });

    if (!court) {
      return res.status(401).json({ error: 'Court does not exists'})
    }

    if (court.user_id !== userId) {
      return res.status(403).json({ error: 'You have no permission to do that' })
    }

    const [courtPhoto] = await knex('courts-photos')
      .select('courts-photos.*')
      .where({ id });

    if (!courtPhoto) { 
      return res.status(404).json({ message: 'Photo does not exist'})
    }

    await knex('courts-photos').where({ id }).delete();

    return res.sendStatus(204);
  }
}

module.exports = new CourtPhotosController();
