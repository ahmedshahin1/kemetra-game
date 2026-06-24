-- GAMIFIED TOURISM PLATFORM - SCHEMA UPDATES
-- Run this after the existing schema in supabase_schema.sql

-- 1. JOURNEYS TABLE - User journey tracking
CREATE TABLE IF NOT EXISTS public.journeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tier_id TEXT DEFAULT 'tourist', -- progression tier
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT unique_active_journey UNIQUE (user_id) WHERE is_active = true
);

-- 2. PROGRESSION TIERS TABLE - Rank definitions
CREATE TABLE IF NOT EXISTS public.progression_tiers (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  min_xp INTEGER NOT NULL,
  max_xp INTEGER,
  icon_name TEXT,
  color TEXT,
  next_tier_id TEXT REFERENCES public.progression_tiers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. LOCATION PROGRESS TABLE - Track exploration
CREATE TABLE IF NOT EXISTS public.location_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  location_id TEXT NOT NULL,
  governorate_id TEXT NOT NULL,
  visited_count INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  last_visited TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT unique_user_location UNIQUE (user_id, location_id)
);

-- 4. ACHIEVEMENTS TABLE - Badge definitions and user unlocks
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  icon_name TEXT,
  color TEXT,
  criteria_type TEXT, -- 'xp', 'locations', 'quizzes', 'scores', 'rank'
  criteria_value INTEGER,
  rarity TEXT DEFAULT 'common', -- common, rare, epic, legendary
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. USER ACHIEVEMENTS TABLE - Track unlocked badges
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  achievement_id TEXT REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

-- 6. QUIZ ATTEMPTS TABLE - Track quiz history
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  governorate_id TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1,
  score INTEGER NOT NULL,
  questions_answered INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken_seconds INTEGER,
  xp_earned INTEGER,
  mode TEXT CHECK (mode IN ('ranked', 'challenge', 'casual')),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. SIDE QUESTS TABLE - Quest definitions
CREATE TABLE IF NOT EXISTS public.side_quests (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  location_id TEXT NOT NULL,
  governorate_id TEXT NOT NULL,
  required_visits INTEGER DEFAULT 1,
  xp_reward INTEGER NOT NULL,
  badge_reward TEXT REFERENCES public.achievements(id),
  unlock_condition TEXT, -- 'random', 'location_visit', 'level_reached'
  difficulty TEXT DEFAULT 'easy',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 8. USER SIDE QUESTS TABLE - Track quest completion
CREATE TABLE IF NOT EXISTS public.user_side_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  quest_id TEXT REFERENCES public.side_quests(id) ON DELETE CASCADE NOT NULL,
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0,
  CONSTRAINT unique_user_quest UNIQUE (user_id, quest_id)
);

-- 9. ENABLE RLS
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progression_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.side_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_side_quests ENABLE ROW LEVEL SECURITY;

-- 10. POLICIES - Journeys
CREATE POLICY \"Users can view own journeys\" ON public.journeys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY \"Users can insert own journeys\" ON public.journeys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY \"Users can update own journeys\" ON public.journeys FOR UPDATE USING (auth.uid() = user_id);

-- 11. POLICIES - Location Progress
CREATE POLICY \"Users can view own location progress\" ON public.location_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY \"Users can insert own progress\" ON public.location_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY \"Users can update own progress\" ON public.location_progress FOR UPDATE USING (auth.uid() = user_id);

-- 12. POLICIES - Achievements (public read)
CREATE POLICY \"Achievements are viewable by everyone\" ON public.achievements FOR SELECT USING (true);

-- 13. POLICIES - User Achievements
CREATE POLICY \"Users can view own achievements\" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY \"Users can view all user achievements\" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY \"Users can insert own achievements\" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 14. POLICIES - Quiz Attempts
CREATE POLICY \"Users can view own quiz attempts\" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY \"Users can insert own attempts\" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 15. POLICIES - Progression Tiers (public read)
CREATE POLICY \"Progression tiers are viewable by everyone\" ON public.progression_tiers FOR SELECT USING (true);

