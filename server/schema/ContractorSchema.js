import mongoose from "mongoose";

const contractorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, // 🔥 allow null for google users
      validate: {
        validator: (v) => !v || /^[6-9]\d{9}$/.test(v),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },

    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser; // 🔥 only normal login needs password
      },
      minlength: 6,
    },

    address: { type: String },
    pincode: { type: String },

    profession: {
      type: String,
      enum: [
        "Contractor",
        "Material Supplier",
        "Plumber",
        "Electrician",
        "Painter",
        "Mason",
        "Labour",
        "Interior Designer",
        "Architect",
      ],
    },

    experienceLevel: {
      type: String,
      enum: ["Fresher", "Some Experience"],
    },

    rate: {
      type: Number,
      default: 500,
    },

    skills: [
      {
        name: { type: String },
        rate: { type: Number, default: 500 },
      },
    ],

    bio: { type: String, trim: true, default: "" },
    rating: { type: Number, default: 0 },

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

    isLocationSet: {
      type: Boolean,
      default: false,
    },

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { timestamps: true }
);

contractorSchema.index({ location: "2dsphere" });

const Contractor =
  mongoose.models.Contractor ||
  mongoose.model("Contractor", contractorSchema);

export default Contractor;
