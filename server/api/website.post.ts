import prisma from "~~/lib/prisma"
import statuscheck from "~~/lib/statuscheck"

export default defineEventHandler(async (event) => {
    if (!event?.context?.auth) {
        event.res.statusCode = 401
        return {
            message: 'unauthorized'
        }
    }

    const body = await useBody(event)
    let requiring = []
    if (!body.label) {
        requiring.push('label')
    }
    if (!body.checkURL) {
        requiring.push('check URL')
    }
    if (!body.checkType) {
        requiring.push('check type')
    }
    if (!body.groupId) {
        requiring.push('group')
    }

    if (requiring.length !== 0) {
        event.res.statusCode = 400
        return {
            message: 'the following data is required: ' + requiring.join(','),
        }
    }

    const statusResult = await statuscheck(body.checkURL, body.checkType, body.checkObject, body.checkKey)

    try {
        const newWebsite = await prisma.website.create({
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
                createdBy: event.context.auth.id,
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