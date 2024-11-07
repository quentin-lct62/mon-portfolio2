const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Middleware CORS
require('dotenv').config(); // Pour charger les variables d'environnement

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;
    console.log('Received:', { name, email, message });

    // Configurer Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: email, // Utiliser l'email de l'utilisateur
        to: process.env.EMAIL_USER, // Votre adresse e-mail pour recevoir le message
        subject: `Nouveau message de ${name}`,
        text: message,
        replyTo: email, // Ajoutez cette ligne pour permettre des réponses à l'expéditeur
    };

    // Envoi de l'email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de l\'email' });
        }
        res.status(200).json({ success: true, message: 'Email envoyé avec succès' });
    });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
