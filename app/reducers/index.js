import {combineReducers} from 'redux';
import {reducerPrefixer} from '../appCommon/prefix';
/*import items from './items';
 import filter from './filter';*/
import chat from '../modules/chatRoom/reducers';
//import {SET_DATA} from '../constants';

/*function data(state = {}, action) {
 switch (action.type) {
 case SET_DATA:
 return action.payload;
 default:
 return state
 }
 }*/

export default combineReducers({
    /*items,
     filter,
     data,*/
    ...chat
})