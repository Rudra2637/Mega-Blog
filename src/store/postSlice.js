import { createSlice } from "@reduxjs/toolkit";

const initialState={
    posts:[],
}

const postSlice = createSlice({
        name :"post",
        initialState,
        reducers:{
            setPosts: (state, action) => {
                state.posts = action.payload;
            },
            addPost: (state, action) => {
                const index = state.posts.findIndex((p) => p.$id === action.payload.$id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                } else {
                    state.posts.push(action.payload);
                }
            },
            
            deletePosts:(state,action) => {
                state.posts = state.posts.filter((item) =>  item.$id !== action.payload)
            }
        }
    }
)

export const {addPost,deletePosts,setPosts}  = postSlice.actions
export default postSlice.reducer
export const selectPosts = (state) => state.post.posts;
