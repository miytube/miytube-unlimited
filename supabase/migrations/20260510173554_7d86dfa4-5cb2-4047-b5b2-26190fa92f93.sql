create or replace function public.prevent_redundant_custom_watch_page()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  parent_sub record;
begin
  select name, slug
    into parent_sub
  from public.custom_subcategories
  where id = new.subcategory_id;

  if parent_sub is not null and (
    lower(new.slug) = lower(parent_sub.slug)
    or lower(trim(new.name)) = lower(trim(parent_sub.name))
  ) then
    raise exception 'Watch page already exists as the parent subcategory page';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_redundant_custom_watch_page_trigger on public.custom_watch_pages;

create trigger prevent_redundant_custom_watch_page_trigger
before insert or update on public.custom_watch_pages
for each row
execute function public.prevent_redundant_custom_watch_page();