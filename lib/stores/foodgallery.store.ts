import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createFood,
  getFood,
  getAllFoods,
  updateFood,
  deleteFood,
  createFoodReview,
} from "../actions/foodgallery.actions";

interface Food {
  id: string;
  attachment: string;
  // Extend with more properties as needed
}

interface FoodGalleryState {
  foods: Food[];
  currentFood: Food | null;
  loading: boolean;
  error: string | null;
}

const initialState: FoodGalleryState = {
  foods: [],
  currentFood: null,
  loading: false,
  error: null,
};

const foodgallerySlice = createSlice({
  name: "foodgallery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create Food
    builder.addCase(createFood.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createFood.fulfilled,
      (state, action: PayloadAction<Food>) => {
        state.loading = false;
        state.foods.push(action.payload);
      }
    );
    builder.addCase(createFood.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get Food
    builder.addCase(getFood.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getFood.fulfilled, (state, action: PayloadAction<Food>) => {
      state.loading = false;
      state.currentFood = action.payload;
    });
    builder.addCase(getFood.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get All Foods
    builder.addCase(getAllFoods.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getAllFoods.fulfilled,
      (state, action: PayloadAction<Food[]>) => {
        state.loading = false;
        state.foods = action.payload;
      }
    );
    builder.addCase(getAllFoods.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Food
    builder.addCase(updateFood.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateFood.fulfilled,
      (state, action: PayloadAction<Food>) => {
        state.loading = false;
        state.foods = state.foods.map((food) =>
          food.id === action.payload.id ? action.payload : food
        );
        if (state.currentFood && state.currentFood.id === action.payload.id) {
          state.currentFood = action.payload;
        }
      }
    );
    builder.addCase(updateFood.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Food
    builder.addCase(deleteFood.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteFood.fulfilled,
      (state, action: PayloadAction<Food>) => {
        state.loading = false;
        state.foods = state.foods.filter(
          (food) => food.id !== action.payload.id
        );
        if (state.currentFood && state.currentFood.id === action.payload.id) {
          state.currentFood = null;
        }
      }
    );
    builder.addCase(deleteFood.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Food Review (optional handling)
    builder.addCase(createFoodReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createFoodReview.fulfilled, (state) => {
      state.loading = false;
      // Update reviews if needed
    });
    builder.addCase(createFoodReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const foodgalleryReducer = foodgallerySlice.reducer;
