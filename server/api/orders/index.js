import { generatePostRequest } from 'api/requestGenerators';
// custom order create API
export const createOrder = (app, model, validator) => {
    // this is just an example of how you would create a custom API
    generatePostRequest(app, model, validator);
};
