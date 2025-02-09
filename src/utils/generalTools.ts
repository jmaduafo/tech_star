export function time() {
    const now = new Date()
    let time = ""

    time += now.getHours() + ":" + now.getMinutes()

    return time
}