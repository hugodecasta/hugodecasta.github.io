export function group_by(data, column) {
    const uniqs = data.map(l => l[column]).filter((e, i, s) => s.indexOf(e) == i)
    return Object.fromEntries(
        uniqs.map(u => [
            u,
            data.filter(l => l[column] == u)
        ]).sort((a, b) => b[1].length - a[1].length)
    )
}

export function group_cascade(data, cascade) {
    if (cascade.length == 0) return data
    const local_cascade = [...cascade]
    const by = local_cascade.shift()
    const final_data = group_by(data, by)
    for (const id in final_data) {
        final_data[id] = group_cascade(final_data[id], local_cascade)
    }
    return final_data
}