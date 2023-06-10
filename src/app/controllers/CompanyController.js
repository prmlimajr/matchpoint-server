const Yup = require('yup');
const { v4: uuidV4 } = require('uuid');
const fs = require('fs');
const knex = require('../../database/knex');
const calculateDistance = require('../../utils/calculateDistance');

const convertToBase64 = (img) => {
  const base64 = new Buffer(fs.readFileSync(img[0].path)).toString('base64');
      
  return `data:image/png;base64,${base64}`;
}

class CompanyController {
  async store(req, res) {
    const { name, addresses, cellphone, phone, bio, facebook, instagram, description, questionsAndAnswers, history, courts } = req.body;
    const { files } = req;

    const { logo, firstPicture, secondPicture, thirdPicture } = files
    
    const base64Logo = logo ? convertToBase64(logo) : ''
    const base64FirstPicture = firstPicture ? convertToBase64(firstPicture) : ''
    const base64SecondPicture = secondPicture ? convertToBase64(secondPicture) : ''
    const base64ThirdPicture = thirdPicture ? convertToBase64(thirdPicture) : ''

    const company_id = uuidV4();

    const company = {
      id: company_id,
      logo: base64Logo,
      firstPicture: base64FirstPicture,
      secondPicture: base64SecondPicture,
      thirdPicture: base64ThirdPicture,
      name,
      cellphone,
      phone,
      bio, 
      facebook, 
      instagram, 
      description,
      history, 
      vip: false, 
      premium: false,
    };

    await knex('company').insert(company, 'id');

    const normalizedAddresses = JSON.parse(addresses);

    for (const ad of [...new Set(normalizedAddresses)]) {
      const insertedAddress = {
        id: uuidV4(),
        company_id,
        address: ad.address,
        lat: ad.lat,
        lng: ad.lng
      }

      await knex('address').insert(insertedAddress)
    }

    const normalizedQuestionsAndAnswers = JSON.parse(questionsAndAnswers)

    for (const qa of normalizedQuestionsAndAnswers) {
      const question = {
        id: uuidV4(),
        company_id,
        question: qa.question,
        answer: qa.answer
      }

      await knex('questions').insert(question)
    }

    const normalizedCourts = JSON.parse(courts);

    for (let i = 0; i < normalizedCourts.length; i++) {
      const court_id = uuidV4();

      const insertedCourt = {
        id: court_id,
        company_id,
        address: normalizedCourts[i].address,
        lat: normalizedCourts[i].lat,
        lng: normalizedCourts[i].lng,
        is_indoor: normalizedCourts[i].isIndoor
      }

      await knex('courts').insert(insertedCourt);

      for (const sport of normalizedCourts[i].sports) {
        const sport_id = uuidV4();

        const insertedSport = {
          id: sport_id,
          court_id,
          sport,
        }

        await knex('courts_sports').insert(insertedSport);
      }

      const courtPictureBase64 = files[`courtPicture${i}`] ?  convertToBase64(files[`courtPicture${i}`]) : ''

      if (courtPictureBase64) {
        const picture = {
          id: uuidV4(),
          court_id,
          url: courtPictureBase64,
        }

        await knex('courts-photos').insert(picture);

        normalizedCourts[i].picture = picture
      }
    }

    company.questionsAndAnswers = normalizedQuestionsAndAnswers;
    company.courts = normalizedCourts;
    company.address = normalizedAddresses;

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
    const { sport, lat, lng } = req.query;

    const query = knex('company')
      .select('company.*');

    const companies = await query;

    const companyWithCourts = [];

    for (const company of companies) {
      const addresses = await knex('address')
        .select('address.*')
        .where({ 'address.company_id': company.id });

      company.addresses = addresses;
      
      const courts = await knex('courts')
        .select('courts.*')
        .where({ 'courts.company_id': company.id});

      const courtsWithSports = [];

      for (const court of courts) {
        const sports = await knex('courts_sports')
          .select('courts_sports.*')
          .where({ 'courts_sports.court_id': court.id});

        court.sports = sports;

        court.is_indoor = !!court.is_indoor;
        court.has_classes = !!court.has_classes;

        courtsWithSports.push(court);
      }

      company.courts = courtsWithSports;

      company.photos = [];

      if (company.firstPicture) {
        company.photos.push(company.firstPicture);
      }

      if (company.secondPicture) {
        company.photos.push(company.secondPicture);
      }

      if (company.thirdPicture) {
        company.photos.push(company.thirdPicture);
      }


      company.vip = !!company.vip
      company.premium = !!company.premium

      delete company.firstPicture;
      delete company.secondPicture;
      delete company.thirdPicture;

      companyWithCourts.push(company);
    }

    const companiesWithFullData = companyWithCourts.map(company => {
      company.distanceToOrigin = Infinity;
      company.matchesSportQuery = false;

      company.addresses.forEach(address => {
        const distanceToOrigin = calculateDistance({ lat, lng }, { lat: address.lat, lng: address.lng });

        if (distanceToOrigin < company.distanceToOrigin) {
          company.distanceToOrigin = distanceToOrigin;
        }
      });

      company.courts.forEach(court => {
        court.sports.forEach(sportInCourt => {
          if (sportInCourt.sport === sport) {
            company.matchesSportQuery = true;
          }
        });
      });

      return company
    });
    
    const companiesWithSportMatch = [];
    const companiesWithoutSportMatch = [];

    companiesWithFullData.forEach(company => {
      if (company.matchesSportQuery) {
        companiesWithSportMatch.push(company);
      } else {
        companiesWithoutSportMatch.push(company);
      }
    });

    const sortedCompaniesWithSportMatch = companiesWithSportMatch.sort((a, b) => a.distanceToOrigin - b.distanceToOrigin);
    const sortedCompaniesWithoutSportMatch = companiesWithoutSportMatch.sort((a, b) => a.distanceToOrigin - b.distanceToOrigin);

    return res.json([
      ...sortedCompaniesWithSportMatch,
      ...sortedCompaniesWithoutSportMatch
    ]);
  }

  async listOne(req, res) {
    const { id } = req.params;

    const [company] = await knex('company')
      .select('company.*')
      .where({ 'company.id': id});

    if (!company) {
      return res.status(404).json({ message: 'This company does not exist' });
    }

    const questions = await knex('questions')
      .select('questions.*')
      .where({ 'questions.company_id': company.id });

    company.questionsAndAnswers = questions;

    const addresses = await knex('address')
      .select('address.*')
      .where({ 'address.company_id': company.id });

    company.addresses = addresses;
    
    const courts = await knex('courts')
      .select('courts.*')
      .where({ 'courts.company_id': company.id});

    const courtsWithSports = [];

    for (const court of courts) {
      const sports = await knex('courts_sports')
        .select('courts_sports.*')
        .where({ 'courts_sports.court_id': court.id});

      court.sports = sports;

      court.is_indoor = !!court.is_indoor;
      court.has_classes = !!court.has_classes;

      courtsWithSports.push(court);
    }

    company.courts = courtsWithSports;

    company.photos = [];

    if (company.firstPicture) {
      company.photos.push(company.firstPicture);
    }

    if (company.secondPicture) {
      company.photos.push(company.secondPicture);
    }

    if (company.thirdPicture) {
      company.photos.push(company.thirdPicture);
    }

    company.vip = !!company.vip
    company.premium = !!company.premium

    delete company.firstPicture;
    delete company.secondPicture;
    delete company.thirdPicture;
    
    return res.json(company);
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
