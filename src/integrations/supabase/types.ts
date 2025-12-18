export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      breaking_news: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_breaking: boolean | null
          priority: number | null
          source: string | null
          source_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_breaking?: boolean | null
          priority?: number | null
          source?: string | null
          source_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_breaking?: boolean | null
          priority?: number | null
          source?: string | null
          source_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "video_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      music_videos: {
        Row: {
          category: string | null
          click_through_rate: number | null
          comments_count: number
          content_clarity_score: number | null
          conversion_rate: number | null
          created_at: string
          description: string | null
          duration: string | null
          featured_score: number | null
          id: string
          is_featured: boolean | null
          likes: number
          shares: number
          subcategory: string | null
          tags: string[] | null
          thumbnail_quality_score: number | null
          thumbnail_url: string | null
          title: string
          title_effectiveness_score: number | null
          traffic_external: number | null
          traffic_organic: number | null
          traffic_search: number | null
          traffic_suggested: number | null
          updated_at: string
          user_id: string | null
          video_url: string | null
          views: number
          watch_time_seconds: number
        }
        Insert: {
          category?: string | null
          click_through_rate?: number | null
          comments_count?: number
          content_clarity_score?: number | null
          conversion_rate?: number | null
          created_at?: string
          description?: string | null
          duration?: string | null
          featured_score?: number | null
          id?: string
          is_featured?: boolean | null
          likes?: number
          shares?: number
          subcategory?: string | null
          tags?: string[] | null
          thumbnail_quality_score?: number | null
          thumbnail_url?: string | null
          title: string
          title_effectiveness_score?: number | null
          traffic_external?: number | null
          traffic_organic?: number | null
          traffic_search?: number | null
          traffic_suggested?: number | null
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
          views?: number
          watch_time_seconds?: number
        }
        Update: {
          category?: string | null
          click_through_rate?: number | null
          comments_count?: number
          content_clarity_score?: number | null
          conversion_rate?: number | null
          created_at?: string
          description?: string | null
          duration?: string | null
          featured_score?: number | null
          id?: string
          is_featured?: boolean | null
          likes?: number
          shares?: number
          subcategory?: string | null
          tags?: string[] | null
          thumbnail_quality_score?: number | null
          thumbnail_url?: string | null
          title?: string
          title_effectiveness_score?: number | null
          traffic_external?: number | null
          traffic_organic?: number | null
          traffic_search?: number | null
          traffic_suggested?: number | null
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
          views?: number
          watch_time_seconds?: number
        }
        Relationships: []
      }
      partner_applications: {
        Row: {
          admin_notes: string | null
          channel_name: string
          content_category: string
          created_at: string
          id: string
          reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          subscriber_count: number
          updated_at: string
          user_id: string
          watch_hours: number
        }
        Insert: {
          admin_notes?: string | null
          channel_name: string
          content_category: string
          created_at?: string
          id?: string
          reason: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subscriber_count?: number
          updated_at?: string
          user_id: string
          watch_hours?: number
        }
        Update: {
          admin_notes?: string | null
          channel_name?: string
          content_category?: string
          created_at?: string
          id?: string
          reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subscriber_count?: number
          updated_at?: string
          user_id?: string
          watch_hours?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          channel_name: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          channel_name?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          channel_name?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      uploaded_videos: {
        Row: {
          category: string | null
          cloud_url: string | null
          created_at: string
          description: string | null
          duration: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_cloud_stored: boolean | null
          is_youtube_embed: boolean | null
          local_id: string | null
          subcategory: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string | null
          video_url: string | null
          views: number | null
          youtube_video_id: string | null
        }
        Insert: {
          category?: string | null
          cloud_url?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_cloud_stored?: boolean | null
          is_youtube_embed?: boolean | null
          local_id?: string | null
          subcategory?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
          views?: number | null
          youtube_video_id?: string | null
        }
        Update: {
          category?: string | null
          cloud_url?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_cloud_stored?: boolean | null
          is_youtube_embed?: boolean | null
          local_id?: string | null
          subcategory?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
          views?: number | null
          youtube_video_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number
          updated_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          updated_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          updated_at?: string
          user_id?: string
          video_id?: string
        }
        Relationships: []
      }
      video_likes: {
        Row: {
          created_at: string
          id: string
          is_like: boolean
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_like: boolean
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_like?: boolean
          user_id?: string
          video_id?: string
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          created_at: string
          id: string
          user_id: string
          video_id: string
          video_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          video_id: string
          video_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
          video_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
