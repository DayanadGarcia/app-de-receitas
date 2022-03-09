import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './components/Header';
import Footer from './components/Footer';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
    this.readLocalStorage = this.readLocalStorage.bind(this);
    this.clearLocalStorage = this.clearLocalStorage.bind(this);
  }

  componentDidMount() {
    this.readLocalStorage();
  }

  clearLocalStorage() {
    const { history } = this.props;
    localStorage.clear();
    history.push('/');
  }

  readLocalStorage() {
    const emailLocal = localStorage.getItem('user');
    const emailObj = JSON.parse(emailLocal);

    if (emailObj !== null) {
      const obj = emailObj.email;
      this.setState({
        email: obj,
      });
    }
  }

  render() {
    const { history } = this.props;
    const { email } = this.state;
    return (
      <div>
        <Header history={ history } name="Profile" hideSearch />
        <div>
          <span
            data-testid="profile-email"
            type="email"
            name="email"
          >
            {email}
          </span>
          <button
            onClick={ () => history.push('/done-recipes') }
            data-testid="profile-done-btn"
            type="button"
          >
            Done Recipes
          </button>
          <button
            onClick={ () => history.push('/favorite-recipes') }
            data-testid="profile-favorite-btn"
            type="button"
          >
            Favorite Recipes
          </button>
          <button
            onClick={ this.clearLocalStorage }
            data-testid="profile-logout-btn"
            type="button"
          >
            Logout
          </button>
        </div>
        <Footer />
      </div>
    );
  }
}

Profile.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
