const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/Users')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')


module.exports.login = async function(req, res) {
	const candidate = await User.findOne({email: req.body.email})

	if (candidate) {
		const isPasswordMatch = bcrypt.compareSync(req.body.password, candidate.password)
		if (isPasswordMatch) {
			const token = jwt.sign({
				email: candidate.email,
				userId: candidate._id
			}, keys.jwt, {expiresIn: 60*60})

			res.status(200).json({
				token: `Bearer ${token}`
			})
		} else {
			res.status(401).json({
				 message: 'Login or password is wrong.'
			})
		}
	} else {
		res.status(404).json({
			message: 'User with such email is not found.'
		})
	}
}
  
  
module.exports.register = async function(req, res) {
	const candidate = await User.findOne({email: req.body.email})

	if (candidate) {
		res.status(409).json({
			message: 'This email is under use. Try another one.'
		})
	} else {
		const salt = bcrypt.genSaltSync(10)
		const password = req.body.password

		const user = new User({
			email: req.body.email,
			password: bcrypt.hashSync(password, salt)
		})

		try {
			await user.save()
			res.status(201).json(user)
		} catch (error) {
			errorHandler(res, e)
		}
	}
}