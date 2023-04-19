const Yup = require('yup');
const { v4: uuidV4 } = require('uuid')

const knex = require('../../database/knex');

class CourtReviewsController {
  async store(req, res) {
    const { court_id } = req.params;
    const { review } = req.body;
    const { userId } = req;
    
    const schema = Yup.object().shape({
      review: Yup.string().required()
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

    const [courtReviewsExists] = await knex('courts-reviews')
      .select('courts-reviews.*')
      .where({ 'courts-reviews.court_id': court_id, 'courts-reviews.user_id': userId });

    if (courtReviewsExists) {
      return res.status(401).json({ error: 'Review already posted for this court' });
    }

    const courtReview = {
      id: uuidV4(),
      court_id,
      user_id: userId,
      review
    };

    await knex('courts-reviews').insert(courtReview, 'id');

    return res.json(courtReview);
  }

  async update(req, res) {
    const { court_id, id } = req.params;
    const { review } = req.body;
    const { userId } = req;

    const schema = Yup.object().shape({
      review: Yup.string().required(),
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

    const [courtReviewsExists] = await knex('courts-reviews')
      .select('courts-reviews.*')
      .where({ 'courts-reviews.id': id, 'courts-reviews.user_id': userId });

    if (!courtReviewsExists) {
      return res.status(404).json({ error: 'Reservation does not exists' });
    }

    const courtReviews = {
      review,
      updated_at: new Date()
    };

    await knex('courts-reviews').update(courtReviews).where({ id });

    return res.json({
      id,
      ...courtReviews,
    });
  }

  async list(req, res) {
    const { court_id } = req.params;

    const courtReviews = await knex('courts-reviews')
      .select('courts-reviews.*')
      .where({ 'courts-reviews.court_id': court_id });

    return res.json(courtReviews);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const { userId } = req;


    const [courtReview] = await knex('courts-reviews')
      .select('courts-reviews.*')
      .where({ id, 'courts-reviews.user_id': userId });

    if (!courtReview) { 
      return res.status(404).json({ message: 'Court reviews does not exist'})
    }

    await knex('courts-reviews').where({ id }).delete();

    return res.sendStatus(204);
  }
}

module.exports = new CourtReviewsController();
