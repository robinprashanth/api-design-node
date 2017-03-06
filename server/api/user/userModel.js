var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  // dont store the password as plain text
  password: {
    type: String,
    required: true
  },
  email: String,
  firstName: String,
  lastName: String,
  provider: String,
  facebook: {},
  twitter: {},
  github: {},
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  followers: [{type: Schema.ObjectId, ref: 'user'}],
  following: [{type: Schema.ObjectId, ref: 'user'}],
  tweets: Number,
  active: { type: Boolean, default: true}
});

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.password = this.encryptPassword(this.password);
  next();
})

UserSchema.methods = {
  // check the passwords on signin
  authenticate: function(plainTextPword) {
    return bcrypt.compareSync(plainTextPword, this.password);
  },
  // hash the passwords
  encryptPassword: function(plainTextPword) {
    if (!plainTextPword) {
      return ''
    } else {
      var salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(plainTextPword, salt);
    }
  },

  toJson: function() {
    var obj = this.toObject()
    delete obj.password;
    return obj;
  },
  follow: function(id) {
    if (this.following.indexOf(id) === -1) {
      this.following.push(id);
    } else {
      this.following.splice(this.following.indexOf(id), 1);
    }
    console.log(this.following);
  },
};


module.exports = mongoose.model('user', UserSchema);
