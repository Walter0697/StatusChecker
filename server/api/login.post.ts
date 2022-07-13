import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import prisma from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
    const body = await useBody(event)

    const existing = await prisma.user.findFirst({
        where: {
            username: body.username
        }
    })

    if (!existing) {
        event.res.statusCode = 401
        return {
            message: 'unauthorized'
        }
    }

    const correct_password = await bcryptjs.compare(body.password, existing.password)
    if (!correct_password) {
        event.res.statusCode = 401
        return {
            message: 'unauthorized'
        }
    }

    // one day expiration
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
        data: {
            username: existing.username,
            id: existing.id,
        }
    }, process.env.JWT_SECRET)

    return {
        token,
    }
})