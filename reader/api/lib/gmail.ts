const GMAIL_API = 'https://gmail.googleapis.com/gmail/v1/users/me'

export async function fetchWithAuth(accessToken: string, url: string, options?: RequestInit) {
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
}

export async function getMessages(accessToken: string, labelName: string) {
  const q = `label:${labelName.replace(/ /g, '-')}`
  const url = `${GMAIL_API}/messages?q=${encodeURIComponent(q)}&maxResults=50`
  const res = await fetchWithAuth(accessToken, url)

  if (!res.ok) {
    throw new Error(`Failed to list messages: ${res.status}`)
  }

  const data = await res.json()
  return data.messages || []
}

export async function getMessage(accessToken: string, messageId: string) {
  const url = `${GMAIL_API}/messages/${messageId}?format=full`
  const res = await fetchWithAuth(accessToken, url)

  if (!res.ok) {
    throw new Error(`Failed to get message: ${res.status}`)
  }

  return res.json()
}

export async function archiveMessage(accessToken: string, messageId: string, labelId: string) {
  const url = `${GMAIL_API}/messages/${messageId}/modify`
  const res = await fetchWithAuth(accessToken, url, {
    method: 'POST',
    body: JSON.stringify({
      removeLabelIds: [labelId],
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to archive message: ${res.status}`)
  }

  return res.json()
}
