const lora_packet = require("lora-packet");

const packet = lora_packet.fromWire(Buffer.from('QLsCAACAAQBj2At4l/efuOnEQyBtGTnH', 'base64'));
const NwkSKey = Buffer.from("2B7E151628AED2A6ABF7158809CF4F3C", "hex");
const AppSKey = Buffer.from("2B7E151628AED2A6ABF7158809CF4F3C", "hex");

console.log("Mensaje cifrado (base64)= 'QLsCAACAAQBj2At4l/efuOnEQyBtGTnH'");
console.log("Mensaje descifrado (hex)= '" + lora_packet.decrypt(packet, AppSKey, NwkSKey).toString("hex") + "'");
console.log("DevAddr: "+packet.DevAddr.toString("hex"));
console.log("Mensaje No.: "+packet.FCnt.toString("hex"));