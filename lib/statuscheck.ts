const statuscheck = async (url, checkType, checkObject, checkKey) => {
    let respondCode = null
    let respondMessage = null
    let success = true

    try {
        const result = await $fetch(url)
        respondCode = 200
        respondMessage = result
        let checkTarget = result
        if (checkKey) {
            try {
                const jsonContent = JSON.parse(checkTarget)
                checkTarget = jsonContent
            } catch (e) {

            }
            checkTarget = checkTarget[checkKey]
        }
        switch (checkType) {
            case 'startwith': {
                if (checkTarget.startsWith(checkObject)) {
                    success = true
                } else {
                    success = false
                }
                break
            }
            case 'equalexact': {
                if (checkTarget === checkObject) {
                    success = true
                } else {
                    success = false
                }
                break
            }
            case 'statuscode': {
                success = true
                break
            }
        }
    } catch (e) {
        success = false
        respondCode = 500
        respondMessage = e.message
    }

    try {
        const stringifyMsg = JSON.stringify(respondMessage)
        respondMessage = stringifyMsg
    } catch (e) {

    }

    return {
        success,
        respondCode,
        respondMessage,
    }
}

export default statuscheck