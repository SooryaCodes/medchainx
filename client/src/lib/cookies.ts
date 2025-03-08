import Cookies from 'js-cookie';

export const setAuthCookies = (token: string, userId: string, userType: 'patient' | 'doctor' | 'hospital' = 'patient') => {
  Cookies.set('token', token, { expires: 30 }); // expires in 30 days
  
  if (userType === 'patient') {
    Cookies.set('patientId', userId, { expires: 30 });
  } else if (userType === 'doctor') {
    Cookies.set('doctorId', userId, { expires: 30 });
  } else if (userType === 'hospital') {
    Cookies.set('hospitalId', userId, { expires: 30 });
  }
  
  Cookies.set('userType', userType, { expires: 30 });
};

export const clearAuthCookies = () => {
  Cookies.remove('token');
  Cookies.remove('patientId');
  Cookies.remove('doctorId');
  Cookies.remove('hospitalId');
  Cookies.remove('userType');
}; 