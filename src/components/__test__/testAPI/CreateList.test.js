import { backendUrl } from '../../../static/js/const';
import axios from 'axios';

describe('API Create List', () => {
    let listID;
    beforeEach(() => {
        listID = '';
    });
    it('create list success', async () => {
        const userData = {
            email: '21020367@vnu.edu.vn',
            password: '12345678'
        };
        const urlSignin = `${backendUrl}/auth/signin`;
        const res = await axios.post(urlSignin, userData);
        const token = res.data.token;


        const listData = {
            title: 'new list',
            project: '645fa2fa0983d15cc08b5597'
        };
        const url = `${backendUrl}/list`;
        const response = await axios.post(url, listData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        listID = response.data._id;
        expect(response.status).toBe(201);
    });
});