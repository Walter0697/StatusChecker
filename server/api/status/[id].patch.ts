import prisma from "~~/lib/prisma"
import statuscheck from "~~/lib/statuscheck"

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
        const existingWebsite = await prisma.website.findFirst({
            where: {
                id: id,
            }
        })
    
        if (!existingWebsite) {
            event.res.statusCode = 404
            return {
                message: 'cannot find group'
            }
        }

        const statusResult = await statuscheck(existingWebsite.checkURL, existingWebsite.checkType, existingWebsite.checkObject, existingWebsite.checkKey)
    
        const updatedWebsite = await prisma.website.update({
            where: {
                id: id,
            }, 
            data: {
                success: statusResult.success,
                lastCheckTime: new Date(),
                respondCode: statusResult.respondCode.toString(),
                respondMessage: statusResult.respondMessage,
            }
        })

        return {
            updated: updatedWebsite,
        }
    } catch (e) {
        event.res.statusCode = 500
        return {
            message: e.message,
        }
    }
})