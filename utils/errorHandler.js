module.exports = (res, error) => {
    res.status().json({
        success: false,
        message: error.message ? error.message : error
    })
}