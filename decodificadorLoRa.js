/**
 * IMPORTACIÓN DE BIBLIOTECAS
 */
const lora_packet = require("lora-packet"); // Decodificador LoRaWAN
const datagram = require("dgram"); // Servidor UDP

/**
 * CREACIÓN DE OBJETOS DE BIBLIOTECAS
 */
const udpServer = datagram.createSocket("udp4"); // Servidor UDP -> El servidor es el único que puede recibir mensajes
      udpServer.bind(1902);

/**
 * CONSTANTES GLOBALES
 */
const NwkSKey = Buffer.from("2B7E151628AED2A6ABF7158809CF4F3C", "hex");
const AppSKey = Buffer.from("2B7E151628AED2A6ABF7158809CF4F3C", "hex");

//-------------------------------------------------------------
// Función que se ejecuta al recibir un dato por UDP
//-------------------------------------------------------------
udpServer.on("message",(mensajeUDP,infoMensajeUDP)=>{
    // Ignora los mensajes de 12 Bytes. Es decir, los PULL_DATA
    if (mensajeUDP.length != 12) {
        // Filtra solo los mensajes "rxpx"
        if (mensajeUDP.toString().search("rxpk") != -1) {

            // ********************************
            // *** Extraccción datos Sensor ***
            // ********************************
            // Cortamos los primeros 12 bytes del payload y pasamos el resto a un objeto JSON
            var json = JSON.parse(mensajeUDP.slice(12,mensajeUDP.length).toString());
            // Extraemos la parte del Objeto JSON que correponde a los datos, es decir "data"
            var cifrado = json.rxpk[0].data;
            var cifradoBuffer = Buffer.from(cifrado, 'base64');

            // **************************
            // *** DECIFRADO DE DATOS ***
            // **************************
            const paqueteLoRa = lora_packet.fromWire(cifradoBuffer);
            const descifrado = lora_packet.decrypt(paqueteLoRa, AppSKey, NwkSKey).toString("hex");

            // Impresión en consola
            console.log("Mensaje cifrado (base64)= '" + cifrado + "'");
            console.log("Mensaje descifrado (hex)= '" + descifrado + "'");
            console.log("DevAddr: "+paqueteLoRa.DevAddr.toString("hex"));
            console.log("Mensaje No.: "+paqueteLoRa.FCnt.toString("hex"));
        }
    }
});