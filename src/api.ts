const BASE = 'api/v1/candidates'

async function request(path: string, opts = {}) {
    const res = await fetch(BASE + path, {
        headers: {'Content-Type': 'application/json'},
        ...opts
    })
    if (res.status === 204) return null
    const body = await res.json().catch(() => null)
    if (!res.ok) {
        throw body || {status: res.status, error: 'ERROR', message: res.statusText}
    }
    return body
}

export const listCandidates = (query: string) => request('?' + query)
export const getCandidate = (id: string) => request('/' + id)
export const createCandidate = (body: any) => request('', {method: 'POST', body: JSON.stringify(body)})
export const updateCandidate = (id: string, body: any) => request('/' + id, {method: 'PUT', body: JSON.stringify(body)})
export const deleteCandidate = (id: string) => request('/' + id, {method: 'DELETE'})
export const changeStatus = (id: string, body: any) => request(`/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body)
})
export const getHistory = (id: string) => request(`/${id}/status-history`)
