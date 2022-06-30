const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    // E-Mail obligatoire et unique exigé
    email: { type: String, required: true, unique: true },
    // Mot de passe obligatoire
    password: { type: String, required: true },
    admin : false
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);