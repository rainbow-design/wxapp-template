import { _get, _post, _post__qs, _put, RootUrl } from '../utils/fetch';

const api = new Object();

api.authorize = (p) => _post('/api-uaa/oauth/openId/token', p);
module.exports = api;
