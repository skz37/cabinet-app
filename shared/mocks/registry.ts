// Every mock file the app can serve. Metro only bundles require() calls with a
// plain string literal, so add a line here when a service needs a new file.
export const mocks = {
  errors: {
    serverError: require('../../mobile-mock-api/_errors/500-server-error.json'),
  },
  auth: {
    loginRequest: require('../../mobile-mock-api/auth/POST_auth_login.request.json'),
    login: require('../../mobile-mock-api/auth/POST_auth_login.response.json'),
    loginBadCredentials: require('../../mobile-mock-api/auth/POST_auth_login.error-500-bad-credentials.json'),
    refresh: require('../../mobile-mock-api/auth/POST_auth_refresh.response.json'),
    refreshExpired: require('../../mobile-mock-api/auth/POST_auth_refresh.error-500-expired.json'),
    accessTokenClaims: require('../../mobile-mock-api/auth/access-token.decoded-payload.json'),
  },
  patient: {
    me: require('../../mobile-mock-api/patient/GET_patient_me.response.json'),
    meNewPatient: require('../../mobile-mock-api/patient/GET_patient_me.new-patient.json'),
  },
  medecin: {
    list: require('../../mobile-mock-api/medecin/GET_medecin.response.json'),
    listEmpty: require('../../mobile-mock-api/medecin/GET_medecin.empty.json'),
  },
  rdv: {
    byPatient: require('../../mobile-mock-api/rdv/GET_rdv_patient_{idPatient}.response.json'),
    byPatientEmpty: require('../../mobile-mock-api/rdv/GET_rdv_patient_{idPatient}.empty.json'),
  },
  consultation: {
    list: require('../../mobile-mock-api/consultation/GET_consultation.response.json'),
    listEmpty: require('../../mobile-mock-api/consultation/GET_consultation.empty.json'),
  },
  rapport: {
    byPatient: require('../../mobile-mock-api/rapport/GET_rapport_patient_{id}.response.json'),
    byPatientEmpty: require('../../mobile-mock-api/rapport/GET_rapport_patient_{id}.empty.json'),
  },
  radio: {
    byPatient: require('../../mobile-mock-api/radio/GET_Radio_Patient_{id}.response.json'),
    byPatientEmpty: require('../../mobile-mock-api/radio/GET_Radio_Patient_{id}.empty.json'),
  },
  analyse: {
    list: require('../../mobile-mock-api/analyse/GET_analyse.response.json'),
    listEmpty: require('../../mobile-mock-api/analyse/GET_analyse.empty.json'),
  },
};
