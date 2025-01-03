import { useQueryClient, useQuery, useMutation } from 'vue-query'
import { createTRPCProxyClient } from '@trpc/client'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import type { AppRouter } from '../../api-server/server';
import type { Ref } from 'vue'
const url = import.meta.env.VITE_TRPC_URL

const client = createTRPCProxyClient<AppRouter>({
    links: [httpBatchLink({ url })],
})

export const useTodos = (filter: Ref<boolean | undefined>) => {
    const { data, refetch } = useQuery(['todos', filter], async () =>
        client.getTodos.query({ filter: filter.value })
    )
    return { data, refetch }
}
export const useCreateTodo = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (todo: string) =>
            client.createTodo.query({
                title: todo,
                completed: false,
            }),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
    })
}

export const useDeleteTodo = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => client.deleteTodo.query(id),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
    })
}
