
UPDATE uploaded_videos SET category='sports', subcategory='mlb-baseball'
  WHERE category='mlb-baseball' AND subcategory='all-mlb-baseball';

UPDATE uploaded_videos SET category='sports', subcategory='sports-mlb-playoffs-nl'
  WHERE category='mlb-baseball' AND subcategory IN ('mlb-nl-playoffs','sports-mlb-nl-playoffs');

UPDATE uploaded_videos SET category='sports', subcategory='sports-mlb-world-series'
  WHERE category='mlb-baseball' AND subcategory='sports-mlb-world-series';

UPDATE uploaded_videos SET category='sports', subcategory='mlb-baseball'
  WHERE category='sports' AND subcategory='baseball';
