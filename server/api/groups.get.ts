import prisma from "~~/lib/prisma"

export default defineEventHandler(async (event) => {
    if (!event?.context?.auth) {
        event.res.statusCode = 401
        return {
            message: 'unauthorized'
        }
    }

    const groups = await prisma.group.findMany({
        where: {
            deletedAt: null,
        }
    })

    return {
        groups,
    }
})