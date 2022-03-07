import React from 'react';
import { Link } from 'react-router-dom';
import exploreIcon from '../../images/exploreIcon.svg';
import drinkIcon from '../../images/drinkIcon.svg';
import mealIcon from '../../images/mealIcon.svg';
import '../../styles/footer.css';

class Footer extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {
    return (
      <footer data-testid="footer" className="footer-field">
        <Link
          data-testid="drinks-bottom-btn"
          to="/drinks"
        >
          <img src={ drinkIcon } alt="exploreIcon" />

        </Link>
        <Link
          data-testid="food-bottom-btn"
          to="/foods"
        >
          <img src={ mealIcon } alt="exploreIcon" />

        </Link>
        <Link
          data-testid="explore-bottom-btn"
          to="/explore"
        >
          <img src={ exploreIcon } alt="exploreIcon" />

        </Link>
      </footer>
    );
  }
}

export default Footer;
