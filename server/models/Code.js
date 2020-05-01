const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let CodeModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const CodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  codeContent: {
    type: String,
    required: true,
    trim: false,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

CodeSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  codeContent: doc.codeContent,
});

CodeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return CodeModel.find(search).select('name codeContent').exec(callback);
};

CodeModel = mongoose.model('Code', CodeSchema);

module.exports.CodeModel = CodeModel;
module.exports.CodeSchema = CodeSchema;
