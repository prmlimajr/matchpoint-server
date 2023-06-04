const Yup = require('yup');
const { v4: uuidV4 } = require('uuid');
const fs = require('fs');
const knex = require('../../database/knex');

const convertToBase64 = (img) => {
  console.log({ img })
  const base64 = new Buffer(fs.readFileSync(img.path)).toString('base64');
      
  return `data:image/png;base64,${base64}`;
}

class CompanyController {
  async store(req, res) {
    const { name, address, lat, lng, cellphone, phone, bio, facebook, instagram, description, questionsAndAnswers, history, courts } = req.body;
    const { files } = req;

    const { logo, firstPicture, secondPicture, thirdPicture, courtPicture } = files
    
    const base64Logo = logo ? convertToBase64(logo) : ''
    const base64FirstPicture = firstPicture ? convertToBase64(firstPicture) : ''
    const base64SecondPicture = secondPicture ? convertToBase64(secondPicture) : ''
    const base64ThirdPicture = thirdPicture ? convertToBase64(thirdPicture) : ''

    const company = {
      id: uuidV4(),
      logo: base64Logo,
      firstPicture: base64FirstPicture,
      secondPicture: base64SecondPicture,
      thirdPicture: base64ThirdPicture,
      name,
      address,
      lat,
      lng,
      cellphone,
      phone,
      bio, 
      facebook, 
      instagram, 
      description,
      history, 
      vip: false, 
    };

    const companyId = await knex('company').insert(company, 'id');

    const normalizedQuestionsAndAnswers = JSON.parse(questionsAndAnswers)

    for (const qa of normalizedQuestionsAndAnswers) {
      const question = {
        id: uuidV4(),
        company_id: companyId,
        question: qa.question,
        answer: qa.answer
      }

      await knex('questions').insert(question)
    }

    const normalizedCourts = JSON.parse(courts);

    for (const court of courts) {
      const insertedCourt = {
        id: uuidV4(),
        company_id: companyId,
        address: court.address,
        lat: court.lat,
        lng: court.lng,
        sports: court.sports,
        is_indoor: court.isIndoor,
      }

      await knex('courts').insert(insertedCourt);
    }

    company.questionsAndAnswers = normalizedQuestionsAndAnswers;
    company.courts = normalizedCourts

    return res.json(company);
  }

  async update(req, res) {
    const { name, description, cnpj, address, phone } = req.body;
    const { id } = req.params;
    const { userId } = req;

    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      cnpj: Yup.string(),
      address: Yup.string(),
      phone: Yup.string()
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [companyExists] = await knex('company')
      .select('company.*')
      .where({ 'company.id': id });

    if (!companyExists) {
      return res.status(404).json({ error: 'Company does not exist' });
    }

    if (companyExists.user_id !== userId) {
      return res.status(403).json({ message: 'You can not do this operation'});
    }

    const company = {
      name,
      description,
      cnpj,
      address,
      phone,
      user_id: userId,
      created_at: companyExists.created_at,
      updated_at: new Date()
    };

    await knex('company').update(company).where({ id });

    return res.json({
      id,
      ...company,
    });
  }

  async list(req, res) {
    const { sport, place } = req.query;

    const query = knex('company')
      .select('company.*');

    const companies = await query;

    const companyWithCourts = [];

    for (const company of companies) {
      const courts = await knex('courts')
        .select('courts.*')
        .where({ 'courts.company_id': company.id});

      for (const court of courts) {
        const [workingDays] = await knex('working-days')
        .select('working-days.*')
        .where({ 'working-days.court_id': court.id });

        court.workingDays = workingDays ? workingDays : null;

        const [businessHours] = await knex('business-hours')
          .select('business-hours.*')
          .where({ 'business-hours.court_id': court.id });

        court.businessHours = businessHours ? businessHours : null;

        const reservations = await knex('courts-reservations')
          .select('courts-reservations.*')
          .where({ 'courts-reservations.court_id': court.id });

        court.reservations = reservations;
      }
      
      company.courts = courts;

      companyWithCourts.push(company);
    }

    return res.json(companyWithCourts);
  }

  async listOne(req, res) {
    const { id } = req.params;

    const query = knex('company')
      .select('company.*')
      .where({ id });

    const companies = await query;

    const companyWithCourts = [];

    for (const company of companies) {
      const courts = await knex('courts')
        .select('courts.*')
        .where({ 'courts.company_id': company.id});

      for (const court of courts) {
        const [workingDays] = await knex('working-days')
        .select('working-days.*')
        .where({ 'working-days.court_id': court.id });

        court.workingDays = workingDays ? workingDays : null;

        const [businessHours] = await knex('business-hours')
          .select('business-hours.*')
          .where({ 'business-hours.court_id': court.id });

        court.businessHours = businessHours ? businessHours : null;

        const reservations = await knex('courts-reservations')
          .select('courts-reservations.*')
          .where({ 'courts-reservations.court_id': court.id });

        court.reservations = reservations;
      }
      
      company.courts = courts;

      companyWithCourts.push(company);
    }

    return res.json(companyWithCourts[0]);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const { userId } = req;

    const [company] = await knex('company')
      .select('company.*')
      .where({ id, user_id: userId });

    if (!company) { 
      return res.status(404).json({ message: 'Company does not exist'})
    }

    await knex('company').where({ id }).delete();

    return res.sendStatus(204);
  }
}

module.exports = new CompanyController();
