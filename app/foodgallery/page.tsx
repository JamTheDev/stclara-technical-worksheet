"use client";

import { checkUserLoggedIn } from "@/lib/actions/auth.actions";
import {
  getAllFoods,
  createFood,
  updateFood,
  deleteFood,
  createFoodReview,
  getFoodReviews,
  deleteFoodReview,
} from "@/lib/actions/foodgallery.actions";
import {
  AuthState,
  useAppDispatch,
  useAppSelector,
  useFoodGalleryDispatch,
  useFoodGallerySelector,
} from "@/lib/store";
import { RootState } from "@/lib/stores/todo.store";
import { generateCUID } from "@/utils/cuid";
import { User } from "@supabase/supabase-js";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";

interface Food {
  id: string;
  attachment: string;
  name?: string;
  uploadDate?: string;
}

interface Review {
  id: string;
  content: string;
  createdAt: Date;
}

const FoodGalleryPage: React.FC = () => {
  const dispatch = useFoodGalleryDispatch();
  const { foods, loading, error } = useFoodGallerySelector(
    (state: any) => state.foodgallery
  );
  const appDispatch = useAppDispatch();
  const [newFoodFile, setNewFoodFile] = useState<File | null>(null);
  const [newFoodName, setNewFoodName] = useState<string>("");
  const [sortKey, setSortKey] = useState<"name" | "uploadDate">("name");
  const [reviewInputs, setReviewInputs] = useState<Record<string, string>>({});
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>({});
  const [updateNameInputs, setUpdateNameInputs] = useState<
    Record<string, string>
  >({});

  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    const userRequest = appDispatch(checkUserLoggedIn());
    if (userRequest) {
      userRequest.then((data: any) => {
        setUser(data.payload.user);
      });
    }
    dispatch(getAllFoods()).then((data: any) => {
      data.payload.forEach((food: any) => {
        addFoodReviewToList(food.id, food.reviews);
      });
    });
  }, [dispatch]);

  const addFoodReviewToList = (foodId: string, data: any) => {
    const newReviewsMap: Record<string, Review[]> = {};
    console.log(data);
    data.forEach((review: Review) => {
      if (newReviewsMap[foodId]) {
        newReviewsMap[foodId].push(review);
      } else {
        newReviewsMap[foodId] = [review];
      }
    });
    setReviewsMap(newReviewsMap);
  };

  const removeFoodReviews = (foodId: string) => {
    const newReviewsMap = { ...reviewsMap };
    if (newReviewsMap[foodId] && newReviewsMap[foodId].length > 3) {
      newReviewsMap[foodId] = newReviewsMap[foodId].slice(0, 3);
    }
    setReviewsMap(newReviewsMap);
  };

  const handleNewFoodChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFoodFile(e.target.files[0]);
    }
  };

  const handleCreateFood = async (e: FormEvent) => {
    e.preventDefault();
    if (newFoodFile) {
      await dispatch(createFood({ file: newFoodFile, name: newFoodName }));
      setNewFoodFile(null);
      setNewFoodName("");
    }
  };

  const handleUpdateFood = async (foodId: string, file: File) => {
    await dispatch(updateFood({ id: foodId, file }));
  };

  const handleUpdateName = async (foodId: string) => {
    const newName = updateNameInputs[foodId];
    if (!newName) return;
    await dispatch(updateFood({ id: foodId, name: newName }));
    setUpdateNameInputs((prev) => ({ ...prev, [foodId]: "" }));
  };

  const handleDeleteFood = async (foodId: string) => {
    await dispatch(deleteFood(foodId));
    setReviewsMap((prev) => {
      const newMap = { ...prev };
      delete newMap[foodId];
      return newMap;
    });
  };

  const handleReviewsExpansion = async (foodId: string) => {
    console.log("Expanding Food Reviews");
    const result = await dispatch(getFoodReviews(foodId));
    console.log(result.payload);
    addFoodReviewToList(foodId, result.payload);
  };

  const sortedFoods: Food[] = [...foods].sort((a, b) => {
    if (sortKey === "name") {
      const nameA = a.name || "";
      const nameB = b.name || "";
      return nameA.localeCompare(nameB);
    } else {
      const dateA = a.uploadDate ? new Date(a.uploadDate) : new Date(0);
      const dateB = b.uploadDate ? new Date(b.uploadDate) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    }
  });

  const handleReviewInputChange = (foodId: string, value: string) => {
    setReviewInputs((prev) => ({ ...prev, [foodId]: value }));
  };

  const handleAddReview = async (foodId: string) => {
    const content = reviewInputs[foodId];
    if (!content) return;
    const newReview: Review = {
      id: generateCUID(),
      content,
      createdAt: new Date(),
    };

    toast.promise(dispatch(createFoodReview({ foodId, content })), {
      loading: "Adding review...",
      success: (data) => {
        setReviewsMap((prev) => ({
          ...prev,
          [foodId]: prev[foodId] ? [...prev[foodId], newReview] : [newReview],
        }));
        setReviewInputs((prev) => ({ ...prev, [foodId]: "" }));
        return `Review added!`;
      },
      error: "Failed to add review, please try again.",
    });
  };

  const handleDeleteReview = (foodId: string, reviewId: string) => {
        toast.promise(dispatch(deleteFoodReview(reviewId)), {
          loading: "Deleting review...",
          success: (data) => {
            setReviewsMap((prev) => ({
              ...prev,
              [foodId]: prev[foodId].filter((review) => review.id !== reviewId),
            }));
            return "Review deleted!";
          },
          error: "Failed to delete review, please try again.",
        });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white text-black">
      <h1 className="text-3xl font-bold text-center mb-8">Food Gallery</h1>

      {/* Create Food */}
      <section className="mb-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Food Photo</h2>
        <form
          onSubmit={handleCreateFood}
          className="flex flex-col sm:flex-row items-center"
        >
          <input
            type="text"
            placeholder="Food Name"
            value={newFoodName}
            onChange={(e) => setNewFoodName(e.target.value)}
            className="mb-2 sm:mb-0 sm:mr-4 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleNewFoodChange}
            className="mb-2 sm:mb-0 sm:mr-4 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Upload
          </button>
        </form>
      </section>

      {/* Sorting Options */}
      <section className="mb-8 flex items-center">
        <label className="font-medium">
          Sort by:{" "}
          <select
            value={sortKey}
            onChange={(e) =>
              setSortKey(e.target.value as "name" | "uploadDate")
            }
            className="ml-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Photo Name</option>
            <option value="uploadDate">Upload Date</option>
          </select>
        </label>
      </section>

      {/* Food List */}
      <section>
        {loading && (
          <p className="text-gray-500 text-center">Loading foods...</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {sortedFoods.map((food) => (
          <div
            key={food.id}
            className="bg-white shadow rounded-lg p-6 mb-6 border border-gray-200"
          >
            <div className="flex flex-col md:flex-row items-center">
              <img
                src={food.attachment}
                alt={food.name || "Food"}
                className="w-40 h-40 object-cover rounded-md shadow mr-0 md:mr-6 mb-4 md:mb-0"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">
                  {food.name || "Unnamed Photo"}
                </h3>
                <p className="text-gray-600">
                  Uploaded:{" "}
                  {food.uploadDate
                    ? new Date(food.uploadDate).toLocaleString()
                    : "Unknown"}
                </p>
              </div>
              <div className="flex flex-col items-center mt-4 md:mt-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      handleUpdateFood(food.id, e.target.files[0]);
                    }
                  }}
                  className="mb-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleDeleteFood(food.id)}
                  className="bg-red-600 text-white font-medium py-2 px-4 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Reviews & Update Name Section */}
            <div className="mt-6 border-t pt-4">
              <div className="mb-4">
                <label
                  className="block font-medium mb-1"
                  htmlFor={`updateName-${food.id}`}
                >
                  Update Name:
                </label>
                <div className="flex">
                  <input
                    id={`updateName-${food.id}`}
                    type="text"
                    placeholder="New name"
                    value={updateNameInputs[food.id] || ""}
                    onChange={(e) =>
                      setUpdateNameInputs((prev) => ({
                        ...prev,
                        [food.id]: e.target.value,
                      }))
                    }
                    className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleUpdateName(food.id)}
                    className="ml-3 bg-green-600 text-white font-medium py-2 px-4 rounded hover:bg-green-700 transition"
                  >
                    Update Name
                  </button>
                </div>
              </div>

              <h4 className="text-xl font-semibold mb-3">Reviews</h4>
              {(reviewsMap[food.id] || []).map((review) => (
                <div
                  key={review.id}
                  className="flex justify-between items-start mb-3 p-3 bg-gray-50 rounded-md border border-gray-200"
                >
                  <div>
                    <p className="text-gray-800">{review.content}</p>
                    <small className="text-gray-500">
                      {new Date(review.createdAt).toLocaleString()}
                    </small>
                  </div>
                  {user && user?.id === (review as any).createdById && (
                    <button
                      onClick={() => handleDeleteReview(food.id, review.id)}
                      className="ml-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}

              {reviewsMap[food.id] && reviewsMap[food.id].length >= 3 && (
                <div className="flex items-end justify-end">
                  <button
                    className="rounded-full border-[1px] border-gray-300 shadow-xl p-2 flex flex-row items-center justify-center gap-2"
                    onClick={() =>
                      reviewsMap[food.id].length <= 3
                        ? handleReviewsExpansion(food.id)
                        : removeFoodReviews(food.id)
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {reviewsMap[food.id].length <= 3 ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 15l-7-7-7 7"
                        />
                      )}
                    </svg>
                    <span>
                      {reviewsMap[food.id].length <= 3
                        ? "See more"
                        : "See less"}
                    </span>
                  </button>
                </div>
              )}

              <div className="flex items-center mt-4">
                <input
                  type="text"
                  placeholder="Add a review..."
                  value={reviewInputs[food.id] || ""}
                  onChange={(e) =>
                    handleReviewInputChange(food.id, e.target.value)
                  }
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleAddReview(food.id)}
                  className="ml-3 bg-green-600 text-white font-medium py-2 px-4 rounded hover:bg-green-700 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default FoodGalleryPage;
