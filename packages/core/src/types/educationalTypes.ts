/**
 * Educational Metadata Interface
 * 
 * Contains educational information about resources including duration,
 * learning objectives, prerequisites, and curriculum alignment.
 */
export interface EducationalMetadata {
  /** Estimated duration in minutes (1-600, 10 hours max) - Single source for all duration estimates */
  estimatedDurationMinutes?: number;
  
  /** Learning objectives (max 10 objectives, each 10-200 chars) */
  learningObjectives?: string[];
  
  /** Prerequisites (max 10 prerequisites, each 10-200 chars) */
  prerequisites?: string[];
  
  /** Optional curriculum reference (e.g., "NCERT Ch 7") */
  curriculumAlignment?: string;
}

/**
 * Difficulty levels for educational resources
 */
export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

/**
 * Subject types for educational resources
 */
export enum SubjectType {
  MATHEMATICS = 'Mathematics',
  SCIENCE = 'Science',
  ENGLISH = 'English',
  HISTORY = 'History',
  GEOGRAPHY = 'Geography',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  COMPUTER_SCIENCE = 'Computer Science',
  ART = 'Art',
  MUSIC = 'Music',
  PHYSICAL_EDUCATION = 'Physical Education',
  FOREIGN_LANGUAGE = 'Foreign Language',
  OTHER = 'Other'
}

/**
 * Resource types for classification
 */
export enum ResourceType {
  STANDALONE = 'standalone',
  COURSE = 'course',
  CHAPTER = 'chapter',
  MATERIAL = 'material'
}

/**
 * Material types for detailed classification
 */
export enum MaterialType {
  // Practice & Exercises
  WORKSHEET = 'worksheet',           // Practice sheets, exercises, fill-in-the-blanks
  ACTIVITY = 'activity',             // Hands-on activities, experiments, group work
  GAME = 'game',                     // Educational games, puzzles, interactive activities
  
  // Information & Reference
  HANDOUT = 'handout',               // Information sheets, reference materials, guides
  SLIDES = 'slides',                 // PowerPoint presentations, slide decks
  POSTER = 'poster',                 // Visual aids, charts, infographics, displays
  REFERENCE = 'reference',           // Quick reference guides, formula sheets, glossaries

  // Assessment Materials
  QUIZ = 'quiz',                     // Short quizzes, quick assessments
  TEST = 'test',                     // Formal tests, exams, comprehensive assessments
  RUBRIC = 'rubric',                 // Grading rubrics, assessment criteria
  
  // Planning & Instruction
  LESSON_PLAN = 'lesson_plan',       // Complete lesson plans with objectives and activities
  UNIT_PLAN = 'unit_plan',           // Multi-lesson unit plans, curriculum sequences
  PACING_GUIDE = 'pacing_guide',     // Curriculum pacing, scope and sequence
  
  // Templates & Tools
  TEMPLATE = 'template',             // Blank forms, planning templates, organizers
  CHECKLIST = 'checklist',           // Task lists, progress trackers, self-assessments
  GRAPHIC_ORGANIZER = 'graphic_organizer', // Mind maps, concept maps, thinking tools
  
  // Project & Lab Work
  PROJECT = 'project',               // Project instructions, rubrics, examples
  LAB = 'lab',                       // Lab procedures, experiments, investigations
  FIELD_TRIP = 'field_trip',         // Field trip guides, outdoor education materials
  
  // Student Examples & Models
  SAMPLE_WORK = 'sample_work',       // Student work examples, exemplars, models
  ANSWER_KEY = 'answer_key',         // Solutions, answer guides, teacher resources
  
  // Communication & Admin
  NEWSLETTER = 'newsletter',         // Parent newsletters, class updates, announcements
  FORM = 'form',                     // Permission slips, surveys, data collection forms
  
  // Flexible Category
  OTHER = 'other'                    // Anything that doesn't fit above categories
}

/**
 * Grade types (union type for flexibility)
 */
export type GradeType = 
  | 'K' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';

/**
 * Language codes (ISO 639-1)
 */
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'hi' | 'ar' | 'pt' | 'ru' | 'ja';

/**
 * License types for resources
 */
export enum LicenseType {
  ORIGINAL = 'original',
  CREATIVE_COMMONS = 'creative_commons',
  PUBLIC_DOMAIN = 'public_domain',
  FAIR_USE = 'fair_use',
  COMMERCIAL = 'commercial'
}

/**
 * License information interface
 */
export interface LicenseInfo {
  /** License type (required) */
  type: LicenseType;
  
  /** Optional license details (10-500 characters) */
  details?: string;
  
  /** Optional attribution requirements (10-200 characters) */
  attribution?: string;
}