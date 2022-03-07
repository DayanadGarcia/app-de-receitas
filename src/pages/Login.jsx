import React from 'react';
import PropTypes from 'prop-types';

const MIN_LENGTH = 7;
const EMAIL_REGEX = /\S+@\S+\.\S+/i; // cod regex, dica do colega Maycon Cabral

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isDisabled: true,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    }, () => this.validateLogin());
  };

  validateLogin = () => {
    const { password, email } = this.state;
    const validatePass = password.length < MIN_LENGTH;
    const validateEmail = !EMAIL_REGEX.test(email);
    // return validateEmail || validatePass;
    this.setState({
      isDisabled: validateEmail || validatePass,
      // os dois precisam ser false para habilitar o botao
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { email } = this.state;
    const { history } = this.props;
    localStorage.setItem('mealsToken', '1');
    localStorage.setItem('cocktailsToken', '1');
    localStorage.setItem('user', JSON.stringify({ email }));
    history.push('/foods');
  }

  render() {
    const { email, password, isDisabled } = this.state;
    return (
      <form>
        <label htmlFor="email">
          email
          <input
            data-testid="email-input"
            type="email"
            placeholder="digite o email"
            id="email"
            name="email"
            value={ email }
            onChange={ this.handleChange }
          />
        </label>
        <label htmlFor="password">
          senha
          <input
            data-testid="password-input"
            type="password"
            placeholder="digite a senha"
            name="password"
            value={ password }
            id="password"
            onChange={ this.handleChange }
          />
        </label>
        <button
          type="submit"
          data-testid="login-submit-btn"
          disabled={ isDisabled }
          onClick={ this.handleSubmit }
        >
          Enter
        </button>
      </form>
    );
  }
}
Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
export default Login;
