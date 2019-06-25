import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import recipesQuery from './recipesQuery';
import gql from 'graphql-tag';

const updateRecipeStarredMutation = gql`
        mutation updateRecipeStarred($id: ID!, $isStarred: Bollean!) {
            updateRecipeStarred(id: $id, isStarred: $isStarred) @client
        }
    `;

export default class Recipes extends Component {

    state = {
        vegetarian: false
    }

    updateVegetarian = ({ target: { checked }}) => {
        this.setState({ vegetarian: checked })
    }

    render() {
        return (
            <React.Fragment>
                <label>
                    <input
                        type="checkbox"
                        checked={this.state.vegetarian}
                        onChange={this.updateVegetarian}
                    />
                    <span>Vegetarian Options</span>
                </label>
                <Query
                query={recipesQuery}
                variables={{ vegetarian: this.state.vegetarian }}
                >
                {({ data, loading, error }) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>Something went wrong!</p> 
                    if (data.recipes === undefined) return null;
                    return (
                    <ul>
                        {data.recipes.map(({ id, title, isStarred }) =>
                            <li key={id}>
                                {title}
                                <Mutation
                                    mutation={updateRecipeStarredMutation}
                                    refetchQueries={[
                                        {
                                            query: recipesQuery,
                                            variables: { vegetarian: false }
                                        },
                                        {
                                            query: recipesQuery,
                                            variables: { vegetarian: true }
                                        }
                                    ]}
                                    awaitRefetchQueries={ true }
                                >

                                    {(updateRecipesStarred, { loading, error }) => (
                                        <button 
                                            onClick={() =>
                                                updateRecipesStarred({
                                                    variables: {
                                                        id,
                                                        isStarred: !isStarred
                                                    }
                                                })
                                            }
                                            className="star-btn"
                                            style={{ 
                                                color: isStarred ? "orange" : "grey",
                                                animation: loading ? 
                                                "inflate 0.7s ease infinite alternate" :
                                                "none"
                                            }}
                                        >
                                            ✩
                                            {error && "Failed to Update"}
                                            
                                        </button>
                                    )}
                                    
                                </Mutation>
                            </li>
                        )}
                    </ul>
                    )
                }}
                </Query>
            </React.Fragment>
        )
    }
}