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

    const websites = await prisma.website.findMany({
        where: {
            deletedAt: null,
        }
    })

    let statusObject = []
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i]
        const groupedWebsite = websites.filter(s => s.groupId === group.id)
        let websiteList = []
        for (let j = 0; j < groupedWebsite.length; j++) {
            const website = groupedWebsite[j]
            if (website.enabled) {
                websiteList.push({
                    id: website.id,
                    label: website.label,
                    success: website.success,
                    lastCheckTime: website.lastCheckTime,
                    respondCode: website.respondCode,
                    respondMessage: website.respondMessage,
                })
            }
        }
        
        statusObject.push({
            group: group,
            websites: websiteList,
        })
    }

    return {
        statusObject,
    }
})