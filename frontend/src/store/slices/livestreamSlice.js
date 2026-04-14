import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import livestreamApi from '../../api/livestream';

export const fetchLiveStreams = createAsyncThunk(
    'livestream/fetchLive',
    async (_, { rejectWithValue }) => {
        try {
            const response = await livestreamApi.getLive();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch live streams');
        }
    }
);

export const fetchLivestreamDetail = createAsyncThunk(
    'livestream/fetchDetail',
    async (id, { rejectWithValue }) => {
        try {
            const response = await livestreamApi.getById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch livestream detail');
        }
    }
);

const livestreamSlice = createSlice({
    name: 'livestream',
    initialState: {
        liveStreams: [],
        currentStream: null,
        loading: false,
        error: null,
    },
    reducers: {
        updateCurrentStream: (state, action) => {
            state.currentStream = action.payload;
        },
        updateViewerCount: (state, action) => {
            if (state.currentStream && state.currentStream.id === action.payload.id) {
                state.currentStream.viewerCount = action.payload.viewerCount;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLiveStreams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLiveStreams.fulfilled, (state, action) => {
                state.loading = false;
                state.liveStreams = action.payload;
            })
            .addCase(fetchLiveStreams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchLivestreamDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLivestreamDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentStream = action.payload;
            })
            .addCase(fetchLivestreamDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { updateCurrentStream, updateViewerCount } = livestreamSlice.actions;
export default livestreamSlice.reducer;
