
import user from "../models/user.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {

    const { username, email, password } = req.body

    const isValidUser = await user.findOne({ email })

    if (isValidUser) {

        return next(errorHandler(404, "User already Exist"))

    }
    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new user({
        username,
        email,
        password: hashedPassword
    })
    try {
        await newUser.save()
        res.status(201).json({
            success: true,
            message: "User Created Successfully"
        })

    } catch (error) {
        next(error)

    }
}

export const signin = async (req, res, next) => {

    const { email, password } = req.body

    try {
        const ValidUser = await user.findOne({ email })

        if (!ValidUser) {
            return next(errorHandler(404, "user not found"))
        }
        const validPassword = bcryptjs.compareSync(password, ValidUser.password)

        if (!validPassword) {

            return next(errorHandler(401, "wrong credentials"))
        }

        const token = jwt.sign({ id: ValidUser._id }, process.env.JWT_SECRET)

        const { password: pass, ...rest } = ValidUser._doc

        res.cookie("access_token", token, { httpOnly: true }).status(200).json({
            success: true,
            message: "Login Successfull",
            rest,
        })

    } catch (error) {
        next(error)
    }
}

export const signout = async (req, res, next) => {
    try {

        res.clearCookie("access_token")

        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        })
    } catch (error) {
        next(error)
    }
}