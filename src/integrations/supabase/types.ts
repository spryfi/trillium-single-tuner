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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analysis_history: {
        Row: {
          analysis_result: string | null
          client_id: string | null
          conversation_id: string | null
          created_at: string | null
          data_volume_estimate: string | null
          id: string
          input_data: string | null
          issues_identified: string[] | null
          modules_recommended: string[] | null
          project_id: string | null
          session_id: string | null
          solution_summary: string | null
          task_id: string | null
          user_goal: string | null
          user_ip: string | null
        }
        Insert: {
          analysis_result?: string | null
          client_id?: string | null
          conversation_id?: string | null
          created_at?: string | null
          data_volume_estimate?: string | null
          id?: string
          input_data?: string | null
          issues_identified?: string[] | null
          modules_recommended?: string[] | null
          project_id?: string | null
          session_id?: string | null
          solution_summary?: string | null
          task_id?: string | null
          user_goal?: string | null
          user_ip?: string | null
        }
        Update: {
          analysis_result?: string | null
          client_id?: string | null
          conversation_id?: string | null
          created_at?: string | null
          data_volume_estimate?: string | null
          id?: string
          input_data?: string | null
          issues_identified?: string[] | null
          modules_recommended?: string[] | null
          project_id?: string | null
          session_id?: string | null
          solution_summary?: string | null
          task_id?: string | null
          user_goal?: string | null
          user_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_history_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_history_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          billing_terms: string | null
          client_code: string | null
          client_name: string
          created_at: string | null
          currency: string | null
          data_types: string[] | null
          hourly_rate: number | null
          id: string
          industry: string | null
          notes: string | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          reference_data_location: string | null
          special_requirements: string | null
          status: string | null
          trillium_platform: string | null
          trillium_repository: string | null
          trillium_server_host: string | null
          trillium_server_port: number | null
          trillium_version: string | null
          typical_data_volume: string | null
          updated_at: string | null
        }
        Insert: {
          billing_terms?: string | null
          client_code?: string | null
          client_name: string
          created_at?: string | null
          currency?: string | null
          data_types?: string[] | null
          hourly_rate?: number | null
          id?: string
          industry?: string | null
          notes?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          reference_data_location?: string | null
          special_requirements?: string | null
          status?: string | null
          trillium_platform?: string | null
          trillium_repository?: string | null
          trillium_server_host?: string | null
          trillium_server_port?: number | null
          trillium_version?: string | null
          typical_data_volume?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_terms?: string | null
          client_code?: string | null
          client_name?: string
          created_at?: string | null
          currency?: string | null
          data_types?: string[] | null
          hourly_rate?: number | null
          id?: string
          industry?: string | null
          notes?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          reference_data_location?: string | null
          special_requirements?: string | null
          status?: string | null
          trillium_platform?: string | null
          trillium_repository?: string | null
          trillium_server_host?: string | null
          trillium_server_port?: number | null
          trillium_version?: string | null
          typical_data_volume?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      connection_guides: {
        Row: {
          id: string
          platform: string
          requirement_count: number | null
          requirements: string[] | null
          step_count: number | null
          steps: Json | null
          title: string
          troubleshooting: Json | null
        }
        Insert: {
          id: string
          platform: string
          requirement_count?: number | null
          requirements?: string[] | null
          step_count?: number | null
          steps?: Json | null
          title: string
          troubleshooting?: Json | null
        }
        Update: {
          id?: string
          platform?: string
          requirement_count?: number | null
          requirements?: string[] | null
          step_count?: number | null
          steps?: Json | null
          title?: string
          troubleshooting?: Json | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          billable: boolean | null
          client_id: string | null
          created_at: string | null
          id: string
          jcl_generated: string | null
          last_updated: string | null
          message_count: number | null
          messages: Json | null
          modules_recommended: string[] | null
          project_id: string | null
          session_id: string
          solution_provided: string | null
          summary: string | null
          task_id: string | null
          time_spent_minutes: number | null
          title: string | null
          topics: string[] | null
          user_ip: string | null
        }
        Insert: {
          billable?: boolean | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          jcl_generated?: string | null
          last_updated?: string | null
          message_count?: number | null
          messages?: Json | null
          modules_recommended?: string[] | null
          project_id?: string | null
          session_id: string
          solution_provided?: string | null
          summary?: string | null
          task_id?: string | null
          time_spent_minutes?: number | null
          title?: string | null
          topics?: string[] | null
          user_ip?: string | null
        }
        Update: {
          billable?: boolean | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          jcl_generated?: string | null
          last_updated?: string | null
          message_count?: number | null
          messages?: Json | null
          modules_recommended?: string[] | null
          project_id?: string | null
          session_id?: string
          solution_provided?: string | null
          summary?: string | null
          task_id?: string | null
          time_spent_minutes?: number | null
          title?: string | null
          topics?: string[] | null
          user_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          client_id: string | null
          comment: string | null
          conversation_id: string | null
          created_at: string | null
          feedback_type: string | null
          helpful: boolean | null
          id: string
          message_index: number | null
          rating: number | null
          task_id: string | null
        }
        Insert: {
          client_id?: string | null
          comment?: string | null
          conversation_id?: string | null
          created_at?: string | null
          feedback_type?: string | null
          helpful?: boolean | null
          id?: string
          message_index?: number | null
          rating?: number | null
          task_id?: string | null
        }
        Update: {
          client_id?: string | null
          comment?: string | null
          conversation_id?: string | null
          created_at?: string | null
          feedback_type?: string | null
          helpful?: boolean | null
          id?: string
          message_index?: number | null
          rating?: number | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          category: string
          common_parameters: Json | null
          description: string
          id: string
          jcl_template: string | null
          key_features: string[] | null
          name: string
          purpose: string | null
          search_keywords: string[] | null
          typical_issues: Json | null
          use_cases: Json | null
          when_to_use: string[] | null
          works_well_with: string[] | null
        }
        Insert: {
          category: string
          common_parameters?: Json | null
          description: string
          id: string
          jcl_template?: string | null
          key_features?: string[] | null
          name: string
          purpose?: string | null
          search_keywords?: string[] | null
          typical_issues?: Json | null
          use_cases?: Json | null
          when_to_use?: string[] | null
          works_well_with?: string[] | null
        }
        Update: {
          category?: string
          common_parameters?: Json | null
          description?: string
          id?: string
          jcl_template?: string | null
          key_features?: string[] | null
          name?: string
          purpose?: string | null
          search_keywords?: string[] | null
          typical_issues?: Json | null
          use_cases?: Json | null
          when_to_use?: string[] | null
          works_well_with?: string[] | null
        }
        Relationships: []
      }
      normalized_names: {
        Row: {
          created_at: string | null
          id: string
          keep_hyphen: boolean
          normalized: string
          query: string
          rationale: string | null
          sources: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          keep_hyphen: boolean
          normalized: string
          query: string
          rationale?: string | null
          sources?: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          keep_hyphen?: boolean
          normalized?: string
          query?: string
          rationale?: string | null
          sources?: Json
        }
        Relationships: []
      }
      poc_achievements: {
        Row: {
          achievement_description: string | null
          achievement_icon: string | null
          achievement_name: string
          achievement_type: string
          earned_at: string | null
          id: string
          metadata: Json | null
          poc_project_id: string | null
          points: number | null
          user_id: string | null
        }
        Insert: {
          achievement_description?: string | null
          achievement_icon?: string | null
          achievement_name: string
          achievement_type: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          poc_project_id?: string | null
          points?: number | null
          user_id?: string | null
        }
        Update: {
          achievement_description?: string | null
          achievement_icon?: string | null
          achievement_name?: string
          achievement_type?: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          poc_project_id?: string | null
          points?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_achievements_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_ai_insights: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          content: string
          generated_at: string | null
          id: string
          insight_type: string | null
          metadata: Json | null
          poc_project_id: string | null
          priority: string | null
          status: string | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          content: string
          generated_at?: string | null
          id?: string
          insight_type?: string | null
          metadata?: Json | null
          poc_project_id?: string | null
          priority?: string | null
          status?: string | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          content?: string
          generated_at?: string | null
          id?: string
          insight_type?: string | null
          metadata?: Json | null
          poc_project_id?: string | null
          priority?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_ai_insights_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_ai_quality_scores: {
        Row: {
          analyzed_at: string | null
          block_id: string
          critical_issues: string | null
          gaps_identified: string | null
          id: string
          poc_project_id: string
          quality_score: number | null
          recommendations: string | null
          strong_areas: string | null
        }
        Insert: {
          analyzed_at?: string | null
          block_id: string
          critical_issues?: string | null
          gaps_identified?: string | null
          id?: string
          poc_project_id: string
          quality_score?: number | null
          recommendations?: string | null
          strong_areas?: string | null
        }
        Update: {
          analyzed_at?: string | null
          block_id?: string
          critical_issues?: string | null
          gaps_identified?: string | null
          id?: string
          poc_project_id?: string
          quality_score?: number | null
          recommendations?: string | null
          strong_areas?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_ai_quality_scores_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_ai_scope_sessions: {
        Row: {
          ai_recommendations: Json | null
          completeness_score: number | null
          created_at: string | null
          generated_scope: Json | null
          id: string
          is_completed: boolean | null
          poc_project_id: string | null
          session_data: Json
          step_completed: number | null
          total_steps: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_recommendations?: Json | null
          completeness_score?: number | null
          created_at?: string | null
          generated_scope?: Json | null
          id?: string
          is_completed?: boolean | null
          poc_project_id?: string | null
          session_data: Json
          step_completed?: number | null
          total_steps?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_recommendations?: Json | null
          completeness_score?: number | null
          created_at?: string | null
          generated_scope?: Json | null
          id?: string
          is_completed?: boolean | null
          poc_project_id?: string | null
          session_data?: Json
          step_completed?: number | null
          total_steps?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_ai_scope_sessions_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_assumptions: {
        Row: {
          assumption_text: string
          created_at: string | null
          id: string
          owner_id: string | null
          poc_project_id: string
          risk_level: string
          updated_at: string | null
          validated_at: string | null
          validation_plan: string | null
          validation_status: string | null
        }
        Insert: {
          assumption_text: string
          created_at?: string | null
          id?: string
          owner_id?: string | null
          poc_project_id: string
          risk_level: string
          updated_at?: string | null
          validated_at?: string | null
          validation_plan?: string | null
          validation_status?: string | null
        }
        Update: {
          assumption_text?: string
          created_at?: string | null
          id?: string
          owner_id?: string | null
          poc_project_id?: string
          risk_level?: string
          updated_at?: string | null
          validated_at?: string | null
          validation_plan?: string | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_assumptions_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_audit_log: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string
          entity_type: string
          field_name: string | null
          id: string
          new_value: string | null
          old_value: string | null
          poc_project_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          field_name?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          poc_project_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          field_name?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          poc_project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_audit_log_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_baseline_measurements: {
        Row: {
          average_value: number | null
          created_at: string | null
          distribution_data: Json | null
          evidence_files: Json | null
          id: string
          max_value: number | null
          measurement_method: string | null
          measurement_period_end: string | null
          measurement_period_start: string | null
          median_value: number | null
          min_value: number | null
          percentile_95: number | null
          sample_size: number | null
          success_criteria_id: string
          validated: boolean | null
          validated_at: string | null
        }
        Insert: {
          average_value?: number | null
          created_at?: string | null
          distribution_data?: Json | null
          evidence_files?: Json | null
          id?: string
          max_value?: number | null
          measurement_method?: string | null
          measurement_period_end?: string | null
          measurement_period_start?: string | null
          median_value?: number | null
          min_value?: number | null
          percentile_95?: number | null
          sample_size?: number | null
          success_criteria_id: string
          validated?: boolean | null
          validated_at?: string | null
        }
        Update: {
          average_value?: number | null
          created_at?: string | null
          distribution_data?: Json | null
          evidence_files?: Json | null
          id?: string
          max_value?: number | null
          measurement_method?: string | null
          measurement_period_end?: string | null
          measurement_period_start?: string | null
          median_value?: number | null
          min_value?: number | null
          percentile_95?: number | null
          sample_size?: number | null
          success_criteria_id?: string
          validated?: boolean | null
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_baseline_measurements_success_criteria_id_fkey"
            columns: ["success_criteria_id"]
            isOneToOne: false
            referencedRelation: "poc_success_criteria"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_billing_rates: {
        Row: {
          created_at: string | null
          currency: string | null
          effective_date: string
          end_date: string | null
          hourly_rate: number
          id: string
          metadata: Json | null
          organization_id: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          effective_date: string
          end_date?: string | null
          hourly_rate: number
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          effective_date?: string
          end_date?: string | null
          hourly_rate?: number
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_billing_rates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "poc_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_budget_tracking: {
        Row: {
          budget_amount: number
          category: string
          committed_amount: number | null
          created_at: string | null
          id: string
          poc_project_id: string
          remaining_amount: number | null
          spent_amount: number | null
          updated_at: string | null
        }
        Insert: {
          budget_amount: number
          category: string
          committed_amount?: number | null
          created_at?: string | null
          id?: string
          poc_project_id: string
          remaining_amount?: number | null
          spent_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          budget_amount?: number
          category?: string
          committed_amount?: number | null
          created_at?: string | null
          id?: string
          poc_project_id?: string
          remaining_amount?: number | null
          spent_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_budget_tracking_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_building_block_progress: {
        Row: {
          block_id: string
          completed_at: string | null
          completed_tasks: number | null
          completion_percentage: number | null
          created_at: string | null
          id: string
          last_worked_on: string | null
          metadata: Json | null
          poc_phase_id: string | null
          poc_project_id: string | null
          started_at: string | null
          status: string | null
          total_tasks: number | null
          updated_at: string | null
        }
        Insert: {
          block_id: string
          completed_at?: string | null
          completed_tasks?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          last_worked_on?: string | null
          metadata?: Json | null
          poc_phase_id?: string | null
          poc_project_id?: string | null
          started_at?: string | null
          status?: string | null
          total_tasks?: number | null
          updated_at?: string | null
        }
        Update: {
          block_id?: string
          completed_at?: string | null
          completed_tasks?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          last_worked_on?: string | null
          metadata?: Json | null
          poc_phase_id?: string | null
          poc_project_id?: string | null
          started_at?: string | null
          status?: string | null
          total_tasks?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_building_block_progress_poc_phase_id_fkey"
            columns: ["poc_phase_id"]
            isOneToOne: false
            referencedRelation: "poc_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_building_block_progress_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_building_blocks: {
        Row: {
          block_description: string | null
          block_icon: string | null
          block_id: string
          block_name: string
          created_at: string | null
          estimated_hours: number | null
          id: string
          is_mandatory: boolean | null
          order_index: number
          phase_number: number
          total_tasks: number | null
        }
        Insert: {
          block_description?: string | null
          block_icon?: string | null
          block_id: string
          block_name: string
          created_at?: string | null
          estimated_hours?: number | null
          id?: string
          is_mandatory?: boolean | null
          order_index: number
          phase_number: number
          total_tasks?: number | null
        }
        Update: {
          block_description?: string | null
          block_icon?: string | null
          block_id?: string
          block_name?: string
          created_at?: string | null
          estimated_hours?: number | null
          id?: string
          is_mandatory?: boolean | null
          order_index?: number
          phase_number?: number
          total_tasks?: number | null
        }
        Relationships: []
      }
      poc_calendar_events: {
        Row: {
          attendees: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string
          event_type: string | null
          id: string
          location: string | null
          metadata: Json | null
          poc_project_id: string | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          attendees?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time: string
          event_type?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          poc_project_id?: string | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          attendees?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string
          event_type?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          poc_project_id?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_calendar_events_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_charter_approvals: {
        Row: {
          approval_order: number
          approved_at: string | null
          approver_id: string
          comments: string | null
          created_at: string | null
          id: string
          poc_project_id: string
          status: string | null
        }
        Insert: {
          approval_order: number
          approved_at?: string | null
          approver_id: string
          comments?: string | null
          created_at?: string | null
          id?: string
          poc_project_id: string
          status?: string | null
        }
        Update: {
          approval_order?: number
          approved_at?: string | null
          approver_id?: string
          comments?: string | null
          created_at?: string | null
          id?: string
          poc_project_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_charter_approvals_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_communication_schedule: {
        Row: {
          agenda_template: string | null
          communication_type: string
          created_at: string | null
          day_of_week: number | null
          frequency: string | null
          id: string
          is_recurring: boolean | null
          poc_project_id: string
          recipients: Json | null
          time_of_day: string | null
          title: string
        }
        Insert: {
          agenda_template?: string | null
          communication_type: string
          created_at?: string | null
          day_of_week?: number | null
          frequency?: string | null
          id?: string
          is_recurring?: boolean | null
          poc_project_id: string
          recipients?: Json | null
          time_of_day?: string | null
          title: string
        }
        Update: {
          agenda_template?: string | null
          communication_type?: string
          created_at?: string | null
          day_of_week?: number | null
          frequency?: string | null
          id?: string
          is_recurring?: boolean | null
          poc_project_id?: string
          recipients?: Json | null
          time_of_day?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_communication_schedule_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_constraints: {
        Row: {
          constraint_text: string
          constraint_type: string
          created_at: string | null
          id: string
          is_hard_limit: boolean | null
          poc_project_id: string
        }
        Insert: {
          constraint_text: string
          constraint_type: string
          created_at?: string | null
          id?: string
          is_hard_limit?: boolean | null
          poc_project_id: string
        }
        Update: {
          constraint_text?: string
          constraint_type?: string
          created_at?: string | null
          id?: string
          is_hard_limit?: boolean | null
          poc_project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_constraints_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_document_versions: {
        Row: {
          changes_summary: string | null
          created_at: string | null
          created_by: string | null
          document_id: string
          file_path: string | null
          id: string
          version_number: string
        }
        Insert: {
          changes_summary?: string | null
          created_at?: string | null
          created_by?: string | null
          document_id: string
          file_path?: string | null
          id?: string
          version_number: string
        }
        Update: {
          changes_summary?: string | null
          created_at?: string | null
          created_by?: string | null
          document_id?: string
          file_path?: string | null
          id?: string
          version_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "poc_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_documents: {
        Row: {
          description: string | null
          document_type: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          metadata: Json | null
          poc_project_id: string | null
          title: string
          uploaded_at: string | null
          uploaded_by: string | null
          vendor_id: string | null
        }
        Insert: {
          description?: string | null
          document_type?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          poc_project_id?: string | null
          title: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          vendor_id?: string | null
        }
        Update: {
          description?: string | null
          document_type?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          poc_project_id?: string | null
          title?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_documents_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "poc_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_expenses: {
        Row: {
          amount: number
          budget_category_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          expense_date: string
          id: string
          poc_project_id: string
          status: string | null
          vendor: string | null
        }
        Insert: {
          amount: number
          budget_category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expense_date: string
          id?: string
          poc_project_id: string
          status?: string | null
          vendor?: string | null
        }
        Update: {
          amount?: number
          budget_category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          poc_project_id?: string
          status?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_expenses_budget_category_id_fkey"
            columns: ["budget_category_id"]
            isOneToOne: false
            referencedRelation: "poc_budget_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_expenses_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_integrations: {
        Row: {
          connection_config: Json | null
          created_at: string | null
          id: string
          integration_type: string
          is_connected: boolean | null
          last_sync_at: string | null
          poc_project_id: string
        }
        Insert: {
          connection_config?: Json | null
          created_at?: string | null
          id?: string
          integration_type: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          poc_project_id: string
        }
        Update: {
          connection_config?: Json | null
          created_at?: string | null
          id?: string
          integration_type?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          poc_project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_integrations_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_issues: {
        Row: {
          assigned_to: string | null
          contingency_plan: string | null
          created_at: string | null
          description: string | null
          early_warning_indicators: string | null
          id: string
          identified_at: string | null
          identified_by: string | null
          impact: string | null
          issue_type: string | null
          metadata: Json | null
          mitigation_budget: number | null
          mitigation_strategy: string | null
          poc_project_id: string | null
          probability: string | null
          residual_impact: string | null
          residual_probability: string | null
          residual_risk_score: string | null
          resolution: string | null
          resolved_at: string | null
          risk_score: string | null
          severity: string | null
          status: string | null
          title: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          contingency_plan?: string | null
          created_at?: string | null
          description?: string | null
          early_warning_indicators?: string | null
          id?: string
          identified_at?: string | null
          identified_by?: string | null
          impact?: string | null
          issue_type?: string | null
          metadata?: Json | null
          mitigation_budget?: number | null
          mitigation_strategy?: string | null
          poc_project_id?: string | null
          probability?: string | null
          residual_impact?: string | null
          residual_probability?: string | null
          residual_risk_score?: string | null
          resolution?: string | null
          resolved_at?: string | null
          risk_score?: string | null
          severity?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          contingency_plan?: string | null
          created_at?: string | null
          description?: string | null
          early_warning_indicators?: string | null
          id?: string
          identified_at?: string | null
          identified_by?: string | null
          impact?: string | null
          issue_type?: string | null
          metadata?: Json | null
          mitigation_budget?: number | null
          mitigation_strategy?: string | null
          poc_project_id?: string | null
          probability?: string | null
          residual_impact?: string | null
          residual_probability?: string | null
          residual_risk_score?: string | null
          resolution?: string | null
          resolved_at?: string | null
          risk_score?: string | null
          severity?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_issues_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_issues_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "poc_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_knowledge_base: {
        Row: {
          content: string
          content_type: string | null
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          title: string
        }
        Insert: {
          content: string
          content_type?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          title: string
        }
        Update: {
          content?: string
          content_type?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          title?: string
        }
        Relationships: []
      }
      poc_metrics: {
        Row: {
          actual_value: number | null
          baseline_value: number | null
          created_at: string | null
          id: string
          measured_by: string | null
          measurement_date: string | null
          metadata: Json | null
          metric_name: string
          notes: string | null
          poc_project_id: string | null
          success_criterion_id: string | null
          target_value: number | null
          unit: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          actual_value?: number | null
          baseline_value?: number | null
          created_at?: string | null
          id?: string
          measured_by?: string | null
          measurement_date?: string | null
          metadata?: Json | null
          metric_name: string
          notes?: string | null
          poc_project_id?: string | null
          success_criterion_id?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          actual_value?: number | null
          baseline_value?: number | null
          created_at?: string | null
          id?: string
          measured_by?: string | null
          measurement_date?: string | null
          metadata?: Json | null
          metric_name?: string
          notes?: string | null
          poc_project_id?: string | null
          success_criterion_id?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_metrics_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_metrics_success_criterion_id_fkey"
            columns: ["success_criterion_id"]
            isOneToOne: false
            referencedRelation: "poc_success_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_metrics_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "poc_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_pinned: boolean | null
          poc_project_id: string | null
          related_to_id: string | null
          related_to_type: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_pinned?: boolean | null
          poc_project_id?: string | null
          related_to_id?: string | null
          related_to_type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_pinned?: boolean | null
          poc_project_id?: string | null
          related_to_id?: string | null
          related_to_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_notes_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_organizations: {
        Row: {
          created_at: string | null
          id: string
          industry: string | null
          name: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry?: string | null
          name: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          industry?: string | null
          name?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      poc_phase_approvals: {
        Row: {
          approval_type: string
          approved_at: string | null
          approver_id: string | null
          comments: string | null
          created_at: string | null
          id: string
          poc_phase_id: string | null
          poc_project_id: string | null
          status: string | null
        }
        Insert: {
          approval_type: string
          approved_at?: string | null
          approver_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          poc_phase_id?: string | null
          poc_project_id?: string | null
          status?: string | null
        }
        Update: {
          approval_type?: string
          approved_at?: string | null
          approver_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          poc_phase_id?: string | null
          poc_project_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_phase_approvals_poc_phase_id_fkey"
            columns: ["poc_phase_id"]
            isOneToOne: false
            referencedRelation: "poc_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_phase_approvals_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_phases: {
        Row: {
          ai_completeness_score: number | null
          can_proceed_to_next: boolean | null
          completion_badges: Json | null
          completion_percentage: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          estimated_duration_days: number | null
          id: string
          metadata: Json | null
          name: string
          order_index: number | null
          phase_icon: string | null
          phase_number: number
          poc_project_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ai_completeness_score?: number | null
          can_proceed_to_next?: boolean | null
          completion_badges?: Json | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          estimated_duration_days?: number | null
          id?: string
          metadata?: Json | null
          name: string
          order_index?: number | null
          phase_icon?: string | null
          phase_number: number
          poc_project_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_completeness_score?: number | null
          can_proceed_to_next?: boolean | null
          completion_badges?: Json | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          estimated_duration_days?: number | null
          id?: string
          metadata?: Json | null
          name?: string
          order_index?: number | null
          phase_icon?: string | null
          phase_number?: number
          poc_project_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_phases_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_projects: {
        Row: {
          budget: number | null
          charter_approved_at: string | null
          charter_approved_by: string | null
          charter_version: string | null
          competitive_landscape: string | null
          created_at: string | null
          created_by: string | null
          current_phase_id: string | null
          description: string | null
          end_date: string | null
          gamification_enabled: boolean | null
          id: string
          metadata: Json | null
          name: string
          onboarding_completed: boolean | null
          organization_id: string | null
          payback_period_months: number | null
          poc_type: string | null
          problem_annual_cost: number | null
          problem_clarity_score: number | null
          problem_quantified_impact: Json | null
          problem_statement: string | null
          roi_best_case: number | null
          roi_realistic: number | null
          roi_worst_case: number | null
          rollback_plan: string | null
          scope_builder_session_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          charter_approved_at?: string | null
          charter_approved_by?: string | null
          charter_version?: string | null
          competitive_landscape?: string | null
          created_at?: string | null
          created_by?: string | null
          current_phase_id?: string | null
          description?: string | null
          end_date?: string | null
          gamification_enabled?: boolean | null
          id?: string
          metadata?: Json | null
          name: string
          onboarding_completed?: boolean | null
          organization_id?: string | null
          payback_period_months?: number | null
          poc_type?: string | null
          problem_annual_cost?: number | null
          problem_clarity_score?: number | null
          problem_quantified_impact?: Json | null
          problem_statement?: string | null
          roi_best_case?: number | null
          roi_realistic?: number | null
          roi_worst_case?: number | null
          rollback_plan?: string | null
          scope_builder_session_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          charter_approved_at?: string | null
          charter_approved_by?: string | null
          charter_version?: string | null
          competitive_landscape?: string | null
          created_at?: string | null
          created_by?: string | null
          current_phase_id?: string | null
          description?: string | null
          end_date?: string | null
          gamification_enabled?: boolean | null
          id?: string
          metadata?: Json | null
          name?: string
          onboarding_completed?: boolean | null
          organization_id?: string | null
          payback_period_months?: number | null
          poc_type?: string | null
          problem_annual_cost?: number | null
          problem_clarity_score?: number | null
          problem_quantified_impact?: Json | null
          problem_statement?: string | null
          roi_best_case?: number | null
          roi_realistic?: number | null
          roi_worst_case?: number | null
          rollback_plan?: string | null
          scope_builder_session_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "poc_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_raci_matrix: {
        Row: {
          activity_name: string
          created_at: string | null
          id: string
          poc_project_id: string
          role_type: string
          stakeholder_id: string
        }
        Insert: {
          activity_name: string
          created_at?: string | null
          id?: string
          poc_project_id: string
          role_type: string
          stakeholder_id: string
        }
        Update: {
          activity_name?: string
          created_at?: string | null
          id?: string
          poc_project_id?: string
          role_type?: string
          stakeholder_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_raci_matrix_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_raci_matrix_stakeholder_id_fkey"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "poc_stakeholders"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_reminders: {
        Row: {
          action_url: string | null
          created_at: string | null
          dismissed_at: string | null
          id: string
          message: string
          metadata: Json | null
          poc_project_id: string | null
          priority: string | null
          read_at: string | null
          reminder_type: string
          scheduled_for: string
          sent_at: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          dismissed_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          poc_project_id?: string | null
          priority?: string | null
          read_at?: string | null
          reminder_type: string
          scheduled_for: string
          sent_at?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          dismissed_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          poc_project_id?: string | null
          priority?: string | null
          read_at?: string | null
          reminder_type?: string
          scheduled_for?: string
          sent_at?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_reminders_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_resource_capacity: {
        Row: {
          allocated_hours_bau: number | null
          allocated_hours_other: number | null
          allocated_hours_poc: number | null
          available_hours_per_week: number | null
          created_at: string | null
          id: string
          is_overallocated: boolean | null
          poc_project_id: string
          total_hours_per_week: number | null
          updated_at: string | null
          user_id: string
          utilization_percentage: number | null
        }
        Insert: {
          allocated_hours_bau?: number | null
          allocated_hours_other?: number | null
          allocated_hours_poc?: number | null
          available_hours_per_week?: number | null
          created_at?: string | null
          id?: string
          is_overallocated?: boolean | null
          poc_project_id: string
          total_hours_per_week?: number | null
          updated_at?: string | null
          user_id: string
          utilization_percentage?: number | null
        }
        Update: {
          allocated_hours_bau?: number | null
          allocated_hours_other?: number | null
          allocated_hours_poc?: number | null
          available_hours_per_week?: number | null
          created_at?: string | null
          id?: string
          is_overallocated?: boolean | null
          poc_project_id?: string
          total_hours_per_week?: number | null
          updated_at?: string | null
          user_id?: string
          utilization_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_resource_capacity_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_risk_dependencies: {
        Row: {
          cascade_probability: number | null
          child_risk_id: string
          created_at: string | null
          id: string
          parent_risk_id: string
        }
        Insert: {
          cascade_probability?: number | null
          child_risk_id: string
          created_at?: string | null
          id?: string
          parent_risk_id: string
        }
        Update: {
          cascade_probability?: number | null
          child_risk_id?: string
          created_at?: string | null
          id?: string
          parent_risk_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_risk_dependencies_child_risk_id_fkey"
            columns: ["child_risk_id"]
            isOneToOne: false
            referencedRelation: "poc_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_risk_dependencies_parent_risk_id_fkey"
            columns: ["parent_risk_id"]
            isOneToOne: false
            referencedRelation: "poc_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_risk_mitigation_actions: {
        Row: {
          action_description: string
          action_type: string | null
          created_at: string | null
          due_date: string | null
          id: string
          owner_id: string | null
          risk_id: string
          status: string | null
        }
        Insert: {
          action_description: string
          action_type?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          owner_id?: string | null
          risk_id: string
          status?: string | null
        }
        Update: {
          action_description?: string
          action_type?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          owner_id?: string | null
          risk_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_risk_mitigation_actions_risk_id_fkey"
            columns: ["risk_id"]
            isOneToOne: false
            referencedRelation: "poc_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_scope_changes: {
        Row: {
          change_number: number
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          id: string
          impact_budget: number | null
          impact_resources: string | null
          impact_timeline: string | null
          justification: string | null
          poc_project_id: string
          proposed_change: string
          risk_if_approved: string | null
          risk_if_rejected: string | null
          status: string | null
          submitted_at: string | null
          submitted_by: string | null
        }
        Insert: {
          change_number: number
          decided_at?: string | null
          decided_by?: string | null
          decision_notes?: string | null
          id?: string
          impact_budget?: number | null
          impact_resources?: string | null
          impact_timeline?: string | null
          justification?: string | null
          poc_project_id: string
          proposed_change: string
          risk_if_approved?: string | null
          risk_if_rejected?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
        }
        Update: {
          change_number?: number
          decided_at?: string | null
          decided_by?: string | null
          decision_notes?: string | null
          id?: string
          impact_budget?: number | null
          impact_resources?: string | null
          impact_timeline?: string | null
          justification?: string | null
          poc_project_id?: string
          proposed_change?: string
          risk_if_approved?: string | null
          risk_if_rejected?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_scope_changes_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_scope_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          item_name: string
          poc_project_id: string
          priority: number | null
          quadrant: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_name: string
          poc_project_id: string
          priority?: number | null
          quadrant: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_name?: string
          poc_project_id?: string
          priority?: number | null
          quadrant?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_scope_items_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_stakeholder_contacts: {
        Row: {
          contact_date: string
          contact_type: string
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          stakeholder_id: string
        }
        Insert: {
          contact_date?: string
          contact_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          stakeholder_id: string
        }
        Update: {
          contact_date?: string
          contact_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          stakeholder_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_stakeholder_contacts_stakeholder_id_fkey"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "poc_stakeholders"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_stakeholders: {
        Row: {
          added_at: string | null
          added_by: string | null
          backup_contact_id: string | null
          best_contact_time: string | null
          communication_frequency: string | null
          communication_preference: string | null
          contact_info: Json | null
          department: string | null
          detail_level: string | null
          engagement_score: number | null
          engagement_strategy: string | null
          id: string
          interest_level: string | null
          last_contact_date: string | null
          next_contact_due: string | null
          out_of_office_end: string | null
          out_of_office_start: string | null
          poc_project_id: string | null
          power_level: string | null
          preferred_contact_method: string | null
          responsibilities: string | null
          role: string | null
          timezone: string | null
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          added_by?: string | null
          backup_contact_id?: string | null
          best_contact_time?: string | null
          communication_frequency?: string | null
          communication_preference?: string | null
          contact_info?: Json | null
          department?: string | null
          detail_level?: string | null
          engagement_score?: number | null
          engagement_strategy?: string | null
          id?: string
          interest_level?: string | null
          last_contact_date?: string | null
          next_contact_due?: string | null
          out_of_office_end?: string | null
          out_of_office_start?: string | null
          poc_project_id?: string | null
          power_level?: string | null
          preferred_contact_method?: string | null
          responsibilities?: string | null
          role?: string | null
          timezone?: string | null
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          added_by?: string | null
          backup_contact_id?: string | null
          best_contact_time?: string | null
          communication_frequency?: string | null
          communication_preference?: string | null
          contact_info?: Json | null
          department?: string | null
          detail_level?: string | null
          engagement_score?: number | null
          engagement_strategy?: string | null
          id?: string
          interest_level?: string | null
          last_contact_date?: string | null
          next_contact_due?: string | null
          out_of_office_end?: string | null
          out_of_office_start?: string | null
          poc_project_id?: string | null
          power_level?: string | null
          preferred_contact_method?: string | null
          responsibilities?: string | null
          role?: string | null
          timezone?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_stakeholders_backup_contact_id_fkey"
            columns: ["backup_contact_id"]
            isOneToOne: false
            referencedRelation: "poc_stakeholders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_stakeholders_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_status_reports: {
        Row: {
          accomplishments: string | null
          ai_generated: boolean | null
          created_at: string | null
          created_by: string | null
          executive_summary: string | null
          id: string
          in_progress: string | null
          metrics: Json | null
          next_week_plan: string | null
          poc_project_id: string
          report_period_end: string
          report_period_start: string
          risks_issues: string | null
        }
        Insert: {
          accomplishments?: string | null
          ai_generated?: boolean | null
          created_at?: string | null
          created_by?: string | null
          executive_summary?: string | null
          id?: string
          in_progress?: string | null
          metrics?: Json | null
          next_week_plan?: string | null
          poc_project_id: string
          report_period_end: string
          report_period_start: string
          risks_issues?: string | null
        }
        Update: {
          accomplishments?: string | null
          ai_generated?: boolean | null
          created_at?: string | null
          created_by?: string | null
          executive_summary?: string | null
          id?: string
          in_progress?: string | null
          metrics?: Json | null
          next_week_plan?: string | null
          poc_project_id?: string
          report_period_end?: string
          report_period_start?: string
          risks_issues?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_status_reports_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_success_criteria: {
        Row: {
          ai_suggestions: string | null
          category: string | null
          created_at: string | null
          criterion: string
          description: string | null
          id: string
          is_achievable: boolean | null
          is_mandatory: boolean | null
          is_measurable: boolean | null
          is_relevant: boolean | null
          is_specific: boolean | null
          is_time_bound: boolean | null
          measurement_method: string | null
          order_index: number | null
          poc_project_id: string | null
          smart_score: number | null
          target_value: string | null
          threshold_type: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          ai_suggestions?: string | null
          category?: string | null
          created_at?: string | null
          criterion: string
          description?: string | null
          id?: string
          is_achievable?: boolean | null
          is_mandatory?: boolean | null
          is_measurable?: boolean | null
          is_relevant?: boolean | null
          is_specific?: boolean | null
          is_time_bound?: boolean | null
          measurement_method?: string | null
          order_index?: number | null
          poc_project_id?: string | null
          smart_score?: number | null
          target_value?: string | null
          threshold_type?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          ai_suggestions?: string | null
          category?: string | null
          created_at?: string | null
          criterion?: string
          description?: string | null
          id?: string
          is_achievable?: boolean | null
          is_mandatory?: boolean | null
          is_measurable?: boolean | null
          is_relevant?: boolean | null
          is_specific?: boolean | null
          is_time_bound?: boolean | null
          measurement_method?: string | null
          order_index?: number | null
          poc_project_id?: string | null
          smart_score?: number | null
          target_value?: string | null
          threshold_type?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_success_criteria_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_task_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          id: string
          mentions: Json | null
          task_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          id?: string
          mentions?: Json | null
          task_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          id?: string
          mentions?: Json | null
          task_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "poc_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_task_dependencies: {
        Row: {
          created_at: string | null
          dependency_type: string | null
          depends_on_task_id: string | null
          id: string
          task_id: string | null
        }
        Insert: {
          created_at?: string | null
          dependency_type?: string | null
          depends_on_task_id?: string | null
          id?: string
          task_id?: string | null
        }
        Update: {
          created_at?: string | null
          dependency_type?: string | null
          depends_on_task_id?: string | null
          id?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "poc_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "poc_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_task_dependencies_advanced: {
        Row: {
          created_at: string | null
          dependency_type: string | null
          id: string
          is_critical_path: boolean | null
          lag_days: number | null
          predecessor_task_id: string
          successor_task_id: string
        }
        Insert: {
          created_at?: string | null
          dependency_type?: string | null
          id?: string
          is_critical_path?: boolean | null
          lag_days?: number | null
          predecessor_task_id: string
          successor_task_id: string
        }
        Update: {
          created_at?: string | null
          dependency_type?: string | null
          id?: string
          is_critical_path?: boolean | null
          lag_days?: number | null
          predecessor_task_id?: string
          successor_task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_task_dependencies_advanced_predecessor_task_id_fkey"
            columns: ["predecessor_task_id"]
            isOneToOne: false
            referencedRelation: "poc_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_task_dependencies_advanced_successor_task_id_fkey"
            columns: ["successor_task_id"]
            isOneToOne: false
            referencedRelation: "poc_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_task_watchers: {
        Row: {
          created_at: string | null
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_task_watchers_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "poc_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_tasks: {
        Row: {
          actual_hours: number | null
          ai_quality_score: number | null
          approved_at: string | null
          approved_by: string | null
          assigned_to: string | null
          block_id: string | null
          block_name: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          dependencies: Json | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          estimated_minutes: number | null
          id: string
          metadata: Json | null
          order_index: number | null
          poc_phase_id: string | null
          priority: string | null
          requires_approval: boolean | null
          status: string | null
          sub_task_group: string | null
          sub_task_order: number | null
          task_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          ai_quality_score?: number | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_to?: string | null
          block_id?: string | null
          block_name?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          dependencies?: Json | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          estimated_minutes?: number | null
          id?: string
          metadata?: Json | null
          order_index?: number | null
          poc_phase_id?: string | null
          priority?: string | null
          requires_approval?: boolean | null
          status?: string | null
          sub_task_group?: string | null
          sub_task_order?: number | null
          task_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          ai_quality_score?: number | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_to?: string | null
          block_id?: string | null
          block_name?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          dependencies?: Json | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          estimated_minutes?: number | null
          id?: string
          metadata?: Json | null
          order_index?: number | null
          poc_phase_id?: string | null
          priority?: string | null
          requires_approval?: boolean | null
          status?: string | null
          sub_task_group?: string | null
          sub_task_order?: number | null
          task_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_tasks_poc_phase_id_fkey"
            columns: ["poc_phase_id"]
            isOneToOne: false
            referencedRelation: "poc_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          industry: string | null
          is_public: boolean | null
          name: string
          poc_type: string | null
          template_data: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          is_public?: boolean | null
          name: string
          poc_type?: string | null
          template_data: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          is_public?: boolean | null
          name?: string
          poc_type?: string | null
          template_data?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      poc_time_entries: {
        Row: {
          billable: boolean | null
          created_at: string | null
          date: string
          description: string | null
          hours: number
          id: string
          poc_project_id: string | null
          poc_task_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billable?: boolean | null
          created_at?: string | null
          date: string
          description?: string | null
          hours: number
          id?: string
          poc_project_id?: string | null
          poc_task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billable?: boolean | null
          created_at?: string | null
          date?: string
          description?: string | null
          hours?: number
          id?: string
          poc_project_id?: string | null
          poc_task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_time_entries_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_time_entries_poc_task_id_fkey"
            columns: ["poc_task_id"]
            isOneToOne: false
            referencedRelation: "poc_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_user_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          poc_project_id: string | null
          total_tasks_completed: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          poc_project_id?: string | null
          total_tasks_completed?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          poc_project_id?: string | null
          total_tasks_completed?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_user_streaks_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_vendor_scores: {
        Row: {
          evidence: string | null
          id: string
          max_score: number | null
          score: number | null
          scored_at: string | null
          scored_by: string | null
          success_criterion_id: string | null
          updated_at: string | null
          vendor_id: string | null
          weighted_score: number | null
        }
        Insert: {
          evidence?: string | null
          id?: string
          max_score?: number | null
          score?: number | null
          scored_at?: string | null
          scored_by?: string | null
          success_criterion_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          weighted_score?: number | null
        }
        Update: {
          evidence?: string | null
          id?: string
          max_score?: number | null
          score?: number | null
          scored_at?: string | null
          scored_by?: string | null
          success_criterion_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          weighted_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_vendor_scores_success_criterion_id_fkey"
            columns: ["success_criterion_id"]
            isOneToOne: false
            referencedRelation: "poc_success_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poc_vendor_scores_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "poc_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_vendors: {
        Row: {
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          name: string
          notes: string | null
          poc_project_id: string | null
          solution_name: string | null
          status: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name: string
          notes?: string | null
          poc_project_id?: string | null
          solution_name?: string | null
          status?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          notes?: string | null
          poc_project_id?: string | null
          solution_name?: string | null
          status?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poc_vendors_poc_project_id_fkey"
            columns: ["poc_project_id"]
            isOneToOne: false
            referencedRelation: "poc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      pro_actions: {
        Row: {
          action: string
          created_at: string | null
          id: string
          payload: Json
          session_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          payload: Json
          session_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          payload?: Json
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pro_actions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "pro_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      pro_sessions: {
        Row: {
          created_at: string | null
          id: string
          mode: string
          request: Json
          response: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mode: string
          request: Json
          response?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mode?: string
          request?: Json
          response?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          actual_completion_date: string | null
          actual_hours: number | null
          budget_amount: number | null
          client_id: string
          created_at: string | null
          data_source: string | null
          description: string | null
          estimated_hours: number | null
          expected_volume: string | null
          id: string
          notes: string | null
          objective: string | null
          priority: string | null
          project_code: string | null
          project_name: string
          start_date: string | null
          status: string | null
          target_completion_date: string | null
          updated_at: string | null
        }
        Insert: {
          actual_completion_date?: string | null
          actual_hours?: number | null
          budget_amount?: number | null
          client_id: string
          created_at?: string | null
          data_source?: string | null
          description?: string | null
          estimated_hours?: number | null
          expected_volume?: string | null
          id?: string
          notes?: string | null
          objective?: string | null
          priority?: string | null
          project_code?: string | null
          project_name: string
          start_date?: string | null
          status?: string | null
          target_completion_date?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_completion_date?: string | null
          actual_hours?: number | null
          budget_amount?: number | null
          client_id?: string
          created_at?: string | null
          data_source?: string | null
          description?: string | null
          estimated_hours?: number | null
          expected_volume?: string | null
          id?: string
          notes?: string | null
          objective?: string | null
          priority?: string | null
          project_code?: string | null
          project_name?: string
          start_date?: string | null
          status?: string | null
          target_completion_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ref_archives: {
        Row: {
          answer_md: string
          citations: Json | null
          created_at: string | null
          id: string
          model_used: string | null
          question: string
          tags: string[] | null
        }
        Insert: {
          answer_md: string
          citations?: Json | null
          created_at?: string | null
          id?: string
          model_used?: string | null
          question: string
          tags?: string[] | null
        }
        Update: {
          answer_md?: string
          citations?: Json | null
          created_at?: string | null
          id?: string
          model_used?: string | null
          question?: string
          tags?: string[] | null
        }
        Relationships: []
      }
      ref_chunks: {
        Row: {
          content: string
          created_at: string | null
          doc_id: string | null
          embedding: string | null
          id: string
          ord: number | null
          page: number | null
          section: string | null
          tokens: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          doc_id?: string | null
          embedding?: string | null
          id?: string
          ord?: number | null
          page?: number | null
          section?: string | null
          tokens?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          doc_id?: string | null
          embedding?: string | null
          id?: string
          ord?: number | null
          page?: number | null
          section?: string | null
          tokens?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ref_chunks_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "ref_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      ref_documents: {
        Row: {
          created_at: string | null
          id: string
          mime_type: string | null
          path: string
          source: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mime_type?: string | null
          path: string
          source?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mime_type?: string | null
          path?: string
          source?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      releases: {
        Row: {
          closed_at: string | null
          comment_char: string | null
          country_code: string
          created_at: string | null
          header_comment: string | null
          id: string
          status: string
          tag: string
        }
        Insert: {
          closed_at?: string | null
          comment_char?: string | null
          country_code: string
          created_at?: string | null
          header_comment?: string | null
          id?: string
          status?: string
          tag: string
        }
        Update: {
          closed_at?: string | null
          comment_char?: string | null
          country_code?: string
          created_at?: string | null
          header_comment?: string | null
          id?: string
          status?: string
          tag?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          default_country_code: string | null
          id: boolean
          no_comma_reverse: boolean | null
          no_ordinal_street: string | null
          original_meanings_option: number | null
          parser_depth: number | null
        }
        Insert: {
          default_country_code?: string | null
          id?: boolean
          no_comma_reverse?: boolean | null
          no_ordinal_street?: string | null
          original_meanings_option?: number | null
          parser_depth?: number | null
        }
        Update: {
          default_country_code?: string | null
          id?: boolean
          no_comma_reverse?: boolean | null
          no_ordinal_street?: string | null
          original_meanings_option?: number | null
          parser_depth?: number | null
        }
        Relationships: []
      }
      solution_kits: {
        Row: {
          created_at: string | null
          id: string
          inputs: Json | null
          outputs: Json | null
          problem: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inputs?: Json | null
          outputs?: Json | null
          problem?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inputs?: Json | null
          outputs?: Json | null
          problem?: string | null
          title?: string | null
        }
        Relationships: []
      }
      solution_templates: {
        Row: {
          client_id: string | null
          configuration: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          jcl_template: string | null
          modules_used: string[] | null
          process_flow: Json | null
          success_rate: number | null
          tags: string[] | null
          template_name: string
          times_used: number | null
          updated_at: string | null
          use_case: string | null
        }
        Insert: {
          client_id?: string | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          jcl_template?: string | null
          modules_used?: string[] | null
          process_flow?: Json | null
          success_rate?: number | null
          tags?: string[] | null
          template_name: string
          times_used?: number | null
          updated_at?: string | null
          use_case?: string | null
        }
        Update: {
          client_id?: string | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          jcl_template?: string | null
          modules_used?: string[] | null
          process_flow?: Json | null
          success_rate?: number | null
          tags?: string[] | null
          template_name?: string
          times_used?: number | null
          updated_at?: string | null
          use_case?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solution_templates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_templates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_hours: number | null
          client_id: string
          completed_date: string | null
          configuration: Json | null
          conversation_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          issues_identified: string[] | null
          jcl_generated: string | null
          modules_used: string[] | null
          notes: string | null
          priority: string | null
          process_flow: Json | null
          project_id: string
          sample_data: string | null
          solution_recommended: string | null
          status: string | null
          task_name: string
          task_type: string | null
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          client_id: string
          completed_date?: string | null
          configuration?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          issues_identified?: string[] | null
          jcl_generated?: string | null
          modules_used?: string[] | null
          notes?: string | null
          priority?: string | null
          process_flow?: Json | null
          project_id: string
          sample_data?: string | null
          solution_recommended?: string | null
          status?: string | null
          task_name: string
          task_type?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          client_id?: string
          completed_date?: string | null
          configuration?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          issues_identified?: string[] | null
          jcl_generated?: string | null
          modules_used?: string[] | null
          notes?: string | null
          priority?: string | null
          process_flow?: Json | null
          project_id?: string
          sample_data?: string | null
          solution_recommended?: string | null
          status?: string | null
          task_name?: string
          task_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          ai_assisted: boolean | null
          billable: boolean | null
          billed: boolean | null
          client_id: string
          conversation_id: string | null
          created_at: string | null
          description: string
          end_time: string | null
          entry_date: string
          hourly_rate: number | null
          hours: number
          id: string
          invoice_id: string | null
          project_id: string | null
          start_time: string | null
          task_id: string | null
          work_type: string | null
        }
        Insert: {
          ai_assisted?: boolean | null
          billable?: boolean | null
          billed?: boolean | null
          client_id: string
          conversation_id?: string | null
          created_at?: string | null
          description: string
          end_time?: string | null
          entry_date?: string
          hourly_rate?: number | null
          hours: number
          id?: string
          invoice_id?: string | null
          project_id?: string | null
          start_time?: string | null
          task_id?: string | null
          work_type?: string | null
        }
        Update: {
          ai_assisted?: boolean | null
          billable?: boolean | null
          billed?: boolean | null
          client_id?: string
          conversation_id?: string | null
          created_at?: string | null
          description?: string
          end_time?: string | null
          entry_date?: string
          hourly_rate?: number | null
          hours?: number
          id?: string
          invoice_id?: string | null
          project_id?: string | null
          start_time?: string | null
          task_id?: string | null
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tmp_tablepat_raw: {
        Row: {
          attribute: string | null
          category: string | null
          export_rule: string | null
          pattern_id: string | null
          pattern_text: string | null
          pattern_type: string | null
          recode_rule: string | null
        }
        Insert: {
          attribute?: string | null
          category?: string | null
          export_rule?: string | null
          pattern_id?: string | null
          pattern_text?: string | null
          pattern_type?: string | null
          recode_rule?: string | null
        }
        Update: {
          attribute?: string | null
          category?: string | null
          export_rule?: string | null
          pattern_id?: string | null
          pattern_text?: string | null
          pattern_type?: string | null
          recode_rule?: string | null
        }
        Relationships: []
      }
      tmp_tokens_raw: {
        Row: {
          Abbreviation: string | null
          Category: string | null
          Description: string | null
          Token_Code: string | null
          Token_Name: string | null
        }
        Insert: {
          Abbreviation?: string | null
          Category?: string | null
          Description?: string | null
          Token_Code?: string | null
          Token_Name?: string | null
        }
        Update: {
          Abbreviation?: string | null
          Category?: string | null
          Description?: string | null
          Token_Code?: string | null
          Token_Name?: string | null
        }
        Relationships: []
      }
      tune7_change_table: {
        Row: {
          abbr: string
          category: string | null
          context: string | null
          expansion: string
          id: number
          notes: string | null
          version: string | null
        }
        Insert: {
          abbr: string
          category?: string | null
          context?: string | null
          expansion: string
          id?: number
          notes?: string | null
          version?: string | null
        }
        Update: {
          abbr?: string
          category?: string | null
          context?: string | null
          expansion?: string
          id?: number
          notes?: string | null
          version?: string | null
        }
        Relationships: []
      }
      tune7_cityzip: {
        Row: {
          city: string | null
          id: number
          region_code1: string | null
          region_code2: string | null
          state: string | null
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          id?: number
          region_code1?: string | null
          region_code2?: string | null
          state?: string | null
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          id?: number
          region_code1?: string | null
          region_code2?: string | null
          state?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      tune7_examples: {
        Row: {
          created_at: string | null
          expected_parse: Json | null
          id: number
          input_string: string
          notes: string | null
          pattern_refs: number[] | null
          related_tokens: string[] | null
          scenario_type: string | null
        }
        Insert: {
          created_at?: string | null
          expected_parse?: Json | null
          id?: number
          input_string: string
          notes?: string | null
          pattern_refs?: number[] | null
          related_tokens?: string[] | null
          scenario_type?: string | null
        }
        Update: {
          created_at?: string | null
          expected_parse?: Json | null
          id?: number
          input_string?: string
          notes?: string | null
          pattern_refs?: number[] | null
          related_tokens?: string[] | null
          scenario_type?: string | null
        }
        Relationships: []
      }
      tune7_geog_mapping: {
        Row: {
          attributes: string | null
          id: number
          label: string
          types: string[] | null
        }
        Insert: {
          attributes?: string | null
          id?: number
          label: string
          types?: string[] | null
        }
        Update: {
          attributes?: string | null
          id?: number
          label?: string
          types?: string[] | null
        }
        Relationships: []
      }
      tune7_geog_placecodes: {
        Row: {
          code1: string | null
          code2: string | null
          id: number
          name: string | null
          prefix: string
        }
        Insert: {
          code1?: string | null
          code2?: string | null
          id?: number
          name?: string | null
          prefix: string
        }
        Update: {
          code1?: string | null
          code2?: string | null
          id?: number
          name?: string | null
          prefix?: string
        }
        Relationships: []
      }
      tune7_joinlines_templates: {
        Row: {
          generated_example: string | null
          id: number
          left_code: string | null
          left_word: string | null
          notes: string | null
          priority: number | null
          right_code: string | null
          right_word: string | null
          source: string | null
          version: string | null
        }
        Insert: {
          generated_example?: string | null
          id?: number
          left_code?: string | null
          left_word?: string | null
          notes?: string | null
          priority?: number | null
          right_code?: string | null
          right_word?: string | null
          source?: string | null
          version?: string | null
        }
        Update: {
          generated_example?: string | null
          id?: number
          left_code?: string | null
          left_word?: string | null
          notes?: string | null
          priority?: number | null
          right_code?: string | null
          right_word?: string | null
          source?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tune7_joinlines_templates_left_code_fkey"
            columns: ["left_code"]
            isOneToOne: false
            referencedRelation: "tune7_token_dictionary"
            referencedColumns: ["token_code"]
          },
          {
            foreignKeyName: "tune7_joinlines_templates_right_code_fkey"
            columns: ["right_code"]
            isOneToOne: false
            referencedRelation: "tune7_token_dictionary"
            referencedColumns: ["token_code"]
          },
        ]
      }
      tune7_parameters: {
        Row: {
          category: string | null
          notes: string | null
          param: string
          value: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          notes?: string | null
          param: string
          value?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          notes?: string | null
          param?: string
          value?: string | null
          version?: string | null
        }
        Relationships: []
      }
      tune7_pattern_library: {
        Row: {
          examples: string | null
          id: number
          notes: string | null
          pattern_id: string | null
          pattern_text: string | null
          pattern_type: string | null
          recode_rule: string | null
          version: string | null
        }
        Insert: {
          examples?: string | null
          id?: number
          notes?: string | null
          pattern_id?: string | null
          pattern_text?: string | null
          pattern_type?: string | null
          recode_rule?: string | null
          version?: string | null
        }
        Update: {
          examples?: string | null
          id?: number
          notes?: string | null
          pattern_id?: string | null
          pattern_text?: string | null
          pattern_type?: string | null
          recode_rule?: string | null
          version?: string | null
        }
        Relationships: []
      }
      tune7_pmdump: {
        Row: {
          code_type: string | null
          id: number
          region_code1: string | null
          region_code2: string | null
          state_abbr: string | null
          zip_code: string | null
        }
        Insert: {
          code_type?: string | null
          id?: number
          region_code1?: string | null
          region_code2?: string | null
          state_abbr?: string | null
          zip_code?: string | null
        }
        Update: {
          code_type?: string | null
          id?: number
          region_code1?: string | null
          region_code2?: string | null
          state_abbr?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      tune7_reference: {
        Row: {
          attributes: string | null
          id: number
          label: string
          types: string | null
        }
        Insert: {
          attributes?: string | null
          id?: number
          label: string
          types?: string | null
        }
        Update: {
          attributes?: string | null
          id?: number
          label?: string
          types?: string | null
        }
        Relationships: []
      }
      tune7_release_details: {
        Row: {
          clwdpat_snippet: string | null
          id: number
          notes: string | null
          pattern_id: number | null
          pfprsdv_snippet: string | null
          release_id: number | null
          validated: boolean | null
        }
        Insert: {
          clwdpat_snippet?: string | null
          id?: number
          notes?: string | null
          pattern_id?: number | null
          pfprsdv_snippet?: string | null
          release_id?: number | null
          validated?: boolean | null
        }
        Update: {
          clwdpat_snippet?: string | null
          id?: number
          notes?: string | null
          pattern_id?: number | null
          pfprsdv_snippet?: string | null
          release_id?: number | null
          validated?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "tune7_release_details_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "tune7_pattern_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tune7_release_details_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "tune7_release_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      tune7_release_packages: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          joinline_count: number | null
          pattern_count: number | null
          release_name: string | null
          source_author: string | null
          source_type: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          joinline_count?: number | null
          pattern_count?: number | null
          release_name?: string | null
          source_author?: string | null
          source_type?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          joinline_count?: number | null
          pattern_count?: number | null
          release_name?: string | null
          source_author?: string | null
          source_type?: string | null
          status?: string | null
        }
        Relationships: []
      }
      tune7_tablecit: {
        Row: {
          city: string | null
          country: string | null
          id: number
          notes: string | null
          postal_code: string | null
          state: string | null
          version: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          id?: number
          notes?: string | null
          postal_code?: string | null
          state?: string | null
          version?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          id?: number
          notes?: string | null
          postal_code?: string | null
          state?: string | null
          version?: string | null
        }
        Relationships: []
      }
      tune7_titles_suffixes: {
        Row: {
          category: string | null
          id: number
          meaning: string | null
          notes: string | null
          token: string
          token_code: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          id?: number
          meaning?: string | null
          notes?: string | null
          token: string
          token_code?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          id?: number
          meaning?: string | null
          notes?: string | null
          token?: string
          token_code?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tune7_titles_suffixes_token_code_fkey"
            columns: ["token_code"]
            isOneToOne: false
            referencedRelation: "tune7_token_dictionary"
            referencedColumns: ["token_code"]
          },
        ]
      }
      tune7_token_dictionary: {
        Row: {
          examples: string | null
          id: number
          notes: string | null
          source_table: string | null
          token_code: string
          token_name: string | null
          usage_context: string | null
          version: string | null
        }
        Insert: {
          examples?: string | null
          id?: number
          notes?: string | null
          source_table?: string | null
          token_code: string
          token_name?: string | null
          usage_context?: string | null
          version?: string | null
        }
        Update: {
          examples?: string | null
          id?: number
          notes?: string | null
          source_table?: string | null
          token_code?: string
          token_name?: string | null
          usage_context?: string | null
          version?: string | null
        }
        Relationships: []
      }
      tune7_tune_history: {
        Row: {
          after_parse: string | null
          before_parse: string | null
          clwdpat_text: string | null
          created_at: string | null
          created_by: string | null
          entity_type: string | null
          id: number
          pattern_id: number | null
          pfprsdv_text: string | null
          release_ref: string | null
          tune_name: string
          validation_status: string | null
        }
        Insert: {
          after_parse?: string | null
          before_parse?: string | null
          clwdpat_text?: string | null
          created_at?: string | null
          created_by?: string | null
          entity_type?: string | null
          id?: number
          pattern_id?: number | null
          pfprsdv_text?: string | null
          release_ref?: string | null
          tune_name: string
          validation_status?: string | null
        }
        Update: {
          after_parse?: string | null
          before_parse?: string | null
          clwdpat_text?: string | null
          created_at?: string | null
          created_by?: string | null
          entity_type?: string | null
          id?: number
          pattern_id?: number | null
          pfprsdv_text?: string | null
          release_ref?: string | null
          tune_name?: string
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tune7_tune_history_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "tune7_pattern_library"
            referencedColumns: ["id"]
          },
        ]
      }
      tune7_tuning_sessions: {
        Row: {
          created_at: string | null
          detected_tokens: Json | null
          entity_type: string | null
          generated_clwdpat: string | null
          generated_pfprsdv: string | null
          id: number
          input_text: string | null
          session_name: string | null
          status: string | null
          suggested_joinlines: string | null
          suggested_pattern: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          detected_tokens?: Json | null
          entity_type?: string | null
          generated_clwdpat?: string | null
          generated_pfprsdv?: string | null
          id?: number
          input_text?: string | null
          session_name?: string | null
          status?: string | null
          suggested_joinlines?: string | null
          suggested_pattern?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          detected_tokens?: Json | null
          entity_type?: string | null
          generated_clwdpat?: string | null
          generated_pfprsdv?: string | null
          id?: number
          input_text?: string | null
          session_name?: string | null
          status?: string | null
          suggested_joinlines?: string | null
          suggested_pattern?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tune7_tuning_sessions_suggested_pattern_fkey"
            columns: ["suggested_pattern"]
            isOneToOne: false
            referencedRelation: "tune7_pattern_library"
            referencedColumns: ["id"]
          },
        ]
      }
      tune7_ustabaux: {
        Row: {
          id: number
          location: string
          state: string
          zip: string
        }
        Insert: {
          id?: number
          location: string
          state: string
          zip: string
        }
        Update: {
          id?: number
          location?: string
          state?: string
          zip?: string
        }
        Relationships: []
      }
      tune7_uswdbpat: {
        Row: {
          action_type: string | null
          id: number
          mapped_value: string | null
          token: string
          usage_notes: string | null
        }
        Insert: {
          action_type?: string | null
          id?: number
          mapped_value?: string | null
          token: string
          usage_notes?: string | null
        }
        Update: {
          action_type?: string | null
          id?: number
          mapped_value?: string | null
          token?: string
          usage_notes?: string | null
        }
        Relationships: []
      }
      tune7_uszipfin: {
        Row: {
          city: string
          id: number
          state: string
          zip: string
        }
        Insert: {
          city: string
          id?: number
          state: string
          zip: string
        }
        Update: {
          city?: string
          id?: number
          state?: string
          zip?: string
        }
        Relationships: []
      }
      tune7_versions: {
        Row: {
          notes: string | null
          release_date: string | null
          version: string
        }
        Insert: {
          notes?: string | null
          release_date?: string | null
          version: string
        }
        Update: {
          notes?: string | null
          release_date?: string | null
          version?: string
        }
        Relationships: []
      }
      tune7_zip_reference: {
        Row: {
          field1: string | null
          field2: string | null
          id: number
          zip_code: string
        }
        Insert: {
          field1?: string | null
          field2?: string | null
          id?: number
          zip_code: string
        }
        Update: {
          field1?: string | null
          field2?: string | null
          id?: number
          zip_code?: string
        }
        Relationships: []
      }
      tunes: {
        Row: {
          created_at: string | null
          engine: string
          id: string
          inbound_tokens: Json
          line_type: string
          notes: string | null
          raw_input_example: string | null
          recode: Json
          release_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          engine?: string
          id?: string
          inbound_tokens: Json
          line_type: string
          notes?: string | null
          raw_input_example?: string | null
          recode: Json
          release_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          engine?: string
          id?: string
          inbound_tokens?: Json
          line_type?: string
          notes?: string | null
          raw_input_example?: string | null
          recode?: Json
          release_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tunes_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      ustabaux: {
        Row: {
          id: number
          location: string | null
          state: string | null
          zip: string | null
        }
        Insert: {
          id?: number
          location?: string | null
          state?: string | null
          zip?: string | null
        }
        Update: {
          id?: number
          location?: string | null
          state?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      uswdbpat: {
        Row: {
          action_type: string | null
          id: number
          mapped_value: string | null
          token: string | null
          usage_notes: string | null
        }
        Insert: {
          action_type?: string | null
          id?: number
          mapped_value?: string | null
          token?: string | null
          usage_notes?: string | null
        }
        Update: {
          action_type?: string | null
          id?: number
          mapped_value?: string | null
          token?: string | null
          usage_notes?: string | null
        }
        Relationships: []
      }
      uszipfin: {
        Row: {
          city: string | null
          id: number
          state: string | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          id?: number
          state?: string | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          id?: number
          state?: string | null
          zip?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      client_summary: {
        Row: {
          client_code: string | null
          client_name: string | null
          hourly_rate: number | null
          id: string | null
          status: string | null
          total_conversations: number | null
          total_hours_logged: number | null
          total_projects: number | null
          total_revenue: number | null
          total_tasks: number | null
        }
        Relationships: []
      }
      project_status: {
        Row: {
          actual_cost: number | null
          actual_hours: number | null
          budget_amount: number | null
          client_name: string | null
          completed_tasks: number | null
          estimated_hours: number | null
          id: string | null
          priority: string | null
          project_code: string | null
          project_name: string | null
          status: string | null
          total_tasks: number | null
        }
        Relationships: []
      }
      tune7_v_pattern_reuse: {
        Row: {
          clwdpat_text: string | null
          entity_type: string | null
          pattern_text: string | null
          pattern_type: string | null
          pfprsdv_text: string | null
          recode_rule: string | null
          release_ref: string | null
          tune_id: number | null
          tune_name: string | null
          validation_status: string | null
        }
        Relationships: []
      }
      unbilled_time: {
        Row: {
          amount: number | null
          client_code: string | null
          client_name: string | null
          description: string | null
          entry_date: string | null
          hourly_rate: number | null
          hours: number | null
          project_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_project_hours: {
        Args: { project_uuid: string }
        Returns: number
      }
      get_unbilled_amount: { Args: { client_uuid: string }; Returns: number }
      tune7_suggest_pattern: {
        Args: { _input: string }
        Returns: {
          confidence: number
          pattern_id: number
          pattern_text: string
          recode_rule: string
        }[]
      }
      user_is_project_stakeholder: {
        Args: { check_user_id: string; project_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
