const Yup = require('yup');
const { v4: uuidV4 } = require('uuid')

const knex = require('../../database/knex');

class CourtsReservationsController {
  async store(req, res) {
    const { court_id } = req.params;
    const { reserved_date } = req.body;
    const { userId } = req;
    
    const schema = Yup.object().shape({
      reserved_date: Yup.date().required()
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [court] = await knex('courts')
      .select('courts.*')
      .where({ 'courts.id': court_id });

    if (!court) {
      return res.status(401).json({ error: 'Court does not exists'})
    }

    if (court.user_id !== userId) {
      return res.status(403).json({ error: 'You have no permission to do that' })
    }

    const [courtReservationExists] = await knex('courts-reservations')
      .select('courts-reservations.*')
      .where({ 'courts-reservations.court_id': court_id, 'courts-reservations.reserved_date': reserved_date });

    if (courtReservationExists) {
      return res.status(401).json({ error: 'Court already reserverd for this datetime' });
    }

    const courtReservation = {
      id: uuidV4(),
      court_id,
      reserved_by: userId,
      reserved_date,
    };

    await knex('courts-reservations').insert(courtReservation, 'id');

    return res.json(courtReservation);
  }

  async update(req, res) {
    const { court_id, id } = req.params;
    const { reserved_date } = req.body;
    const { userId } = req;

    const schema = Yup.object().shape({
      reserved_date: Yup.string().required(),
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [court] = await knex('courts')
      .select('courts.*')
      .where({ 'courts.id': court_id });

    if (!court) {
      return res.status(401).json({ error: 'Court does not exists'})
    }

    if (court.user_id !== userId) {
      return res.status(403).json({ error: 'You have no permission to do that' })
    }

    const [courtReservationExists] = await knex('courts-reservations')
      .select('courts-reservations.*')
      .where({ 'courts-reservations.id': id });

    if (!courtReservationExists) {
      return res.status(404).json({ error: 'Reservation does not exists' });
    }

    const courtReservation = {
      reserved_date,
      updated_at: new Date()
    };

    await knex('courts-reservations').update(courtReservation).where({ id });

    return res.json({
      id,
      ...courtReservation,
    });
  }

  async list(req, res) {
    const { court_id } = req.params;

    const courtsReservations = await knex('courts-reservations')
      .select('courts-reservations.*')
      .where({ 'courts-reservations.court_id': court_id });

    return res.json(courtsReservations);
  }

  async destroy(req, res) {
    const { court_id, id } = req.params;
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

    const [courtReservation] = await knex('courts-reservations')
      .select('courts-reservations.*')
      .where({ id });

    if (!courtReservation) { 
      return res.status(404).json({ message: 'Court does not exist'})
    }

    await knex('courts-reservations').where({ id }).delete();

    return res.sendStatus(204);
  }
}

module.exports = new CourtsReservationsController();
