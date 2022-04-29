import "@johnlindquist/kit"
    
// Menu: My IP
// Description: Displays and copies IP to cliboard
// Author: John Lindquist
// Twitter: @johnlindquist

let network = await npm("network")
let { promisify } = await npm("es6-promisify")

let ip = await promisify(network.get_public_ip)()

copy(ip)
await arg(ip)
