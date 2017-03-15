import { observable } from 'mobx';

class Store {
    @observable config = {
        auth: 1,
    };
}

export default new Store();

