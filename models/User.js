const { Schema, model } = require('mongoose');

// User Schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
			unique: true,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
			unique: true,
      match: [/.+\@.+\..+/]
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    }],
  friends: [{
      type: Schema.Types.ObjectId,
			ref: 'User'
  }]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// Get total number of user friends on retrieval
UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// create the User model using the UserSchema
const User = model('User', UserSchema);

// export the User model
module.exports = User;