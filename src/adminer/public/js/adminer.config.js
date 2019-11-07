const app_url = window.location.origin;
const eventmap_url = `${app_url}/event-map`;
const activity_url = `${app_url}/activity`;
const login_url = `${app_url}/login`;
const auth_token_url = `${app_url}/auth_token`;
const log_out_url = `${app_url}/logout`;

export default {
  app_url : app_url,
  eventmap_url : eventmap_url,
  activity_url : activity_url,
  login_url : login_url,
  auth_token_url : auth_token_url,
  log_out_url : log_out_url
}