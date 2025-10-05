-- Add UPDATE policy for news articles to allow updating likes and comments
CREATE POLICY "Anyone can update likes and comments on news articles"
    ON public.news_articles
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
