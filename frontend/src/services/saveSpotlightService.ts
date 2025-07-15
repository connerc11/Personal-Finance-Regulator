import { ApiResponse, SharedGoal, ChatMessage, GoalComment, ChatRoom } from '../types';

const API_BASE_URL = 'http://localhost:8085/api';

class SaveSpotlightAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('personalfinance_token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Shared Goals API
  async getSharedGoals(): Promise<ApiResponse<SharedGoal[]>> {
    return this.request<SharedGoal[]>('/users/save-spotlight/goals');
  }

  async getSharedGoal(id: number): Promise<ApiResponse<SharedGoal>> {
    return this.request<SharedGoal>(`/users/save-spotlight/goals/${id}`);
  }

  async shareGoal(goalData: { title: string; description: string; targetAmount: number; currentAmount: number; deadline: string; category: string }): Promise<ApiResponse<SharedGoal>> {
    return this.request<SharedGoal>('/users/save-spotlight/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  }

  async unshareGoal(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/save-spotlight/goals/${id}`, {
      method: 'DELETE',
    });
  }

  async likeGoal(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/save-spotlight/goals/${id}/like`, {
      method: 'POST',
    });
  }

  async unlikeGoal(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/save-spotlight/goals/${id}/unlike`, {
      method: 'POST',
    });
  }

  // Goal Comments API
  async getGoalComments(goalId: number): Promise<ApiResponse<GoalComment[]>> {
    return this.request<GoalComment[]>(`/users/save-spotlight/goals/${goalId}/comments`);
  }

  async addGoalComment(goalId: number, comment: string): Promise<ApiResponse<GoalComment>> {
    return this.request<GoalComment>(`/users/save-spotlight/goals/${goalId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  async updateGoalComment(commentId: number, comment: string): Promise<ApiResponse<GoalComment>> {
    return this.request<GoalComment>(`/users/save-spotlight/goals/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ comment }),
    });
  }

  async deleteGoalComment(commentId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/save-spotlight/goals/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Chat Rooms API
  async getChatRooms(): Promise<ApiResponse<ChatRoom[]>> {
    return this.request<ChatRoom[]>('/users/save-spotlight/chat/rooms');
  }

  async getChatRoom(id: number): Promise<ApiResponse<ChatRoom>> {
    return this.request<ChatRoom>(`/users/save-spotlight/chat/rooms/${id}`);
  }

  async createChatRoom(name: string, description: string): Promise<ApiResponse<ChatRoom>> {
    return this.request<ChatRoom>('/users/save-spotlight/chat/rooms', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async joinChatRoom(roomId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/save-spotlight/chat/rooms/${roomId}/join`, {
      method: 'POST',
    });
  }

  async leaveChatRoom(roomId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/save-spotlight/chat/rooms/${roomId}/leave`, {
      method: 'POST',
    });
  }

  // Chat Messages API
  async getChatMessages(roomId: number, page: number = 0, size: number = 50): Promise<ApiResponse<ChatMessage[]>> {
    return this.request<ChatMessage[]>(`/users/save-spotlight/chat/rooms/${roomId}/messages?page=${page}&size=${size}`);
  }

  async sendChatMessage(roomId: number, message: string, replyToId?: number): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>(`/users/save-spotlight/chat/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message, replyToId }),
    });
  }

  async updateChatMessage(messageId: number, message: string): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>(`/users/save-spotlight/chat/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ message }),
    });
  }

  async deleteChatMessage(messageId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/save-spotlight/chat/messages/${messageId}`, {
      method: 'DELETE',
    });
  }
}

export const saveSpotlightAPI = new SaveSpotlightAPI();
