const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const app = express()

app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth()
});

app.get('/getProfilePicture', async (req, res) => {
    let { phoneNumber } = req.body;
    phoneNumber = '972506680152'
    console.log('FIRST phoneNumber', phoneNumber)
    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    // Remove spaces and handle '+' for international numbers
    phoneNumber = phoneNumber.replace(/\s+/g, '').replace('+', '');
    console.log('SECOND phoneNumber', phoneNumber)
    try {
        // Format the phone number to WhatsApp format (e.g., with country code and no special characters)
        const chatId = `${phoneNumber}@c.us`;
        console.log('THIRD phoneNumber', phoneNumber)
        

        // Get the profile picture URL
        const profilePicUrl = await client.getProfilePicUrl(chatId);

        if (profilePicUrl) {
            res.json({ phoneNumber, profilePicUrl });
        } else {
            res.status(404).json({ message: 'No profile picture found for this number' });
        }
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        res.status(500).json({ error: 'Failed to get profile picture' });
    }
});

client.on('qr', (qr) => {
    // Generate and display this QR code in the terminal
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Client is ready!');


    // const contacts = await client.getContacts();

   
    // for (const contact of contacts) {
    //     try {
    //         const profilePicUrl = await client.getProfilePicUrl(contact.id._serialized);
    //         if (profilePicUrl) {
    //             console.log(`Profile picture of ${contact.pushname || contact.number}: ${profilePicUrl}`);
    //         } else {
    //             console.log(`No profile picture found for ${contact.pushname || contact.number}`);
    //         }
    //     } catch (error) {
    //         console.error(`Error fetching profile picture for ${contact.pushname || contact.number}:`, error);
    //     }
    // }
});




client.on('message',async  msg => {
    if (msg.body === 'מי המלכה') {
        msg.reply('חלי');
    }
});

client.initialize();

const PORT = process.env.PORT || 4000; // Change to another port if needed
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});