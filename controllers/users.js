const {
    User,
    validateUser
} = require("./../models/users.model");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const response = require("./../utils/response");
const CustomError = require("./../utils/CustomError");
const jwtSecret = process.env.JWT_SECRET;
const Joi = require("@hapi/joi")
// const validate = require("./../utils/validate");

/**
 * Controllers for :
 *
 * signup
 */

class UserContoller {

    constructor(){
        this.validateLogin = this.validateLogin.bind(this)
        this.authenticate = this.authenticate.bind(this)
    }

    // user signup
    async signUp(req, res) {
        // validate user

        console.log(req.body)
        const {
            error
        } = validateUser(req.body);
        if (error) throw new CustomError(error.details[0].message)
        let {
            email,
            fullName,
            password
        } = req.body;
        fullName = fullName.trim()
        // Check user email exist 
        if (await User.findOne({
                email
            })) throw new CustomError("Email already exists");

        let user = new User({ email, fullName, password })

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)
        user.password = hash;

        user.save(user)

        const token = jwt.sign({
            id: user._id
        }, jwtSecret, {
            expiresIn: 36000
        })

        const data = {
            token,
            uid: user.id,
            fullName: user.fullName,
            email: user.email,
        }

        res.status(201).json(response("User created", data, true))
    }


    async authenticate(req, res) {
        const {
            error
        } = this.validateLogin(req.body);
        if (error) throw new CustomError(error.details[0].message);

        const user = await User.findOne({
            email: req.body.email
        });
        if (!user) throw new CustomError("Incorrect email or password");
        const isCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isCorrect) throw new CustomError("Incorrect email or password");

        const token = jwt.sign({
            id: user._id
        }, jwtSecret, {
            expiresIn: 36000
        })

        const data = {
            uid: user._id,
            email: user.email,
            role: user.role,
            token
        };

        res.status(200).json(response("User", data, true))
    }

    async updateConfig(req, res) {
        console.log(req.body)
        const user = await User.findByIdAndUpdate({
            _id: req.user._id
        }, {
            "$set": {
                config: req.body
            }
        }, {
            new: true,
        });

        if (!user) throw new CustomError("user dosen't exist", 404);

        res.status(200).send(response("Configuration updated", user.config, true, req, res));
    }

    validateLogin(req) {
        const schema = Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().required()
        });

        return schema.validate(req);
    }
}

module.exports = new UserContoller();