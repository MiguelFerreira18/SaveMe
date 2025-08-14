import { url } from './global/global'
const dirtyToken = localStorage.getItem('token')
const token = !dirtyToken || dirtyToken === 'undefined' ? '' : dirtyToken.trim()
const headers = {
  'Content-Type': 'application/json',
}

async function Get(path, needsAuth = false) {
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

async function Post(path, data = {}, needsAuth = false) {
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

async function Put(path, data = {}, needsAuth = false) {
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

async function Patch(path, data = {}, needsAuth = false) {
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

async function Del(path, needsAuth = false) {
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

export { Get, Post, Put, Patch, Del }
