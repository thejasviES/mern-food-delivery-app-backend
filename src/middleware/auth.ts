import { auth } from 'express-oauth2-jwt-bearer'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user'

declare global {
    namespace Express {
        interface Request {
            auth0Id: string
            userId: string
        }
    }
}

//this is the middleware that will check the jwt token that is sent by the frontend
//this will check the jwt token and verify it
//this will check the audience and issuer of the jwt token
//this will check the token signing algorithm
//this will check the jwt token expiry
export const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256',
})

export const jwtParse = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { authorization } = req.headers

    if (!authorization || !authorization.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = authorization.split(' ')[1]
    try {
        const decoded = jwt.decode(token) as jwt.JwtPayload
        const auth0Id = decoded?.sub
        const user = await User.findOne({ auth0Id })
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        req.auth0Id = auth0Id as string
        req.userId = user._id.toString()

        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: 'Unauthorized' })
    }
}
