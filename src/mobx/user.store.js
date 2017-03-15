import { observable } from 'mobx';
import appService from '../services/app.service';

class UserStore {
    @observable user = {};
    constructor() {
        this.getUserInfo();
    }
    getUserInfo() {
        appService.getUserInfo().then(result => {
            this.user = result.data;
        });
    }
}
export default new UserStore();