-- 16. POLICIES - Side Quests (public read)
CREATE POLICY \"Side quests are viewable by everyone\" ON public.side_quests FOR SELECT USING (true);

-- 17. POLICIES - User Side Quests
CREATE POLICY \"Users can view own quests\" ON public.user_side_quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY \"Users can insert own quests\" ON public.user_side_quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY \"Users can update own quests\" ON public.user_side_quests FOR UPDATE USING (auth.uid() = user_id);

-- 18. INSERT DEFAULT PROGRESSION TIERS
INSERT INTO public.progression_tiers (id, title_en, title_ar, description_en, description_ar, min_xp, max_xp, icon_name, color, next_tier_id)
VALUES
  ('tourist', 'Tourist', 'سائح', 'Just starting your Egyptian adventure', 'بدأت للتو مغامرتك المصرية', 0, 499, 'Compass', '#9CA3AF', 'explorer'),
  ('explorer', 'Explorer', 'مستكشف', 'Discovering Egypt''s wonders', 'اكتشاف عجائب مصر', 500, 1499, 'Map', '#60A5FA', 'researcher'),
  ('researcher', 'Researcher', 'باحث', 'Deep diving into Egyptian history', 'الغوص العميق في التاريخ المصري', 1500, 3499, 'BookOpen', '#34D399', 'historian'),
  ('historian', 'Historian', 'المؤرخ', 'Mastering the knowledge of ages', 'إتقان معرفة العصور', 3500, 7499, 'ScrollText', '#F59E0B', 'archaeologist'),
  ('archaeologist', 'Archaeologist', 'الآثاري', 'Ultimate keeper of Egyptian heritage', 'الحارس الأسمى للتراث المصري', 7500, NULL, 'Gem', '#D4AF37', NULL);

-- 19. INSERT DEFAULT ACHIEVEMENTS
INSERT INTO public.achievements (id, title_en, title_ar, description_en, description_ar, icon_name, color, criteria_type, criteria_value, rarity)
VALUES
  ('first_quiz', 'Quiz Master Begins', 'يبدأ سيد الاختبار', 'Complete your first quiz', 'أكمل أول اختبار لك', 'Sparkles', '#60A5FA', 'quizzes', 1, 'common'),
  ('hundred_xp', 'Starting Scholar', 'العالم الناشئ', 'Earn 100 XP', 'اكسب 100 نقطة خبرة', 'Star', '#FCD34D', 'xp', 100, 'common'),
  ('five_locations', 'Regional Traveler', 'المسافر الإقليمي', 'Visit 5 governorates', 'زر 5 محافظات', 'MapPin', '#34D399', 'locations', 5, 'uncommon'),
  ('explorer_rank', 'Rank Explorer', 'مستكشف الرتبة', 'Reach Explorer rank', 'اصل إلى رتبة المستكشف', 'Compass', '#60A5FA', 'rank', 500, 'uncommon'),
  ('historian_rank', 'Knowledge Keeper', 'حافظ المعرفة', 'Reach Historian rank', 'اصل إلى رتبة المؤرخ', 'BookOpen', '#F59E0B', 'rank', 3500, 'rare'),
  ('archaeologist_rank', 'Ultimate Master', 'المعلم الأسمى', 'Reach Archaeologist rank', 'اصل إلى رتبة الآثاري', 'Crown', '#D4AF37', 'rank', 7500, 'legendary'),
  ('perfect_score', 'Perfect Mind', 'العقل المثالي', 'Score 100% on a quiz', 'احصل على 100% في اختبار', 'Zap', '#FCD34D', 'scores', 100, 'rare'),
  ('explorer_badge', 'Egypt Explorer', 'مستكشف مصر', 'Explore 10 governorates', 'استكشف 10 محافظات', 'Globe', '#34D399', 'locations', 10, 'epic');
