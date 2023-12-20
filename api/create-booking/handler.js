module.exports.create = async event => {
    console.log('cheguei')
    return {
        statusCode: 200,
        body: JSON.stringify(event),
    }
}