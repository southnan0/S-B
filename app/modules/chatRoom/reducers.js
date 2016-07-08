import {createReducer} from '../../appCommon/prefix';
import {chatRoom} from '../setting';
const {actionTypes} = chatRoom;
import Immutable from 'immutable';
import {reducerPrefixer} from '../../appCommon/prefix';

const chat = createReducer(Immutable.fromJS({}), {
    [actionTypes.SET_MESSAGE]: (state, action)=> {
        return Immutable.fromJS(action.payload);
    }
}, 'CHAT_ROOM');

export default reducerPrefixer({chat}, 'CHAT_ROOM')