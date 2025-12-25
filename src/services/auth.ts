import {api} from './api';

export async function loginUser(identifier: string, password: string){
    return api.post("/login", {
        identifier: identifier,
        password: password,
    });
}

export async function registerUser(name: string, username: string, email: string, password: string){
  return api.post("/register/request", {
    name,
    username,
    email,
    password
  });
}

export const confirmEmailCode = (email: string, code: string) => {
  return api.post('/register/confirm', {
    email,
    code,
  });
};

export async function recoverRequest(email: string) {
  return api.post("/recover-request", {
    email
  });
}

export async function recoverVerify(email: string, code: string) {
  return api.post("/recover-verify", {
    email,
    code
  });
}

export async function resetPassword(email: string, newPassword: string) {
  return api.post("/reset-password", {
    email,
    newPassword,
  });
}

export async function createLetter(data: any, token: string) {
  return api.post("/letters", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function createLetterPhoto(data: any, token: string) {
  return api.post("/letter-photo", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getUserLetters(token: string) {
  const res = await api.get("/letters/me", {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
}

export async function getUserProfile(token: string) {
  return api.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

// Buscar carta específica
export const getLetterById = async (id: number, token: string) => {
  const response = await api.get(`/letters/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Deletar carta
export const deleteLetter = async (id: number, token: string) => {
  const response = await api.delete(`/letters/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
