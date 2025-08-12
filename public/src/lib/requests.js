import { url } from './global/global'
const token = localStorage.getItem('token').trim()
const headers = {
  'Content-Type': 'application/json',
}

async function get(path, needsAuth = false) {
  if (needsAuth) {
    headers.Authorization = `Bearer ${token}`
  }

  const options = {
    method: 'GET',
    headers,
    mode: 'cors',
    credentials: 'include',
  }
  const response = await fetch(url + path, options)
  return response
}

async function post(path, data = {}, needsAuth = false) {
  if (needsAuth) {
    headers.Authorization = `Bearer ${token}`
  }

  const options = {
    method: 'POST',
    headers,
    mode: 'cors',
    credentials: 'include',
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(url + path, options)
  return response
}

async function put(path, data = {}, needsAuth = false) {
  if (needsAuth) {
    headers.Authorization = `Bearer ${token}`
  }

  const options = {
    method: 'PUT',
    headers,
    mode: 'cors',
    credentials: 'include',
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(url + path, options)
  return response
}

async function patch(path, data = {}, needsAuth = false) {
  if (needsAuth) {
    headers.Authorization = `Bearer ${token}`
  }

  const options = {
    method: 'PATCH',
    headers,
    mode: 'cors',
    credentials: 'include',
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(url + path, options)
  return response
}

async function del(path, needsAuth = false) {
  if (needsAuth) {
    headers.Authorization = `Bearer ${token}`
  }

  const options = {
    method: 'DELETE',
    headers,
    mode: 'cors',
    credentials: 'include',
  }
  const response = await fetch(url + path, options)
  return response
}

export { get, post, put, patch, del }
