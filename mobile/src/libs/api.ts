import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://nlw-return-api-mazyn.up.railway.app',
})
