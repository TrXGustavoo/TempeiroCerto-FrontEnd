import axios from 'axios';
//import { getToken } from '../storage';



// Crie uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: 'http://192.168.15.9:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

//api.interceptors.request.use(
//  async (config) => {
//    const token = getToken();
//    if (token) {
//      config.headers.Authorization = `Bearer ${token}`;
//    }
//    return config;
//  },
//  (error) => Promise.reject(error)
//);

// Interceptor para respostas
api.interceptors.response.use(
  response => {
    // Qualquer código de status que esteja dentro do intervalo 2xx fará com que esta função seja acionada
    return response;
  },
  error => {
    // Qualquer código de status que esteja fora do intervalo 2xx fará com que esta função seja acionada
    if (error.response) {
      // A requisição foi feita e o servidor respondeu com um código de status
      // que não está no intervalo 2xx
      console.log('Erro de resposta:', error.response.data);
      console.log('Status:', error.response.status);
    } else if (error.request) {
      // A requisição foi feita mas nenhuma resposta foi recebida
      console.log('Erro de requisição:', error.request);
    } else {
      // Algo aconteceu na configuração da requisição que acionou um erro
      console.log('Erro:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;