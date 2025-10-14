-- Add news_article_id field to messages table for sharing news articles
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS news_article_id INTEGER REFERENCES public.news_articles(id) ON DELETE CASCADE;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_news_article_id ON public.messages(news_article_id);

-- Add comment
COMMENT ON COLUMN public.messages.news_article_id IS 'Reference to a news article when the message is a shared news card';
