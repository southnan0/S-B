import Immutable from 'immutable';
import { SET_MESSAGE } from '../constants';

const initialItems = Immutable.fromJS({});

export default function chat(state = initialItems, action) {
    switch(action.type) {
        case SET_MESSAGE:
            return Immutable.fromJS(action.payload);
        default:
            return state;
    }
}