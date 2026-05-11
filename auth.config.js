const passport = require('passport');
const authService = require('./services/auth.service');

// OAuth strategies disabled for local testing.
// Uncomment these imports and strategy definitions when enabling Google/Apple auth.
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const AppleStrategy = require('passport-apple');
//
// const applePrivateKey = process.env.APPLE_PRIVATE_KEY
//   ? process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n')
//   : undefined;
//
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
//         const user = await authService.handleSocialLogin({
//           provider: 'google',
//           providerId: profile.id,
//           email,
//           name: profile.displayName
//         });
//         done(null, user);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );
//
// passport.use(
//   new AppleStrategy(
//     {
//       clientID: process.env.APPLE_CLIENT_ID,
//       teamID: process.env.APPLE_TEAM_ID,
//       keyID: process.env.APPLE_KEY_ID,
//       privateKey: applePrivateKey,
//       callbackURL: process.env.APPLE_CALLBACK_URL || '/api/auth/apple/callback',
//       scope: ['name', 'email']
//     },
//     async (accessToken, refreshToken, idToken, profile, done) => {
//       try {
//         const email = profile && profile.email ? profile.email : null;
//         const name = profile && profile.name
//           ? `${profile.name.firstName || ''} ${profile.name.lastName || ''}`.trim()
//           : null;
//         const user = await authService.handleSocialLogin({
//           provider: 'apple',
//           providerId: profile ? profile.id : null,
//           email,
//           name
//         });
//         done(null, user);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );

module.exports = passport;
