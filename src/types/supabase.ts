export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          created_at: string
          id: string
          message: string
          reciever_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          reciever_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          reciever_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_reciever_id_fkey"
            columns: ["reciever_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      connections: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_user1_id_fkey"
            columns: ["user1_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_user2_id_fkey"
            columns: ["user2_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      connections_requests: {
        Row: {
          id: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          id?: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          id?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requests_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      groups: {
        Row: {
          created_at: string
          group_image: string
          group_name: string
          id: number
          isExclusive: boolean
          members: string[] | null
        }
        Insert: {
          created_at?: string
          group_image?: string
          group_name?: string
          id?: number
          isExclusive: boolean
          members?: string[] | null
        }
        Update: {
          created_at?: string
          group_image?: string
          group_name?: string
          id?: number
          isExclusive?: boolean
          members?: string[] | null
        }
        Relationships: []
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          user_name: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          user_name: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          name: string | null
          owner_id: string
          owner_name: string
          project_id: string
          task_categories: string[]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          name?: string | null
          owner_id: string
          owner_name: string
          project_id?: string
          task_categories?: string[]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          name?: string | null
          owner_id?: string
          owner_name?: string
          project_id?: string
          task_categories?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          description: string | null
          name: string | null
          priorty: string | null
          project_id: string | null
          report: string | null
          status: string | null
          task_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          name?: string | null
          priorty?: string | null
          project_id?: string | null
          report?: string | null
          status?: string | null
          task_id?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          name?: string | null
          priorty?: string | null
          project_id?: string | null
          report?: string | null
          status?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          }
        ]
      }
      users: {
        Row: {
          email: string | null
          id: string
          image: string | null
          name: string | null
        }
        Insert: {
          email?: string | null
          id: string
          image?: string | null
          name?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          image?: string | null
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
