/**
 * 一个模拟的通用 API 客户端
 * 在实际项目中，这里应该是你的 axios 实例或 fetch 封装
 */
export const baseApi = {
  getList: async <T>(resource: string, _params?: unknown): Promise<T[]> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/${resource}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  getById: async <T>(resource: string, id: string | number): Promise<T> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/${resource}/${id}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  create: async <T, TPayload>(resource: string, data: TPayload): Promise<T> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  update: async <T, TPayload>(resource: string, data: TPayload): Promise<T> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/${resource}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  remove: async (resource: string, id: string | number): Promise<void> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/${resource}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Network response was not ok');
  },
};
