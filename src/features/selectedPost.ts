import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Post } from '../types/Post';
import { getUserPosts } from '../api/posts';

/* eslint-disable no-param-reassign */
export interface SelectedPostState {
  item: Post | null;
  loaded: boolean;
  hasError: boolean;
}

const initialState: SelectedPostState = {
  item: null,
  loaded: false,
  hasError: false,
};

export const selectedPostAsync = createAsyncThunk(
  'selectedPost/fetch',
  async (userId: number) => {
    const selectedPosts = await getUserPosts(userId);

    return selectedPosts;
  },
);

export const selectedPostSlice = createSlice({
  name: 'selectedPost',
  initialState,
  reducers: {
    selectPost(state, action) {
      state.item = state.item?.id === action.payload.id ? null : action.payload;
    },
    clearSelectedPost(state) {
      state.item = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(selectedPostAsync.pending, state => {
        state.hasError = false;
        state.loaded = false;
      })
      .addCase(selectedPostAsync.fulfilled, (state, action) => {
        state.item = action.payload;
        state.loaded = true;
      })
      .addCase(selectedPostAsync.rejected, state => {
        state.hasError = true;
        state.loaded = true;
      });
  },
});

export const { selectPost, clearSelectedPost } = selectedPostSlice.actions;

export default selectedPostSlice.reducer;
