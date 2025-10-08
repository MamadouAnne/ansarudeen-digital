-- Reset raised amounts and donors to 0 for all projects
UPDATE public.projects
SET raised_amount = 0,
    donors = 0,
    progress = 0;
