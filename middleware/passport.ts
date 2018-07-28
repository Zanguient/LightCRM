import {ExtractJwt, Strategy as JwtStrategy} from "passport-jwt";
import mongoose from "mongoose";
import keys from "../config/keys";
const User = mongoose.model('users');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt
};

function passportInit(passport: any) {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId).select('email id');

                if (user) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            } catch (error) {
                console.error(error)
            }
        })
    )
}

export default {passportInit};


