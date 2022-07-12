import prisma from "~~/lib/prisma"

export default defineEventHandler(async (event) => {
    if (!event?.context?.auth) {
        event.res.statusCode = 401
        return {
            message: 'unauthorized'
        }
    }

    const websites = await prisma.website.findMany({
        where: {
            deletedAt: null,
        }
    })

    return {
        websites,
    }
})