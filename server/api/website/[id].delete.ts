import prisma from "~~/lib/prisma"

export default defineEventHandler(async (event) => {
    if (!event?.context?.auth) {
        event.res.statusCode = 401
        return {
            message: 'unauthorized'
        }
    }

    const id = parseInt(event.context.params.id)
    if (!id) {
        event.res.statusCode = 400
        return {
            message: 'id should be an int'
        }
    }

    try {
        const deletingWebsite = await prisma.website.findFirst({
            where: {
                id: id,
            }
        })
    
        if (!deletingWebsite) {
            event.res.statusCode = 404
            return {
                message: 'cannot find website'
            }
        }
    
        const deletedWebsite = await prisma.website.update({
            where: {
                id: id,
            },
            data: {
                deletedBy: event.context.auth.id,
                deletedAt: new Date(),
            }
        })

        return {
            message: 'ok'
        }
    } catch (e) {
        event.res.statusCode = 500
        return {
            message: e.message,
        }
    }
})