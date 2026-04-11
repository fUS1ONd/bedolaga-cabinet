import { apiClient } from './client';

export interface InviteItem {
  code: string;
  used_by_username: string | null;
  used_at: string | null;
  created_at: string;
}

export const inviteApi = {
  // Активировать инвайт-код
  activate: (code: string) => apiClient.post('/cabinet/invite/activate', { code }),
  // Сгенерировать новый инвайт-код
  generate: () => apiClient.post('/cabinet/invite/generate'),
  // Получить список своих инвайтов
  myInvites: () => apiClient.get<InviteItem[]>('/cabinet/invite/my'),
};
