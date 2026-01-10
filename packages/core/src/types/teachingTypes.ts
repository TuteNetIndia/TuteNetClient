/**
 * TeachingGuides Interface - MVP (Minimal Viable Product)
 * 
 * DESIGN PRINCIPLES:
 * 1. Keep it simple and focused on essential teaching guidance
 * 2. Easy for teachers to create and maintain
 * 3. Provides immediate value without overwhelming complexity
 * 4. Extensible for future enhancements
 * 
 * CONSOLIDATION NOTE:
 * Duration information is provided by EducationalMetadata.estimatedDurationMinutes
 * to avoid duplication and maintain single source of truth for time estimates.
 */
export interface TeachingGuides {
  /** Step-by-step implementation instructions for teachers */
  usageInstructions?: UsageInstructions;
  
  /** Quick formative assessment suggestions */
  quickChecks?: QuickAssessment[];
  
  /** Common student difficulties and how to address them */
  commonChallenges?: CommonChallenges;
}

/**
 * Simplified usage instructions for MVP
 * Focus on essential information teachers need to use the resource effectively
 * 
 * Note: Duration information is provided by EducationalMetadata.estimatedDurationMinutes
 */
export interface UsageInstructions {
  /** Brief overview of how to use this resource effectively */
  overview: string;                    // Required, 50-300 characters
  
  /** Simple list of implementation steps (3-5 steps max) */
  steps: InstructionalStep[];          // Required, 3-5 steps
}

export interface InstructionalStep {
  /** Step number (1-based) */
  order: number;                       // Required, 1-5
  
  /** Brief title/summary of this step */
  title: string;                       // Required, 10-50 characters
  
  /** Detailed instructions for this step */
  description: string;                 // Required, 20-200 characters
  
  /** Estimated duration for this step (optional, in minutes) */
  estimatedMinutes?: number;           // Optional, 1-120 minutes
}

/**
 * Simplified common challenges for MVP
 * Focus on the most important student difficulties teachers encounter
 */
export interface CommonChallenges {
  /** Typical misconceptions students have (1-3 items max) */
  misconceptions?: Misconception[];
}

export interface Misconception {
  /** The incorrect belief or understanding */
  misconception: string;               // Required, 20-150 characters
  
  /** How to address and correct this misconception */
  correction: string;                  // Required, 30-200 characters
}

/**
 * Quick assessment tools for formative evaluation - MVP version
 * Simple, practical assessment suggestions teachers can use immediately
 */
export interface QuickAssessment {
  /** Type of quick assessment */
  type: QuickAssessmentType;           // Required enum value
  
  /** Brief description of the assessment */
  description: string;                 // Required, 20-150 characters
  
  /** Question or prompt to use */
  prompt: string;                      // Required, 10-200 characters
  
  /** Expected duration in minutes */
  durationMinutes: number;             // Required, 1-15 minutes
}

// SUPPORTING ENUMS FOR TYPE SAFETY AND CONSISTENCY

export enum QuickAssessmentType {
  FIST_TO_FIVE = 'fist_to_five',
  EXIT_TICKET = 'exit_ticket',
  ONE_MINUTE_PAPER = 'one_minute_paper',
  THUMBS_CHECK = 'thumbs_check',
  TRAFFIC_LIGHT = 'traffic_light',
  QUICK_WRITE = 'quick_write',
  VERBAL_POLL = 'verbal_poll',
  DIGITAL_POLL = 'digital_poll'
}

export enum FormativeAssessmentType {
  EXIT_TICKET = 'exit_ticket',
  THUMBS_UP_DOWN = 'thumbs_up_down',
  THINK_PAIR_SHARE = 'think_pair_share',
  QUICK_POLL = 'quick_poll',
  OBSERVATION_CHECKLIST = 'observation_checklist',
  VERBAL_QUESTIONING = 'verbal_questioning',
  WHITEBOARD_RESPONSE = 'whiteboard_response',
  DIGITAL_RESPONSE = 'digital_response'
}

export enum SummativeAssessmentType {
  WRITTEN_TEST = 'written_test',
  PROJECT_BASED = 'project_based',
  PRESENTATION = 'presentation',
  PORTFOLIO = 'portfolio',
  PERFORMANCE_TASK = 'performance_task',
  RESEARCH_PAPER = 'research_paper'
}

export enum SelfAssessmentType {
  REFLECTION_JOURNAL = 'reflection_journal',
  LEARNING_CHECKLIST = 'learning_checklist',
  GOAL_SETTING = 'goal_setting',
  CONFIDENCE_RATING = 'confidence_rating',
  METACOGNITIVE_PROMPT = 'metacognitive_prompt'
}

export enum AssessmentTiming {
  LESSON_START = 'lesson_start',
  DURING_INSTRUCTION = 'during_instruction',
  LESSON_END = 'lesson_end',
  AFTER_PRACTICE = 'after_practice',
  UNIT_CONCLUSION = 'unit_conclusion'
}

export enum PedagogicalApproach {
  DIRECT_INSTRUCTION = 'direct_instruction',
  INQUIRY_BASED = 'inquiry_based',
  COLLABORATIVE_LEARNING = 'collaborative_learning',
  PROBLEM_BASED = 'problem_based',
  CONSTRUCTIVIST = 'constructivist',
  FLIPPED_CLASSROOM = 'flipped_classroom',
  DIFFERENTIATED = 'differentiated',
  EXPERIENTIAL = 'experiential'
}

export enum StudentGroup {
  STRUGGLING_LEARNERS = 'struggling_learners',
  ADVANCED_LEARNERS = 'advanced_learners',
  ENGLISH_LANGUAGE_LEARNERS = 'english_language_learners',
  SPECIAL_NEEDS = 'special_needs',
  KINESTHETIC_LEARNERS = 'kinesthetic_learners',
  VISUAL_LEARNERS = 'visual_learners',
  AUDITORY_LEARNERS = 'auditory_learners'
}

export enum ManagementCategory {
  ATTENTION_MANAGEMENT = 'attention_management',
  BEHAVIOR_MANAGEMENT = 'behavior_management',
  TIME_MANAGEMENT = 'time_management',
  MATERIAL_MANAGEMENT = 'material_management',
  GROUP_MANAGEMENT = 'group_management',
  TRANSITION_MANAGEMENT = 'transition_management'
}

export enum PreparationCategory {
  MATERIALS = 'materials',
  TECHNOLOGY = 'technology',
  ROOM_SETUP = 'room_setup',
  CONTENT_REVIEW = 'content_review',
  DIFFERENTIATION = 'differentiation',
  ASSESSMENT_PREP = 'assessment_prep'
}

export enum DeliveryTiming {
  LESSON_OPENING = 'lesson_opening',
  DURING_EXPLANATION = 'during_explanation',
  DURING_PRACTICE = 'during_practice',
  DURING_DISCUSSION = 'during_discussion',
  LESSON_CLOSING = 'lesson_closing',
  THROUGHOUT_LESSON = 'throughout_lesson'
}

export enum FollowUpType {
  HOMEWORK_ASSIGNMENT = 'homework_assignment',
  REFLECTION_ACTIVITY = 'reflection_activity',
  EXTENSION_PROJECT = 'extension_project',
  REVIEW_SESSION = 'review_session',
  PEER_DISCUSSION = 'peer_discussion',
  PARENT_COMMUNICATION = 'parent_communication'
}