Creating a full-stack web application for a blog using React for the frontend, Node.js for the backend, and Supabase as the database involves several steps. Below is a basic outline and code snippets to help you get started.

### Backend: Node.js with Express

1. **Initialize Your Node.js Project**

   ```bash
   mkdir blog-backend
   cd blog-backend
   npm init -y
   npm install express dotenv cors supabase
   ```

2. **Create a Basic Express Server**

   Create a file named `server.js`:

   ```javascript
   require('dotenv').config();
   const express = require('express');
   const cors = require('cors');
   const { createClient } = require('@supabase/supabase-js');

   const app = express();
   app.use(cors());
   app.use(express.json());

   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

   // Get all posts
   app.get('/api/posts', async (req, res) => {
     const { data, error } = await supabase.from('posts').select('*');
     if (error) return res.status(500).json({ error: error.message });
     res.json(data);
   });

   // Create a post
   app.post('/api/posts', async (req, res) => {
     const { title, content } = req.body;
     const { data, error } = await supabase.from('posts').insert([{ title, content }]);
     if (error) return res.status(500).json({ error: error.message });
     res.status(201).json(data[0]);
   });

   const PORT = process.env.PORT || 3001;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

3. **Environment Variables**

   Create a `.env` file:

   ```plaintext
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

### Supabase Schema

1. **Set Up Your Database**

   Create a table `posts` in your Supabase project. Here is the schema for the `posts` table:

   - `id`: Primary Key (UUID)
   - `title`: Text
   - `content`: Text
   - `created_at`: Timestamp (auto-generated)

   You can set this up in the Supabase dashboard or use SQL directly.

   ```sql
   create table posts (
     id uuid not null primary key default uuid_generate_v4(),
     title text not null,
     content text not null,
     created_at timestamp with time zone default current_timestamp
   );
   ```

### Frontend: React

1. **Initialize Your React Project**

   ```bash
   npx create-react-app blog-frontend
   cd blog-frontend
   npm install axios
   ```

2. **Fetch and Display Posts**

   Modify `src/App.js` to fetch and display posts:

   ```javascript
   import React, { useEffect, useState } from 'react';
   import axios from 'axios';

   function App() {
     const [posts, setPosts] = useState([]);

     useEffect(() => {
       async function fetchPosts() {
         const response = await axios.get('http://localhost:3001/api/posts');
         setPosts(response.data);
       }
       fetchPosts();
     }, []);

     return (
       <div className="App">
         <h1>Blog Posts</h1>
         {posts.map(post => (
           <div key={post.id}>
             <h2>{post.title}</h2>
             <p>{post.content}</p>
           </div>
         ))}
       </div>
     );
   }

   export default App;
   ```

3. **Adding a New Post**

   Create a form to add new posts in `src/App.js`:

   ```javascript
   function App() {
     // same as before, but add these

     const [title, setTitle] = useState('');
     const [content, setContent] = useState('');

     const addPost = async (e) => {
       e.preventDefault();
       const response = await axios.post('http://localhost:3001/api/posts', { title, content });
       setPosts([...posts, response.data]);
       setTitle('');
       setContent('');
     };

     // inside return
     <form onSubmit={addPost}>
       <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
       <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" required />
       <button type="submit">Add Post</button>
     </form>
   }
   ```

### Running the Application

1. **Start the Backend Server**

   ```bash
   node server.js
   ```

2. **Run the React Application**

   For the React frontend:

   ```bash
   npm start
   ```

Ensure both the frontend and backend are running. Now your basic blog app should be operational. You'll see existing posts and can add new posts.

### Further Development

- **Styling**: Use CSS or a library like Bootstrap or Material-UI to style your frontend.
- **Routing**: Use React Router for single post views.
- **Authentication**: Implement user authentication with Supabase Auth.
- **Deployment**: Deploy your frontend to Vercel/Netlify and backend like Heroku, or use full platforms like Firebase or Vercel that support both frontend and backend.
- **Testing**: Use Jest or Mocha for backend and React Testing Library for frontend.

This is a basic template to get you started. As you build, you may need to adjust architecture or add more complex features depending on your use case.