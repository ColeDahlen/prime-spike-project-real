import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fileUpload(action){
    console.log('****************',action.payload)
    const response = yield axios({
        method: 'POST',
        url: '/upload',
        data: action.payload
    })
    yield put({
        type: 'SET_IMAGE',
        payload: response.data
    })
}
function* fileSaga() {
    yield takeLatest('SEND_FILE', fileUpload);
}
export default fileSaga;