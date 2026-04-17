import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recommendationsApi from '../../api/recommendations';

export const fetchPopularProducts = createAsyncThunk(
    'recommendations/fetchPopular',
    async (limit, { rejectWithValue }) => {
        try {
            const response = await recommendationsApi.getPopular(limit);
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch popular products');
        }
    }
);

export const fetchTrendingProducts = createAsyncThunk(
    'recommendations/fetchTrending',
    async (limit, { rejectWithValue }) => {
        try {
            const response = await recommendationsApi.getTrending(limit);
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch trending products');
        }
    }
);

export const fetchPersonalizedRecommendations = createAsyncThunk(
    'recommendations/fetchPersonalized',
    async (limit, { rejectWithValue }) => {
        try {
            const response = await recommendationsApi.getPersonalized(limit);
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
        }
    }
);

const recommendationsSlice = createSlice({
    name: 'recommendations',
    initialState: {
        popular: [],
        trending: [],
        personalized: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPopularProducts.fulfilled, (state, action) => {
                state.popular = action.payload || [];
            })
            .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
                state.trending = action.payload || [];
            })
            .addCase(fetchPersonalizedRecommendations.fulfilled, (state, action) => {
                state.personalized = action.payload || [];
            });
    },
});

export default recommendationsSlice.reducer;
