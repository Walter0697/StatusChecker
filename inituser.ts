const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const initUser = async () => {
    if (process.argv.length !== 4) {
        console.log('invalid argument size')
    }
    const password = process.argv[3]
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(password, salt)

    try {
        const newUser = await prisma.user.create({
            data: {
                username: process.argv[2],
                password: hash,
            },
        })
        console.log('successfully added user')
    } catch (e) {
        console.log('failed to add user')
        console.log(e)
    }
}

initUser()