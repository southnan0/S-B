import _ from 'lodash';

export const actionPrefixer = (actions, prefix, spliter = '__')=> {
    let obj = {};
    if (actions.shift) {
        actions.map((item)=> {
            obj[item] = prefix + spliter + item;
        })
    } else {
        obj[actions] = prefix + spliter + actions;
    }
    return obj;
};

export const reducerPrefixer = (reducers, prefix, spliter = '__')=> {
    let obj = {};
    for (var key in reducers) {
        obj[prefix + spliter + key] = reducers[key];
    }
    return obj;
};

export const removeReducerPrefixer = (reducers, prefix, spliter = '__')=> {
    let obj = {};
    for (var key in reducers) {
        let arrKey = key.split(spliter);
        let keyPrefix = arrKey[0];
        if (keyPrefix === prefix || _.isEmpty(keyPrefix)) {
            obj[arrKey[1]] = reducers[key];
        }
    }
    return obj;
};

export const createReducer = (initialState, obj, prefix, spliter = '__')=>(state = initialState, action)=> {
    let arrAction = action.type.split(spliter);
    if (_.isEmpty(arrAction[0]) !== prefix && obj[action.type]) {
        return obj[action.type](state, action);
    } else {
        return state;
    }
};