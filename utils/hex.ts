export function generateHexDump(): string {
    const chars = '0123456789ABCDEF'
    let dump = ''
    for (let i = 0; i < 8; i++) {
        dump += chars[Math.floor(Math.random() * 16)]
    }
    return `0x${dump}`
}

export function generateDataBlock(): string {
    let block = ''
    for (let i = 0; i < 4; i++) {
        block += generateHexDump().split('x')[1] + ' '
    }
    return block.trim()
}
