-- Add admin policies for project_media, news_media, projects, and news_articles tables
-- Admin users need to be able to manage all these resources

-- =====================
-- PROJECT_MEDIA POLICIES
-- =====================
DROP POLICY IF EXISTS "Authenticated users can insert project media" ON public.project_media;
DROP POLICY IF EXISTS "Authenticated users can update project media" ON public.project_media;
DROP POLICY IF EXISTS "Authenticated users can delete project media" ON public.project_media;

CREATE POLICY "Authenticated users can insert project media"
    ON public.project_media
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update project media"
    ON public.project_media
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete project media"
    ON public.project_media
    FOR DELETE
    TO authenticated
    USING (true);

-- =====================
-- NEWS_MEDIA POLICIES
-- =====================
DROP POLICY IF EXISTS "Authenticated users can insert news media" ON public.news_media;
DROP POLICY IF EXISTS "Authenticated users can update news media" ON public.news_media;
DROP POLICY IF EXISTS "Authenticated users can delete news media" ON public.news_media;

CREATE POLICY "Authenticated users can insert news media"
    ON public.news_media
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update news media"
    ON public.news_media
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete news media"
    ON public.news_media
    FOR DELETE
    TO authenticated
    USING (true);

-- =====================
-- PROJECTS POLICIES
-- =====================
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;

CREATE POLICY "Authenticated users can insert projects"
    ON public.projects
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
    ON public.projects
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete projects"
    ON public.projects
    FOR DELETE
    TO authenticated
    USING (true);

-- =====================
-- NEWS_ARTICLES POLICIES
-- =====================
DROP POLICY IF EXISTS "Authenticated users can insert news articles" ON public.news_articles;
DROP POLICY IF EXISTS "Authenticated users can delete news articles" ON public.news_articles;

CREATE POLICY "Authenticated users can insert news articles"
    ON public.news_articles
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete news articles"
    ON public.news_articles
    FOR DELETE
    TO authenticated
    USING (true);

-- Note: news_articles already has an update policy from migration 20251005034116_add_news_update_policy.sql

-- =====================
-- NEWS_TAGS POLICIES
-- =====================
DROP POLICY IF EXISTS "Authenticated users can insert news tags" ON public.news_tags;
DROP POLICY IF EXISTS "Authenticated users can update news tags" ON public.news_tags;
DROP POLICY IF EXISTS "Authenticated users can delete news tags" ON public.news_tags;

CREATE POLICY "Authenticated users can insert news tags"
    ON public.news_tags
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update news tags"
    ON public.news_tags
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete news tags"
    ON public.news_tags
    FOR DELETE
    TO authenticated
    USING (true);
