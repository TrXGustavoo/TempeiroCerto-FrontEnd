import { MMKV } from 'react-native-mmkv';

// Criação da instância MMKV
const storage = new MMKV();

// Funções utilitárias
export const setToken = (token) => {
  storage.set('token', token);
};

export const getToken = () => {
  return storage.getString('token') || null
}

export const deleteToken = () => {
  storage.delete('token')
}

export const setUserId = (id) => {
  storage.set('userId', id.toString());
};

export const getUserId = () => {
  const id = storage.getString('userId');
  return id ? parseInt(id) : null;
};

export const removeUserId = () => {
  storage.delete('userId');
};

// Exporta a instância, se quiser usar diretamente
export { storage };
