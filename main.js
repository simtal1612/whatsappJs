const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});


client.on('qr', (qr) => {
    // Generate and display this QR code in the terminal
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Client is ready!');


    const contacts = await client.getContacts();

   
    for (const contact of contacts) {
        try {
            const profilePicUrl = await client.getProfilePicUrl(contact.id._serialized);
            if (profilePicUrl) {
                console.log(`Profile picture of ${contact.pushname || contact.number}: ${profilePicUrl}`);
            } else {
                console.log(`No profile picture found for ${contact.pushname || contact.number}`);
            }
        } catch (error) {
            console.error(`Error fetching profile picture for ${contact.pushname || contact.number}:`, error);
        }
    }
});




client.on('message',async  msg => {
    if (msg.body === 'מי המלכה') {
        msg.reply('חלי');
    }
});

client.initialize();