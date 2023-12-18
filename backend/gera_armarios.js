import axios from 'axios';

const apiURL = "process.env.API_URL"

const generateWardrobe = async () => {
    for (let numero = 4; numero <= 680; numero++) {
        const armario = {
            number: numero,
            situation: "Disponível",
            name: "",
        };

        console.log(armario);

        try {
            const response = await axios.post(apiURL, armario);
            console.log(`Armário criado com sucesso: ${JSON.stringify(response.data)}`);
        } catch (error) {
            console.error('Erro ao criar armário:', error.message);
        }
    }
}

generateWardrobe();