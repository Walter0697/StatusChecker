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

    const body = await useBody(event)

    try {
        const existingGroup = await prisma.group.findFirst({
            where: {
                id: id,
            }
        })
    
        if (!existingGroup) {
            event.res.statusCode = 404
            return {
                message: 'cannot find group'
            }
        }
    
        const updatedGroup = await prisma.group.update({
            where: {
                id: id,
            }, 
            data: {
                label: body.label,
                color: body.color,
                displayOrder: body.displayOrder,
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