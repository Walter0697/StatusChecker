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

    const body = await useBody(event)

    try {
        const existingWebsite = await prisma.group.findFirst({
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

        const statusResult = await statuscheck(body.checkURL, body.checkType, body.checkObject, body.checkKey)
    
        const updatedWebsite = await prisma.website.update({
            where: {
                id: id,
            }, 
            data: {
                label: body.label,
                checkURL: body.checkURL,
                checkKey: body.checkKey,
                checkObject: body.checkObject,
                checkType: body.checkType,
                groupId: body.groupId,
                success: statusResult.success,
                lastCheckTime: new Date(),
                respondCode: statusResult.respondCode.toString(),
                respondMessage: statusResult.respondMessage,
                enabled: body.enabled,
                updatedBy: event.context.auth.id,
                updatedAt: new Date(),
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