const apiUrl = import.meta.env.VITE_API_URL;
    
interface CustomOptions extends RequestInit {
    auth?: boolean;
}

export async function http<T>(endpoint: string, { method, body, auth = true, ...config}: CustomOptions = {}): Promise<T> {
    

    const headers : HeadersInit = {
        "Content-Type": "application/json",
        ...(config.headers || {}),
    }

    if (auth) {
        const token = localStorage.getItem("marcador.token");
        if(token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
        method,
        body,
        ...config,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem("marcador.token");
        window.location.href = "/login";
        throw new Error("Sessão Expirada, faça login novamente.")
    }

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.message || `Erro no servidor: ${response.status}`);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const api = {
    get: <T> (endpoint : string, options?: CustomOptions) => http<T>(endpoint, {method: "GET", ...options}),
    post: <T> (endpoint: string, body : unknown, options?: CustomOptions) => http<T>(endpoint, {method: "POST", body: JSON.stringify(body), ...options}),
    patch: <T>(endpoint: string, body: unknown, options?: CustomOptions) => http<T>(endpoint, {method: "PATCH", body: JSON.stringify(body), ...options}),
    put: <T>(endpoint: string, body: unknown, options?: CustomOptions) => http<T>(endpoint, {method: "PUT", body: JSON.stringify(body), ...options}),
    delete: (endpoint: string, options?: CustomOptions) => http(endpoint, {method: "DELETE", ...options})
}