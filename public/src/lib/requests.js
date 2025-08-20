import { url } from './config'
const dirtyToken = localStorage.getItem('token')
const token = !dirtyToken || dirtyToken === 'undefined' ? '' : dirtyToken.trim()
const headers = {
  'Content-Type': 'application/json',
}

async function Get(path, needsAuth = false) {
  try {
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
    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, error }
  }
}

async function Post(path, data = {}, needsAuth = false) {
  try {
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
    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, error }
  }
}

async function Put(path, data = {}, needsAuth = false) {
  try {
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
    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, error }
  }
}

async function Patch(path, data = {}, needsAuth = false) {
  try {
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
    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, error }
  }
}

async function Del(path, needsAuth = false) {
  try {
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
    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, error }
  }
}

export { Get, Post, Put, Patch, Del }
