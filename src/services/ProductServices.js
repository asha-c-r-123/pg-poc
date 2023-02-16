
export class ProductService {

    getProducts() {
        return fetch('data/db.json').then(res => res.json()).then(d => d.data);
    }

}