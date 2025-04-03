
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Users } from 'lucide-react';

const PeopleBlogs = () => {
  return (
    <GenericCategoryPage 
      title="People & Blogs" 
      description="Discover content about people, blogs, vlogs, and personal content"
      Icon={Users}
    />
  );
};

export default PeopleBlogs;
