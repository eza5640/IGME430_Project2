const models = require('../models');

const Code = models.Code;

const makerPage = (req, res) => {
  Code.CodeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), code: docs });
  });
};

const makeCode = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Names required' });
  }

  if(!req.body.codeContent) {
    return res.status(400).json({ error: 'No code implemented'});
  }
  const codeData = {
    name: req.body.name,
    codeContent: req.body.codeContent,
    owner: req.session.account._id,
  };

  const newCode = new Code.CodeModel(codeData);

  const codePromise = newCode.save();
  codePromise.then(() => res.json({ redirect: '/maker' }));
  codePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Name already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return codePromise;
};

const getCode = (request, response) => {
  const req = request;
  const res = response;

  return Code.CodeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ code: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getCode = getCode;
module.exports.make = makeCode;
