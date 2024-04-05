import decode from 'jwt-decode';

class AuthService {
  getProfile() {
    const token = this.getToken();
    if (!token) {
        throw new Error('Token not found.');
    }
    return decode(token);
}

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    const token = localStorage.getItem('id_token');
    return token;
  }

  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/login');
  }

  redirectToLogin() {
    window.location.assign('/login');
  }
}

export default new AuthService();
