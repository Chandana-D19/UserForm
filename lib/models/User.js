// // lib/models/User.js
// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     unique: true,
//   },
// });

// export default mongoose.models.User || mongoose.model('User', UserSchema);

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
