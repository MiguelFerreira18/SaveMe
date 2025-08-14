export function ParseJwt(header) {
  if (!header) return null

  const token = header.substring(7)
  if (!token) return null

  const base64Url = token.split('.')[1]
  const payloadJSON = atob(base64Url)
  return JSON.parse(payloadJSON)
}

export function SaveJwtFieldsToLocalStorage(payload) {
  if (!payload) return

  for (const key in payload) {
    localStorage.setItem(key, payload[key])
  }
}

export function IsJWTExpired(token) {
  const payload = ParseJwt(token)

  if (payload && payload.exp && Date.now() >= payload.exp * 1000) {
    cleanlocalStorage()
    return true
  } else {
    return false
  }
}

function cleanlocalStorage() {
  localStorage.clear()
}
