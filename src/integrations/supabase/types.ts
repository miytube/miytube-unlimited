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
      active_sessions: {
        Row: {
          created_at: string
          current_page: string | null
          id: string
          last_active_at: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_page?: string | null
          id?: string
          last_active_at?: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_page?: string | null
          id?: string
          last_active_at?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ad_campaigns: {
        Row: {
          ad_format: Database["public"]["Enums"]["ad_format"]
          admin_notes: string | null
          age_range_max: number | null
          age_range_min: number | null
          amount_spent: number
          budget_payments: Json
          business_name: string
          business_website: string | null
          call_to_action: string | null
          campaign_name: string
          clicks: number
          cost_per_view: number | null
          created_at: string
          ctr: number | null
          daily_budget: number
          description: string | null
          destination_url: string
          dispute_status: string | null
          end_date: string | null
          headline: string
          id: string
          impressions: number
          last_payment_error: string | null
          media_url: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          placement: string
          refunded_amount: number
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          site: string
          start_date: string
          status: Database["public"]["Enums"]["ad_campaign_status"]
          stripe_customer_id: string | null
          target_audience: string | null
          target_categories: string[] | null
          target_locations: string[] | null
          thumbnail_url: string | null
          total_budget: number
          updated_at: string
          user_id: string
          views: number
        }
        Insert: {
          ad_format?: Database["public"]["Enums"]["ad_format"]
          admin_notes?: string | null
          age_range_max?: number | null
          age_range_min?: number | null
          amount_spent?: number
          budget_payments?: Json
          business_name: string
          business_website?: string | null
          call_to_action?: string | null
          campaign_name: string
          clicks?: number
          cost_per_view?: number | null
          created_at?: string
          ctr?: number | null
          daily_budget?: number
          description?: string | null
          destination_url: string
          dispute_status?: string | null
          end_date?: string | null
          headline: string
          id?: string
          impressions?: number
          last_payment_error?: string | null
          media_url?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          placement?: string
          refunded_amount?: number
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          site?: string
          start_date?: string
          status?: Database["public"]["Enums"]["ad_campaign_status"]
          stripe_customer_id?: string | null
          target_audience?: string | null
          target_categories?: string[] | null
          target_locations?: string[] | null
          thumbnail_url?: string | null
          total_budget?: number
          updated_at?: string
          user_id: string
          views?: number
        }
        Update: {
          ad_format?: Database["public"]["Enums"]["ad_format"]
          admin_notes?: string | null
          age_range_max?: number | null
          age_range_min?: number | null
          amount_spent?: number
          budget_payments?: Json
          business_name?: string
          business_website?: string | null
          call_to_action?: string | null
          campaign_name?: string
          clicks?: number
          cost_per_view?: number | null
          created_at?: string
          ctr?: number | null
          daily_budget?: number
          description?: string | null
          destination_url?: string
          dispute_status?: string | null
          end_date?: string | null
          headline?: string
          id?: string
          impressions?: number
          last_payment_error?: string | null
          media_url?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          placement?: string
          refunded_amount?: number
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          site?: string
          start_date?: string
          status?: Database["public"]["Enums"]["ad_campaign_status"]
          stripe_customer_id?: string | null
          target_audience?: string | null
          target_categories?: string[] | null
          target_locations?: string[] | null
          thumbnail_url?: string | null
          total_budget?: number
          updated_at?: string
          user_id?: string
          views?: number
        }
        Relationships: []
      }
      advertiser_inquiries: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          status: string
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          status?: string
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          status?: string
        }
        Relationships: []
      }
      announcement_views: {
        Row: {
          announcement_key: string
          created_at: string
          id: string
          viewer_key: string
        }
        Insert: {
          announcement_key: string
          created_at?: string
          id?: string
          viewer_key: string
        }
        Update: {
          announcement_key?: string
          created_at?: string
          id?: string
          viewer_key?: string
        }
        Relationships: []
      }
      avatar_items: {
        Row: {
          asset_uri: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_starter: boolean
          legend_id: number | null
          metadata: Json
          name: string
          price_credits: number
          rarity: string
          sku: string
          slot: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          asset_uri: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_starter?: boolean
          legend_id?: number | null
          metadata?: Json
          name: string
          price_credits?: number
          rarity?: string
          sku: string
          slot: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          asset_uri?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_starter?: boolean
          legend_id?: number | null
          metadata?: Json
          name?: string
          price_credits?: number
          rarity?: string
          sku?: string
          slot?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      avatar_portraits: {
        Row: {
          created_at: string
          image_url: string
          look: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          image_url: string
          look?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          image_url?: string
          look?: Json
          user_id?: string
        }
        Relationships: []
      }
      blackjack_hands: {
        Row: {
          active_hand: number
          bet: number
          created_at: string
          dealer: number[]
          deck: number[]
          doubled: boolean
          id: string
          payout: number
          player: number[]
          settled_at: string | null
          split_bet: number
          split_doubled: boolean
          split_hand: number[] | null
          split_payout: number
          split_status: string | null
          status: string
          user_id: string
        }
        Insert: {
          active_hand?: number
          bet: number
          created_at?: string
          dealer: number[]
          deck: number[]
          doubled?: boolean
          id?: string
          payout?: number
          player: number[]
          settled_at?: string | null
          split_bet?: number
          split_doubled?: boolean
          split_hand?: number[] | null
          split_payout?: number
          split_status?: string | null
          status?: string
          user_id: string
        }
        Update: {
          active_hand?: number
          bet?: number
          created_at?: string
          dealer?: number[]
          deck?: number[]
          doubled?: boolean
          id?: string
          payout?: number
          player?: number[]
          settled_at?: string | null
          split_bet?: number
          split_doubled?: boolean
          split_hand?: number[] | null
          split_payout?: number
          split_status?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      blocked_uploads: {
        Row: {
          category: string | null
          created_at: string
          details: string | null
          file_name: string
          file_size: number | null
          id: string
          reason: string
          subcategory: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          details?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          reason: string
          subcategory?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          details?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          reason?: string
          subcategory?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          ai_summary: string | null
          ai_summary_generated_at: string | null
          category: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          generated_from_video_id: string | null
          id: string
          is_published: boolean
          site: string
          slug: string
          title: string
          updated_at: string
          user_id: string
          views: number
        }
        Insert: {
          ai_summary?: string | null
          ai_summary_generated_at?: string | null
          category?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          generated_from_video_id?: string | null
          id?: string
          is_published?: boolean
          site?: string
          slug: string
          title: string
          updated_at?: string
          user_id: string
          views?: number
        }
        Update: {
          ai_summary?: string | null
          ai_summary_generated_at?: string | null
          category?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          generated_from_video_id?: string | null
          id?: string
          is_published?: boolean
          site?: string
          slug?: string
          title?: string
          updated_at?: string
          user_id?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_generated_from_video_id_fkey"
            columns: ["generated_from_video_id"]
            isOneToOne: false
            referencedRelation: "uploaded_videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_generated_from_video_id_fkey"
            columns: ["generated_from_video_id"]
            isOneToOne: false
            referencedRelation: "uploaded_videos_public"
            referencedColumns: ["id"]
          },
        ]
      }
      booksem_passes: {
        Row: {
          book_id: string | null
          code: string
          coins_spent: number
          created_at: string
          discount_percent: number
          id: string
          redeemed_at: string | null
          reserved_until: string | null
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id?: string | null
          code: string
          coins_spent: number
          created_at?: string
          discount_percent?: number
          id?: string
          redeemed_at?: string | null
          reserved_until?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string | null
          code?: string
          coins_spent?: number
          created_at?: string
          discount_percent?: number
          id?: string
          redeemed_at?: string | null
          reserved_until?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      booksem_purchases: {
        Row: {
          book_id: string
          created_at: string
          id: string
          source: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          source?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          source?: string
          user_id?: string
        }
        Relationships: []
      }
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
          site: string
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
          site?: string
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
          site?: string
          source?: string | null
          source_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cha_conversations: {
        Row: {
          created_at: string
          id: string
          site: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          site?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          site?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cha_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          message_key: string | null
          parts: Json
          role: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          message_key?: string | null
          parts?: Json
          role: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          message_key?: string | null
          parts?: Json
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cha_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "cha_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      cha_room_messages: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          role: string
          room_id: string
          user_id: string | null
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          role?: string
          room_id: string
          user_id?: string | null
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          role?: string
          room_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cha_room_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "cha_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      cha_rooms: {
        Row: {
          created_at: string
          description: string | null
          emoji: string
          id: string
          is_active: boolean
          name: string
          site: string
          slug: string
          sort_order: number
          topic: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          is_active?: boolean
          name: string
          site?: string
          slug: string
          sort_order?: number
          topic?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          is_active?: boolean
          name?: string
          site?: string
          slug?: string
          sort_order?: number
          topic?: string | null
        }
        Relationships: []
      }
      coin_pack_orders: {
        Row: {
          amount_cents: number
          coins: number
          created_at: string
          environment: string
          id: string
          pack_id: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          coins: number
          created_at?: string
          environment: string
          id?: string
          pack_id: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          coins?: number
          created_at?: string
          environment?: string
          id?: string
          pack_id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          id: string
          item_id: string | null
          reason: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          id?: string
          item_id?: string | null
          reason: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          id?: string
          item_id?: string | null
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "avatar_items"
            referencedColumns: ["id"]
          },
        ]
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
      custom_categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          site: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          site?: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          site?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      custom_subcategories: {
        Row: {
          category_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          site: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          site?: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          site?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "custom_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_watch_pages: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          site: string
          slug: string
          sort_order: number
          subcategory_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          site?: string
          slug: string
          sort_order?: number
          subcategory_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          site?: string
          slug?: string
          sort_order?: number
          subcategory_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_watch_pages_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "custom_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_likes: {
        Row: {
          created_at: string
          discussion_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discussion_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discussion_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_likes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_replies: {
        Row: {
          author_name: string
          content: string
          created_at: string
          discussion_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          discussion_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          discussion_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          author_name: string
          category: string
          content: string
          created_at: string
          id: string
          site: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name: string
          category?: string
          content: string
          created_at?: string
          id?: string
          site?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          site?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          downloads: number
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          site: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          downloads?: number
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          site?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          downloads?: number
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          site?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      featured_discussion_video: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      holdem_hands: {
        Row: {
          ante: number
          call_bet: number
          cards: number[]
          created_at: string
          id: string
          payout: number
          settled_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          ante: number
          call_bet?: number
          cards: number[]
          created_at?: string
          id?: string
          payout?: number
          settled_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          ante?: number
          call_bet?: number
          cards?: number[]
          created_at?: string
          id?: string
          payout?: number
          settled_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
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
          site: string
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
          site?: string
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
          site?: string
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
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          page_path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      paigow_hands: {
        Row: {
          bet: number
          cards: number[]
          created_at: string
          dealer_low: number[] | null
          id: string
          payout: number
          player_low: number[] | null
          settled_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          bet: number
          cards: number[]
          created_at?: string
          dealer_low?: number[] | null
          id?: string
          payout?: number
          player_low?: number[] | null
          settled_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          bet?: number
          cards?: number[]
          created_at?: string
          dealer_low?: number[] | null
          id?: string
          payout?: number
          player_low?: number[] | null
          settled_at?: string | null
          status?: string
          user_id?: string
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
      pgtiles_hands: {
        Row: {
          bet: number
          created_at: string
          dealer_high: number[] | null
          id: string
          payout: number
          player_high: number[] | null
          settled_at: string | null
          status: string
          tiles: number[]
          user_id: string
        }
        Insert: {
          bet: number
          created_at?: string
          dealer_high?: number[] | null
          id?: string
          payout?: number
          player_high?: number[] | null
          settled_at?: string | null
          status?: string
          tiles: number[]
          user_id: string
        }
        Update: {
          bet?: number
          created_at?: string
          dealer_high?: number[] | null
          id?: string
          payout?: number
          player_high?: number[] | null
          settled_at?: string | null
          status?: string
          tiles?: number[]
          user_id?: string
        }
        Relationships: []
      }
      pictures: {
        Row: {
          created_at: string
          description: string | null
          height: number | null
          id: string
          image_url: string
          site: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          views: number
          width: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          height?: number | null
          id?: string
          image_url: string
          site?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          views?: number
          width?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          height?: number | null
          id?: string
          image_url?: string
          site?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          views?: number
          width?: number | null
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
      rate_card_requests: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          name: string
          role: string | null
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          name: string
          role?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string | null
        }
        Relationships: []
      }
      sicbo_rounds: {
        Row: {
          bets: Json
          created_at: string
          dice: number[]
          id: string
          payout: number
          stake: number
          user_id: string
        }
        Insert: {
          bets: Json
          created_at?: string
          dice: number[]
          id?: string
          payout?: number
          stake: number
          user_id: string
        }
        Update: {
          bets?: Json
          created_at?: string
          dice?: number[]
          id?: string
          payout?: number
          stake?: number
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          environment: string
          id: string
          price_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          environment?: string
          id?: string
          price_id?: string | null
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          environment?: string
          id?: string
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tips: {
        Row: {
          amount_cents: number
          created_at: string
          creator_id: string
          currency: string
          id: string
          message: string | null
          payer_id: string | null
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string
          video_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          creator_id: string
          currency?: string
          id?: string
          message?: string | null
          payer_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
          video_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          creator_id?: string
          currency?: string
          id?: string
          message?: string | null
          payer_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tips_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "uploaded_videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tips_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "uploaded_videos_public"
            referencedColumns: ["id"]
          },
        ]
      }
      uploaded_video_ips: {
        Row: {
          created_at: string
          uploader_ip: string | null
          video_id: string
        }
        Insert: {
          created_at?: string
          uploader_ip?: string | null
          video_id: string
        }
        Update: {
          created_at?: string
          uploader_ip?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploaded_video_ips_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: true
            referencedRelation: "uploaded_videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploaded_video_ips_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: true
            referencedRelation: "uploaded_videos_public"
            referencedColumns: ["id"]
          },
        ]
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
          site: string
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
          site?: string
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
          site?: string
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
      user_avatar_inventory: {
        Row: {
          acquired_at: string
          acquired_via: string
          chain: string | null
          id: string
          item_id: string
          token_id: string | null
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          acquired_at?: string
          acquired_via?: string
          chain?: string | null
          id?: string
          item_id: string
          token_id?: string | null
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          acquired_at?: string
          acquired_via?: string
          chain?: string | null
          id?: string
          item_id?: string
          token_id?: string | null
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_avatar_inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "avatar_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_avatars: {
        Row: {
          config: Json
          created_at: string
          equipped: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          equipped?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          equipped?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_coin_wallets: {
        Row: {
          balance: number
          created_at: string
          last_daily_bonus_on: string | null
          updated_at: string
          user_id: string
          welcome_granted_at: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          last_daily_bonus_on?: string | null
          updated_at?: string
          user_id: string
          welcome_granted_at?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          last_daily_bonus_on?: string | null
          updated_at?: string
          user_id?: string
          welcome_granted_at?: string | null
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
      video_engagement_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          session_id: string | null
          user_id: string | null
          video_id: string
          video_table: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          session_id?: string | null
          user_id?: string | null
          video_id: string
          video_table?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
          video_id?: string
          video_table?: string
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
      visitor_ip_cache: {
        Row: {
          asn: string | null
          checked_at: string
          country: string | null
          ip: string
          is_datacenter: boolean
          is_proxy: boolean
          org: string | null
        }
        Insert: {
          asn?: string | null
          checked_at?: string
          country?: string | null
          ip: string
          is_datacenter?: boolean
          is_proxy?: boolean
          org?: string | null
        }
        Update: {
          asn?: string | null
          checked_at?: string
          country?: string | null
          ip?: string
          is_datacenter?: boolean
          is_proxy?: boolean
          org?: string | null
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
      uploaded_videos_public: {
        Row: {
          category: string | null
          cloud_url: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          id: string | null
          is_cloud_stored: boolean | null
          is_youtube_embed: boolean | null
          local_id: string | null
          site: string | null
          subcategory: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          video_url: string | null
          views: number | null
          youtube_video_id: string | null
        }
        Insert: {
          category?: string | null
          cloud_url?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string | null
          is_cloud_stored?: boolean | null
          is_youtube_embed?: boolean | null
          local_id?: string | null
          site?: string | null
          subcategory?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          views?: number | null
          youtube_video_id?: string | null
        }
        Update: {
          category?: string | null
          cloud_url?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string | null
          is_cloud_stored?: boolean | null
          is_youtube_embed?: boolean | null
          local_id?: string | null
          site?: string | null
          subcategory?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          views?: number | null
          youtube_video_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      attach_booksem_session: {
        Args: { _pass_id: string; _session_id: string }
        Returns: undefined
      }
      bj_finish_active: {
        Args: { _hand_id: string }
        Returns: {
          active_hand: number
          bet: number
          created_at: string
          dealer: number[]
          deck: number[]
          doubled: boolean
          id: string
          payout: number
          player: number[]
          settled_at: string | null
          split_bet: number
          split_doubled: boolean
          split_hand: number[] | null
          split_payout: number
          split_status: string | null
          status: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "blackjack_hands"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      bj_hand_value: { Args: { _cards: number[] }; Returns: number }
      bj_settle: {
        Args: { _hand_id: string }
        Returns: {
          active_hand: number
          bet: number
          created_at: string
          dealer: number[]
          deck: number[]
          doubled: boolean
          id: string
          payout: number
          player: number[]
          settled_at: string | null
          split_bet: number
          split_doubled: boolean
          split_hand: number[] | null
          split_payout: number
          split_status: string | null
          status: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "blackjack_hands"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      bj_view: {
        Args: { _h: Database["public"]["Tables"]["blackjack_hands"]["Row"] }
        Returns: Json
      }
      blackjack_current: { Args: never; Returns: Json }
      blackjack_deal: { Args: { _bet: number }; Returns: Json }
      blackjack_double: { Args: { _hand_id: string }; Returns: Json }
      blackjack_hit: { Args: { _hand_id: string }; Returns: Json }
      blackjack_split: { Args: { _hand_id: string }; Returns: Json }
      blackjack_stand: { Args: { _hand_id: string }; Returns: Json }
      charge_portrait: {
        Args: { _price: number; _user_id: string }
        Returns: Json
      }
      check_upload_duplicate_by_ip: {
        Args: {
          _category: string
          _file_name: string
          _file_size: number
          _subcategory: string
          _uploader_ip: string
        }
        Returns: {
          category: string
          file_name: string
          file_size: number
          id: string
          subcategory: string
          title: string
        }[]
      }
      claim_daily_coins: { Args: never; Returns: Json }
      claim_starter_avatar_items: { Args: never; Returns: number }
      complete_booksem_pass: {
        Args: { _book_id: string; _session_id: string }
        Returns: boolean
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_active_banner_ads:
        | {
            Args: { _placement?: string }
            Returns: {
              business_name: string
              call_to_action: string
              description: string
              destination_url: string
              headline: string
              id: string
              media_url: string
            }[]
          }
        | {
            Args: { _placement?: string; _site?: string }
            Returns: {
              business_name: string
              call_to_action: string
              description: string
              destination_url: string
              headline: string
              id: string
              media_url: string
            }[]
          }
      get_active_preroll_ads:
        | {
            Args: never
            Returns: {
              ad_format: string
              business_name: string
              call_to_action: string
              description: string
              destination_url: string
              headline: string
              id: string
              media_url: string
            }[]
          }
        | {
            Args: { _site?: string }
            Returns: {
              ad_format: string
              business_name: string
              call_to_action: string
              description: string
              destination_url: string
              headline: string
              id: string
              media_url: string
            }[]
          }
      get_coin_wallet: { Args: never; Returns: Json }
      get_discussion_like_counts: {
        Args: { _discussion_ids: string[] }
        Returns: {
          discussion_id: string
          likes: number
        }[]
      }
      get_user_avatars: {
        Args: { _user_ids: string[] }
        Returns: {
          config: Json
          equipped: Json
          portrait_url: string
          user_id: string
        }[]
      }
      get_video_like_counts: {
        Args: { _video_ids: string[] }
        Returns: {
          dislikes: number
          likes: number
          video_id: string
        }[]
      }
      get_video_view_counts: {
        Args: { _video_ids: string[] }
        Returns: {
          video_id: string
          views: number
        }[]
      }
      grant_coin_pack: {
        Args: {
          _amount_cents: number
          _coins: number
          _env: string
          _pack_id: string
          _payment_intent_id: string
          _session_id: string
          _user_id: string
        }
        Returns: boolean
      }
      has_active_subscription: {
        Args: { _env: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      holdem_ante_odds: { Args: { _score: number }; Returns: number }
      holdem_call: { Args: { _hand_id: string }; Returns: Json }
      holdem_current: { Args: never; Returns: Json }
      holdem_deal: { Args: { _ante: number }; Returns: Json }
      holdem_fold: { Args: { _hand_id: string }; Returns: Json }
      holdem_view: {
        Args: { _h: Database["public"]["Tables"]["holdem_hands"]["Row"] }
        Returns: Json
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      normalize_category_value: { Args: { val: string }; Returns: string }
      paigow_current: { Args: never; Returns: Json }
      paigow_deal: { Args: { _bet: number }; Returns: Json }
      paigow_house_low: { Args: { _c: number[] }; Returns: number[] }
      paigow_rest: { Args: { _c: number[]; _low: number[] }; Returns: number[] }
      paigow_set: { Args: { _hand_id: string; _low: number[] }; Returns: Json }
      paigow_view: {
        Args: { _h: Database["public"]["Tables"]["paigow_hands"]["Row"] }
        Returns: Json
      }
      pgtiles_current: { Args: never; Returns: Json }
      pgtiles_deal: { Args: { _bet: number }; Returns: Json }
      pgtiles_high_of: {
        Args: { _pair: number[]; _t: number[] }
        Returns: number[]
      }
      pgtiles_house_high: { Args: { _t: number[] }; Returns: number[] }
      pgtiles_pips: { Args: { _t: number }; Returns: number }
      pgtiles_rank: { Args: { _t: number }; Returns: number }
      pgtiles_score: { Args: { _a: number; _b: number }; Returns: number }
      pgtiles_score2: { Args: { _h: number[] }; Returns: number }
      pgtiles_set: {
        Args: { _hand_id: string; _pair: number[] }
        Returns: Json
      }
      pgtiles_view: {
        Args: { _h: Database["public"]["Tables"]["pgtiles_hands"]["Row"] }
        Returns: Json
      }
      poker_best: { Args: { _c: number[] }; Returns: number }
      poker_score2: { Args: { _c: number[] }; Returns: number }
      poker_score5: { Args: { _c: number[] }; Returns: number }
      purchase_avatar_item: { Args: { _sku: string }; Returns: Json }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      record_ad_event: {
        Args: { _campaign_id: string; _event: string }
        Returns: undefined
      }
      record_announcement_view: {
        Args: { _key: string; _viewer: string }
        Returns: number
      }
      record_uploader_ip: {
        Args: { _local_id: string; _uploader_ip: string }
        Returns: undefined
      }
      redeem_booksem_pass: { Args: never; Returns: Json }
      refund_portrait: { Args: { _transaction_id: string }; Returns: Json }
      release_booksem_pass: { Args: { _pass_id: string }; Returns: undefined }
      reserve_booksem_pass: { Args: { _user_id: string }; Returns: string }
      revoke_coin_pack: {
        Args: { _payment_intent_id: string }
        Returns: boolean
      }
      sicbo_bet_return: {
        Args: {
          _amount: number
          _dice: number[]
          _type: string
          _value: number
        }
        Returns: number
      }
      sicbo_die: { Args: never; Returns: number }
      sicbo_roll: { Args: { _bets: Json }; Returns: Json }
    }
    Enums: {
      ad_campaign_status:
        | "draft"
        | "pending_payment"
        | "active"
        | "paused"
        | "completed"
        | "rejected"
        | "pending_review"
      ad_format:
        | "skippable_instream"
        | "non_skippable_instream"
        | "bumper"
        | "discovery"
        | "banner"
        | "overlay"
        | "vignette"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      ad_campaign_status: [
        "draft",
        "pending_payment",
        "active",
        "paused",
        "completed",
        "rejected",
        "pending_review",
      ],
      ad_format: [
        "skippable_instream",
        "non_skippable_instream",
        "bumper",
        "discovery",
        "banner",
        "overlay",
        "vignette",
      ],
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
