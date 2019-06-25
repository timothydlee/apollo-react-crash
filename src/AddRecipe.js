import React, { Component } from 'react';
import Recipes from './Recipes';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import recipesQuery from './recipesQuery';

const addRecipeMutation = gql`
    mutation addRecipe($recipe: RecipeInput!) {
        addRecipe(recipe: $recipe) {
            id
            title
        }
    }
`

export default class AddRecipe extends Component {
    state = {
        title: "",
        vegetarian: false
    }

    updateVegetarian = ({ target: { checked } }) => {
        this.setState({ vegetarian: checked });
    };

    updateTitle = ({ target: { value } }) => {
        this.setState({ title: value });
    };

    resetFields = () => {
        this.setState({ title: "", vegetarian: false });
    };

    render() {
        return (
            <Mutation 
                mutation={addRecipeMutation}
                refetchQueries={[
                    {
                        query: recipesQuery,
                        variables: { vegetarian: true }
                    },
                    {
                        query: recipesQuery,
                        variables: { vegetarian: false }
                    }
                ]}
                awaitRefetchQueries={true}
            >
                {(addRecipe, { loading, error }) => (
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        addRecipe({
                            variables: {
                                recipe: {
                                    title: this.state.title,
                                    vegetarian: this.state.vegetarian
                                }
                            }
                        })
                        this.resetFields();
                    }}
                >
                    <label>
                        <span>Title</span>
                        <input
                            type="text"
                            value={this.state.title}
                            onChange={this.updateTitle}
                        />
                    </label>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={this.state.vegetarian}
                                onChange={this.updateVegetarian}
                            />
                            <span>Vegetarian</span>
                        </label>
                    </div>
                    <div>
                        <button>Add Recipe</button>
                        { loading && <p>Loading...</p>}
                        { error && <p>Error - please try again</p>}
                    </div>
                    <div>
                        <Recipes/>
                    </div>
                </form>
            )}
            </Mutation>
        )
    }
}