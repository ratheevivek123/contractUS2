import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  phone: {
    type: String,
    unique: true,
    sparse: true, // 🔥 allows multiple nulls
    validate: {
      validator: v => !v || /^[6-9]\d{9}$/.test(v),
      message: props => `${props.value} is not a valid phone number!`,
    },
  },

  password: {
    type: String,
    required: function () {
      return !this.isGoogleUser; // 🔥 only required for normal users
    },
    minlength: 6,
  },

  address: {
    type: String,
  },

  pincode: {
    type: String,
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },

  isGoogleUser: {
    type: Boolean,
    default: false,
  },

  profileCompleted: {
    type: Boolean,
    default: false,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
