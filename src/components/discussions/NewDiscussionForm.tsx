
import React from 'react';

export interface NewPostFormData {
  title: string;
  content: string;
  category: string;
}

interface NewDiscussionFormProps {
  categories: string[];
  newPost: NewPostFormData;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onPostChange: (updatedPost: NewPostFormData) => void;
}

export const NewDiscussionForm: React.FC<NewDiscussionFormProps> = ({
  categories,
  newPost,
  onCancel,
  onSubmit,
  onPostChange,
}) => {
  return (
    <div className="mb-8 bg-card p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Share How World Events Affect You</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="category">
            Topic Area
          </label>
          <select 
            id="category"
            className="w-full p-2 border rounded-lg"
            value={newPost.category}
            onChange={(e) => onPostChange({...newPost, category: e.target.value})}
          >
            {categories.filter(cat => cat !== 'All Categories').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Discussion Title
          </label>
          <input 
            type="text" 
            id="title"
            className="w-full p-2 border rounded-lg"
            value={newPost.title}
            onChange={(e) => onPostChange({...newPost, title: e.target.value})}
            placeholder="Summarize how a world event affects you"
            maxLength={100}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="content">
            Your Experience
          </label>
          <textarea 
            id="content"
            className="w-full p-2 border rounded-lg min-h-[120px]"
            value={newPost.content}
            onChange={(e) => onPostChange({...newPost, content: e.target.value})}
            placeholder="Share how this global event or trend has affected your personal life..."
            maxLength={2000}
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <button 
            type="button" 
            className="px-4 py-2 border rounded-lg hover:bg-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Share Experience
          </button>
        </div>
      </form>
    </div>
  );
};
