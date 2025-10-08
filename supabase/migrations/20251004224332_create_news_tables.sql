-- Create news_articles table
CREATE TABLE IF NOT EXISTS public.news_articles (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    title_arabic TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Announcements', 'Events', 'Community', 'Education', 'Projects')),
    author TEXT NOT NULL,
    author_bio TEXT NOT NULL,
    date TEXT NOT NULL,
    read_time TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    comments INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create news_media table for storing news images/videos
CREATE TABLE IF NOT EXISTS public.news_media (
    id BIGSERIAL PRIMARY KEY,
    news_article_id BIGINT NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    uri TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create news_tags table for storing article tags
CREATE TABLE IF NOT EXISTS public.news_tags (
    id BIGSERIAL PRIMARY KEY,
    news_article_id BIGINT NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_news_media_article_id ON public.news_media(news_article_id);
CREATE INDEX IF NOT EXISTS idx_news_tags_article_id ON public.news_tags(news_article_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON public.news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_date ON public.news_articles(date);

-- Enable Row Level Security
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_tags ENABLE ROW LEVEL SECURITY;

-- Create policies (read access for everyone)
CREATE POLICY "News articles are viewable by everyone"
    ON public.news_articles
    FOR SELECT
    USING (true);

CREATE POLICY "News media is viewable by everyone"
    ON public.news_media
    FOR SELECT
    USING (true);

CREATE POLICY "News tags are viewable by everyone"
    ON public.news_tags
    FOR SELECT
    USING (true);

-- Create trigger to auto-update updated_at on news_articles table
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.news_articles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
