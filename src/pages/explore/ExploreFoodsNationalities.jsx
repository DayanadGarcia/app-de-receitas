import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { nationApi, filterCountrie } from '../../services/nationAPI';
import FoodCard from '../components/FoodCard';
import { foodsAPIOnLoad } from '../../services/APIsOnLoad';

export default class ExploreFoodsNationalities extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nationalities: [],
      filtredNationalities: [],
      recipesOnLoad: [],
      recipes: [],
    };
    this.mapNationalities = this.mapNationalities.bind(this);
  }

  componentDidMount() {
    this.getNationalities();
    this.fetchFoods();
  }

  fetchFoods = async () => {
    const getFoods = await foodsAPIOnLoad();
    this.setState({
      recipesOnLoad: getFoods,
    });
  }

  filterCountriesApi = async (countrie) => {
    const getFoods = await foodsAPIOnLoad();
    if (countrie === 'All') {
      this.setState({
        recipes: getFoods,
      });
    } else {
      const filtred = await filterCountrie(countrie);
      this.setState({
        recipes: filtred,
      });
    }
  }

  getNationalities = async () => {
    const fetchNationalities = await nationApi();
    this.setState({
      nationalities: fetchNationalities,
    }, () => this.mapNationalities());
  }

  mapNationalities() {
    const { nationalities } = this.state;
    const filtred = nationalities.map(({ strArea }) => strArea);
    this.setState({
      filtredNationalities: filtred,
    });
  }

  render() {
    const { history } = this.props;
    const { filtredNationalities, recipesOnLoad, recipes } = this.state;
    return (
      <div>
        <Header
          history={ history }
          name="Explore Nationalities"
          hideSearch={ false }
          drinkPage={ false }
        />
        <select
          onChange={ (event) => this.filterCountriesApi(event.target.value) }
          data-testid="explore-by-nationality-dropdown"
        >
          <option data-testid="All-option" value="All">All</option>
          {filtredNationalities.map((countrie) => (
            <option
              data-testid={ `${countrie}-option` }
              key={ countrie }
              value={ countrie }
            >
              {countrie}
            </option>
          ))}
        </select>
        {recipes.length <= 0 ? (
          <FoodCard allRecipes={ recipesOnLoad } />
        ) : <FoodCard allRecipes={ recipes } /> }
        <Footer />
      </div>
    );
  }
}

ExploreFoodsNationalities.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
