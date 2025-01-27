import {
    deleteItem,
    fetchItem,
    fetchItems,
    createItem,
    updateItem,
    createUser
} from 'api/utils';
import {
    apiFailure,
    apiSuccess,
    createValidatorMiddlewares
} from 'utils/apiUtils';
import { clientCredentialsGrant, managementClient } from 'utils/auth0';
import config from 'config';

export const generatePostRequest = (router, model, validator) => {
    const middlewares = createValidatorMiddlewares(validator);
    router.post('/', ...middlewares, async (req, res) => {
        try {
            const item = await createItem(model, req.body);
            return apiSuccess(res, item);
        } catch (err) {
            return apiFailure(res, err.message);
        }
    });
};
export const generatePatchRequest = (router, model) => {
    router.patch('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return updateItem(model, { _id }, req.body)
            .then(items => apiSuccess(res, items))
            .catch(err => apiFailure(res, err.message));
    });
};

export const generateFetchAllRequest = (router, model) => {
    router.get('/', async (req, res, next) =>
        fetchItems(model, req.query)
            .then(items => apiSuccess(res, items))
            .catch(err => apiFailure(res, err.message))
    );
};
export const generateFetchOneRequest = (router, model) => {
    router.get('/:_id', async (req, res, next) => {
        const { _id } = req.params;
        return fetchItem(model, { _id })
            .then(item => apiSuccess(res, item))
            .catch(err => apiFailure(res, err.message));
    });
};

export const generateDeleteRequest = (router, model) => {
    router.delete('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return deleteItem(model, { _id })
            .then(items => apiSuccess(res, items))
            .catch(err => apiFailure(res, err.message));
    });
};

export const generateCreateUserRequest = (router, model, validator) => {
    const middlewares = createValidatorMiddlewares(validator);
    router.post('/', ...middlewares, async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const auth = await clientCredentialsGrant();
            const mgmtAuth0 = await managementClient(auth);
            const authUser = await mgmtAuth0.createUser({
                connection: config().connection,
                email: email,
                password: password
            });
            req.body.authId = authUser.user_id;
            const user = await createUser(model, req.body);
            return apiSuccess(res, user);
        } catch (err) {
            return apiFailure(res, err.message);
        }
    });
};
