import { useEffect } from "react";
import { useQuery } from "react-query";
import { api } from "../api";

type User = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

type GetUsersResponse = {
    totalCount: number;
    users: User[]
}

export async function getUsers(page: number): Promise<GetUsersResponse> {

    const { data, headers } = await api.get('users', {
        params: {
            page,
        }
    })

    //total de registros na API
    const totalCount = Number(headers['x-total-count'])

    const users = data.users.map(user => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    });

    return {
        users,
        totalCount
    };
}

export function useUsers(page: number) {
    //o React Query só refaz a requisição se esse segundo parametro mudar
    //as páginas anteriores não saem do cache <3
    return useQuery(['users', page], () => getUsers(page), {
        staleTime: 1000 * 5, // A requisição fica "fresh" por 5 segundos e não precisa ser recarregada pelo query. (por padrão o react query deixa tudo obsoleto, que é o "stale")
    })
}