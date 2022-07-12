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
    if (!body.color) {
        requiring.push('color')
    }
    if (!body.displayOrder) {
        requiring.push('displayOrder')
    }

    if (requiring.length !== 0) {
        event.res.statusCode = 400
        return {
            message: 'the following data is required: ' + requiring.join(','),
        }
    }

    try {
        const newGroup = await prisma.group.create({
            data: {
                label: body.label,
                color: body.color,
                displayOrder: body.displayOrder,
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