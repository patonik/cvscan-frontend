import {reactive, ref} from 'vue'
import * as api from '../api.ts'

export const STATUSES: string[] = ['NEW', 'IN_REVIEW', 'INVITED', 'APPROVED', 'REJECTED']

const TRANSITIONS = {
    NEW: ['IN_REVIEW'],
    IN_REVIEW: ['INVITED', 'REJECTED'],
    INVITED: ['APPROVED', 'REJECTED'],
    APPROVED: [],
    REJECTED: []
} as const;

type Status = keyof typeof TRANSITIONS;

export const allowedNext = (status: Status) => TRANSITIONS[status] || []

export function useCandidates() {
    interface Candidate {
        id: string;
        name: string;
        email: string;
        phone: string;
        position: string;
        posLabel: string;
        city: string;
        telegram: string;
        totalExp: string;
        stack: string,
        education: string,

        [key: string]: any;
    }

    interface ApiError {
        status?: number;
        error?: string;
        message: string;
    }

    const filters = reactive({verdict: '', status: '', position: '', search: '', sort: 'createdAt,desc', size: 10})
    const page = ref(0)
    const list = ref([])
    const totalElements = ref(0)
    const totalPages = ref(0)
    const loading = ref(false)
    const error = ref<ApiError | null>(null);
    const selected = ref<Candidate | null>(null)
    const history = ref([])

    function fail(e: unknown) {
        if (e && typeof e === 'object' && 'message' in e && typeof (e as any).message === 'string') {
            error.value = e as ApiError;
        } else {
            error.value = {
                status: 0,
                error: 'NETWORK_ERROR',
                message: 'Не удалось связаться с API'
            };
        }
    }


    async function loadList() {
        loading.value = true
        error.value = null
        const params = new URLSearchParams()
        if (filters.verdict) params.set('verdict', filters.verdict)
        if (filters.status) params.set('status', filters.status)
        if (filters.position) params.set('position', filters.position)
        if (filters.search) params.set('search', filters.search)
        params.set('sort', filters.sort)
        params.set('page', page.value.toString())
        params.set('size', filters.size.toString())
        try {
            const data = await api.listCandidates(params.toString())
            list.value = data.content
            totalElements.value = data.totalElements
            totalPages.value = data.totalPages
        } catch (e) {
            fail(e)
        } finally {
            loading.value = false
        }
    }

    async function select(id: string) {
        error.value = null
        try {
            selected.value = await api.getCandidate(id)
            history.value = (await api.getHistory(id)) || []
        } catch (e) {
            fail(e)
        }
    }

    async function save(form: {
        name: string;
        email: string;
        phone: string;
        position: string;
        posLabel: string;
        city: string;
        telegram: string;
        totalExp: string;
        stack: string;
        education: string;
        verdict: string;
        summary: string;
        criteria: any;
        experience: any;
        questions: any;
        id: string
    }) {
        error.value = null
        const body = {
            name: form.name,
            email: form.email,
            phone: form.phone || null,
            position: form.position,
            posLabel: form.posLabel || null,
            city: form.city || null,
            telegram: form.telegram || null,
            totalExp: form.totalExp || null,
            stack: form.stack || null,
            education: form.education || null,
            verdict: form.verdict,
            summary: form.summary || null,
            criteria: form.criteria,
            experience: form.experience,
            questions: form.questions
        }
        try {
            if (form.id) {
                selected.value = await api.updateCandidate(form.id, body)
            } else {
                await api.createCandidate(body)
            }
            await loadList()
            return true
        } catch (e) {
            fail(e)
            return false
        }
    }

    async function remove(id: string) {
        error.value = null
        try {
            await api.deleteCandidate(id)
            if (selected.value && selected.value.id === id) {
                selected.value = null
                history.value = []
            }
            await loadList()
        } catch (e) {
            fail(e)
        }
    }

    async function patchStatus(id: string, status: Status, comment: string) {
        error.value = null
        try {
            selected.value = await api.changeStatus(id, {status, comment: comment || null})
            history.value = (await api.getHistory(id)) || []
            await loadList()
        } catch (e) {
            fail(e)
        }
    }

    return {
        filters, page, list, totalElements, totalPages, loading, error, selected, history,
        loadList, select, save, remove, patchStatus
    }
}
