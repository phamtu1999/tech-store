import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLivestreams = createAsyncThunk(
    'livestream/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/v1/livestreams');
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchLivestreamDetail = createAsyncThunk(
    'livestream/fetchDetail',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/v1/livestreams/${id}`);
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const joinLivestream = createAsyncThunk(
    'livestream/join',
    async (id, { rejectWithValue }) => {
        try {
            await axios.post(`/api/v1/livestreams/${id}/join`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const leaveLivestream = createAsyncThunk(
    'livestream/leave',
    async (id, { rejectWithValue }) => {
        try {
            await axios.post(`/api/v1/livestreams/${id}/leave`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const livestreamSlice = createSlice({
    name: 'livestream',
    initialState: {
        streams: [],
        currentStream: null,
        loading: false,
        error: null
    },
    reducers: {
        clearCurrentStream: (state) => {
            state.currentStream = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLivestreams.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLivestreams.fulfilled, (state, action) => {
                state.loading = false;
                state.streams = action.payload;
            })
            .addCase(fetchLivestreams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchLivestreamDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLivestreamDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentStream = action.payload;
            })
            .addCase(fetchLivestreamDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentStream } = livestreamSlice.actions;
export default livestreamSlice.reducer;
