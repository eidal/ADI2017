module.exports.procesarPaginacion = function(page){
    page = page - 1
    page = (page && page > 0) ? page : 0
    return page
}