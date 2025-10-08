-- Create news_comments table
CREATE TABLE IF NOT EXISTS public.news_comments (
    id BIGSERIAL PRIMARY KEY,
    news_article_id BIGINT NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_news_comments_article_id ON public.news_comments(news_article_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_created_at ON public.news_comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "News comments are viewable by everyone"
    ON public.news_comments
    FOR SELECT
    USING (true);

CREATE POLICY "Anyone can insert news comments"
    ON public.news_comments
    FOR INSERT
    WITH CHECK (true);

-- Create trigger to auto-update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.news_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
