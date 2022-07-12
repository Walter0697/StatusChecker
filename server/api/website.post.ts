import prisma from "~~/lib/prisma"

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

    let respondCode = null
    let respondMessage = null
    let success = true

    try {
        const result = await $fetch(body.checkURL)
        respondCode = 200
        respondMessage = result

        let checkTarget = result
        if (body.checkKey) {
            const jsonContent = JSON.parse(checkTarget)
            checkTarget = jsonContent[body.checkKey]
        }

        if (body.checkType === 'startwith') {
            if (checkTarget.startsWith(body.checkObject)) {
                success = true
            } else {
                success = false
            }
        } else if (body.checkType === 'equalexact') {
            if (checkTarget === body.checkObject) {
                success = true
            } else {
                success = false
            }
        } else if (body.checkType === 'statuscode') {
            success = true
        }
    } catch (e) {
        success = false
        respondCode = 500
        respondMessage = e.message
    }

    try {
        const newWebsite = await prisma.website.create({
            data: {
                label: body.label,
                checkURL: body.checkURL,
                checkKey: body.checkKey,
                checkObject: body.checkObject,
                checkType: body.checkType,
                groupId: body.groupId,
                success: success,
                lastCheckTime: new Date(),
                respondCode: respondCode.toString(),
                respondMessage: respondMessage,
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