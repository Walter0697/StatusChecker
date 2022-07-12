import jwt from 'jsonwebtoken'
import prisma from "~~/lib/prisma"

export default defineEventHandler(async (event) => {
    const token = useCookie(event, 'jwt')
    if (token) {
        try {
            const result = jwt.verify(token, process.env.JWT_SECRET)
            if (result?.data) {
                const userInfo = result.data
                const userData = await prisma.user.findFirst({
                    where: {
                        id: userInfo.id,
                    }
                })
                if (userData.username === userInfo.username) {
                    // if equal, then verify successfully
                    event.context.auth = userData
                }
            }
        } catch (e) {
        }
    }
})