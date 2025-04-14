import axios from 'axios';

// Crie uma instância do axios com configurações padrão
const api = axios.create({
  // Substitua pela URL base da sua API
  baseURL: 'http://192.168.15.9:8080',
  // Timeout em milissegundos
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor para requisições
api.interceptors.request.use(
  config => {
    // Você pode adicionar um token de autenticação aqui
    // const token = await AsyncStorage.getItem('@app:token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

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