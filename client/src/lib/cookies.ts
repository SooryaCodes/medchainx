import Cookies from 'js-cookie';

export const setAuthCookies = (token: string, patientId: string) => {
  Cookies.set('token', token, { expires: 30 }); // expires in 30 days
  Cookies.set('patientId', patientId, { expires: 30 });
};

export const clearAuthCookies = () => {
  Cookies.remove('token');
  Cookies.remove('patientId');
}; 