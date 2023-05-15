import { backendUrl } from '../../../static/js/const';
import axios from 'axios';

describe('API Get user info', () => {
    it('should return user info', async () => {
        const userData = {
            email: '21020367@vnu.edu.vn',
            password: '12345678'
        };
        const urlSignin = `${backendUrl}/auth/signin`;
        const res = await axios.post(urlSignin, userData);
        const token = res.data.token;

        const url = `${backendUrl}/project`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        expect(response.status).toBe(200);
    });
});