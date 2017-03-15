import { getJSON, post } from '../utils/ajax';

export default {
    getUserInfo() {
        if (process.env.NODE_ENV === 'development') {
            return getJSON('/json/app/user-info.json');
        }
        return getJSON('/userinfo');
    },
};

