-- Reset likes and comments to 0 for all news articles
UPDATE public.news_articles
SET likes = 0,
    comments = 0;
