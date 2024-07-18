exports.searchParams = () => (req, res, next) => {
    const { query } = req

    for (const [k, v] of Object.entries(query)) {
        if (/".+=.+"/.test(v)) {
            query[k] = parse(v)
        }
    }

    next()
}

function parse(param) {
    return Object.fromEntries(param.split(/(?=&[^"]*=)&/gm).map(q => {
        let [k, v] = JSON.parse(q).split('=')

        if (!isNaN(v)) v = Number(v)

        return [k, v]
    }))
}