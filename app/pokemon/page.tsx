"use client";

import { checkUserLoggedIn } from "@/lib/actions/auth.actions";
import {
    getAllPokemons,
    createPokemon,
    updatePokemon,
    deletePokemon,
    getPokemonReviews,
    createPokemonReview,
    deletePokemonReview,
} from "@/lib/actions/pokemon.actions";
import { selectPokemonData } from "@/lib/selectors/pokemon.selector";
import { PokemonState, useAppDispatch, usePokemonSelector } from "@/lib/store";
import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";

interface Pokemon {
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

const PokemonGalleryPage: React.FC = () => {
    const dispatch = useAppDispatch();

    // Provide default values to avoid issues when state is absent
    const state = usePokemonSelector(
        (state: PokemonState) => state.pokemons || {}
    );

    const { pokemons, loading, error } = selectPokemonData({ pokemons: state });

    const [newPokemonFile, setNewPokemonFile] = useState<File | null>(null);
    const [newPokemonName, setNewPokemonName] = useState<string>("");
    const [reviewInputs, setReviewInputs] = useState<Record<string, string>>({});
    const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>({});
    const [updateNameInputs, setUpdateNameInputs] = useState<
        Record<string, string>
    >({});
    const [sortingOption, setSortingOption] = useState<"default" | "name" | "date">("default");

    useEffect(() => {
        dispatch(checkUserLoggedIn());
        dispatch(getAllPokemons());
    }, [dispatch]);

    useEffect(() => {
        console.log(pokemons);
    }, [pokemons]);

    const addPokemonReviewToList = (pokemonId: string, reviews: Review[]) => {
        setReviewsMap((prev) => ({
            ...prev,
            [pokemonId]: reviews,
        }));
    };

    const handleNewPokemonChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewPokemonFile(e.target.files[0]);
        }
    };

    const handleCreatePokemon = async (e: FormEvent) => {
        e.preventDefault();
        if (newPokemonFile) {
            toast.promise(
                dispatch(createPokemon({ file: newPokemonFile, name: newPokemonName })),
                {
                    loading: "Adding Pokemon...",
                    success: () => {
                        setNewPokemonFile(null);
                        setNewPokemonName("");
                        return "Successfully Added Pokemon!";
                    },
                    error: "Failed to add Pokemon, please try again.",
                }
            );
        }
    };

    const handleUpdatePokemon = async (pokemonId: string, file: File) => {
        await dispatch(updatePokemon({ id: pokemonId, file }));
    };

    const handleUpdateName = async (pokemonId: string) => {
        const newName = updateNameInputs[pokemonId];
        if (!newName) return;
        await dispatch(updatePokemon({ id: pokemonId, name: newName }));
        setUpdateNameInputs((prev) => ({ ...prev, [pokemonId]: "" }));
    };

    const handleDeletePokemon = async (pokemonId: string) => {
        await dispatch(deletePokemon(pokemonId));
        setReviewsMap((prev) => {
            const newMap = { ...prev };
            delete newMap[pokemonId];
            return newMap;
        });
    };

    const handleReviewsExpansion = async (pokemonId: string) => {
        const result = await dispatch(getPokemonReviews(pokemonId));
        addPokemonReviewToList(pokemonId, result.payload as Review[]);
    };

    const handleReviewInputChange = (pokemonId: string, value: string) => {
        setReviewInputs((prev) => ({ ...prev, [pokemonId]: value }));
    };

    const handleAddReview = async (pokemonId: string) => {
        const content = reviewInputs[pokemonId];
        if (!content) return;
        toast.promise(dispatch(createPokemonReview({ pokemonId, content })), {
            loading: "Adding review...",
            success: () => "Review added!",
            error: "Failed to add review, please try again.",
        });
    };

    const handleDeleteReview = (pokemonId: string, reviewId: string) => {
        toast.promise(dispatch(deletePokemonReview(reviewId)), {
            loading: "Deleting review...",
            success: () => "Review deleted!",
            error: "Failed to delete review, please try again.",
        });
    };

    // Use useMemo to apply sorting on the pokemons list.
    const sortedPokemons = useMemo(() => {
        if (!pokemons) return [];
        const pokemonsCopy = [...pokemons];
        if (sortingOption === "name") {
            pokemonsCopy.sort((a: any, b: any) =>
                (a.name || "").localeCompare(b.name || "")
            );
        } else if (sortingOption === "date") {
            pokemonsCopy.sort((a: any, b: any) => {
              const dateA = a.uploadDate ? new Date(a.uploadDate).getTime() : 0;
              const dateB = b.uploadDate ? new Date(b.uploadDate).getTime() : 0;
              return dateB - dateA; // Latest first
            });
        }
        return pokemonsCopy;
    }, [pokemons, sortingOption]);

    return (
        <div className="p-8 max-w-6xl mx-auto bg-white text-black">
            <h1 className="text-3xl font-bold mb-6">Pokemon Gallery</h1>
            
            {/* Sorting options */}
            <div className="mb-4">
                <label htmlFor="sorting" className="mr-2 font-medium">
                    Sort by:
                </label>
                <select
                    id="sorting"
                    value={sortingOption}
                    onChange={(e) => setSortingOption(e.target.value as "default" | "name" | "date")}
                    className="border p-1 rounded"
                >
                    <option value="default">Default</option>
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                </select>
            </div>

            <form onSubmit={handleCreatePokemon} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewPokemonChange}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Pokemon Name"
                        value={newPokemonName}
                        onChange={(e) => setNewPokemonName(e.target.value)}
                        className="border p-2 rounded flex-1"
                    />
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                        Add Pokemon
                    </button>
                </div>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {sortedPokemons.map((pokemon: Pokemon) => (
                    <div
                        key={pokemon.id}
                        className="border rounded-md overflow-hidden shadow-lg"
                    >
                        <img
                            src={pokemon.attachment}
                            alt={pokemon.name}
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{pokemon.name}</h2>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    placeholder="Update name"
                                    value={updateNameInputs[pokemon.id] || ""}
                                    onChange={(e) =>
                                        setUpdateNameInputs((prev) => ({
                                            ...prev,
                                            [pokemon.id]: e.target.value,
                                        }))
                                    }
                                    className="border p-1 rounded w-full mb-2"
                                />
                                <button
                                    onClick={() => handleUpdateName(pokemon.id)}
                                    className="bg-green-500 text-white p-1 rounded w-full mb-2"
                                >
                                    Update Name
                                </button>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => handleDeletePokemon(pokemon.id)}
                                    className="bg-red-500 text-white p-1 rounded"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleReviewsExpansion(pokemon.id)}
                                    className="bg-blue-500 text-white p-1 rounded"
                                >
                                    Reviews
                                </button>
                            </div>
                            <div className="mt-4">
                                <input
                                    type="text"
                                    placeholder="Add review"
                                    value={reviewInputs[pokemon.id] || ""}
                                    onChange={(e) =>
                                        handleReviewInputChange(pokemon.id, e.target.value)
                                    }
                                    className="border p-1 rounded w-full mb-2"
                                />
                                <button
                                    onClick={() => handleAddReview(pokemon.id)}
                                    className="bg-purple-500 text-white p-1 rounded w-full"
                                >
                                    Add Review
                                </button>
                            </div>
                            {reviewsMap[pokemon.id] && reviewsMap[pokemon.id].length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-semibold">Reviews:</h3>
                                    {reviewsMap[pokemon.id].map((review) => (
                                        <div
                                            key={review.id}
                                            className="flex justify-between items-center border-b py-1"
                                        >
                                            <p className="text-sm">{review.content}</p>
                                            <button
                                                onClick={() =>
                                                    handleDeleteReview(pokemon.id, review.id)
                                                }
                                                className="text-red-500 text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PokemonGalleryPage;
