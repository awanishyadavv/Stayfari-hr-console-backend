import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  purpose: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  currentCompany: {
    type: String,
    required: false,
  },
  profileLink: {
    type: String,
    required: true,
  },
  experience: {
    type: [experienceSchema],
    required: false,
  },
});

const ExtensionData_2 = mongoose.model('ExtensionData_2', userSchema);

export default ExtensionData_2;
