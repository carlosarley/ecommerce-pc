const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ruta para crear una transacción con PSE
app.post('/api/create-transaction', async (req, res) => {
    const { amountInCents, customerEmail, redirectUrl, financialInstitutionCode } = req.body;
  
    try {
      const response = await axios.post('https://sandbox.wompi.co/v1/transactions', {
        amount_in_cents: amountInCents,
        currency: 'COP',
        customer_email: customerEmail,
        payment_method: {
          type: 'PSE',
          user_type: 0, // Persona natural
          financial_institution_code: String(financialInstitutionCode), // Asegurarse de que sea una cadena
          payment_description: 'Compra en PC Parts Store',
        },
        reference: `ORDER_${Date.now()}`,
        redirect_url: redirectUrl,
      }, {
        headers: {
          Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
        },
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error al crear la transacción:', error.response?.data || error.message);
      res.status(500).json({
        error: 'Error al crear la transacción',
        details: error.response?.data || error.message,
      });
    }
  });

// Ruta para obtener los bancos disponibles para PSE
app.get('/api/banks', async (req, res) => {
    try {
      const response = await axios.get('https://sandbox.wompi.co/v1/pse/financial_institutions', {
        headers: {
          Authorization: `Bearer ${process.env.WOMPI_PUBLIC_KEY}`,
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error al obtener bancos:', error.response?.data || error.message);
      res.status(500).json({
        error: 'Error al obtener los bancos',
        details: error.response?.data || error.message,
      });
    }
  });

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});