import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../schema/userSchema.js";
import Contractor from "../schema/contractorSchema.js";
import dotenv from "dotenv";

dotenv.config();
console.log("passport config file loaded");

// helper to register safely
const safeRegister = (name, clientID, clientSecret, callbackURL, verify) => {
  if (!clientID || !clientSecret || !callbackURL) {
    console.warn(
      `[passport] skipping "${name}" strategy — missing env: clientID/clientSecret/callbackURL`
    );
    return;
  }
  passport.use(name, new GoogleStrategy({ clientID, clientSecret, callbackURL }, verify));
};

/* ================= USER GOOGLE ================= */
safeRegister(
  "google-user",
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL,
  async (_, __, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName;
      if (!email) return done(new Error("Google profile missing email"), null);

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name,
          email,
          isGoogleUser: true,
          profileCompleted: false,
        });
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
);

/* ================= CONTRACTOR GOOGLE ================= */
safeRegister(
  "google-contractor",
  process.env.CONTRACTOR_GOOGLE_CLIENT_ID,
  process.env.CONTRACTOR_GOOGLE_CLIENT_SECRET,
  process.env.CONTRACTOR_GOOGLE_CALLBACK,
  async (_, __, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName;
      if (!email) return done(new Error("Google profile missing email"), null);

      let contractor = await Contractor.findOne({ email });
      if (!contractor) {
        contractor = await Contractor.create({
          name,
          email,
          isGoogleUser: true,
          profileCompleted: false,
          isBlocked: false,
        });
      }
      done(null, contractor);
    } catch (err) {
      done(err, null);
    }
  }
);

console.log("Registered strategies:", Object.keys(passport._strategies || {}));

export default passport;







