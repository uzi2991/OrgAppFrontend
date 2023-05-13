import { backendUrl } from '../../../static/js/const';
import axios from 'axios';

describe('API Login', () => {
    it('should login successfully with valid credentials', async () => {
        const userData = {
            email: '21020367@vnu.edu.vn',
            password: '12345678',
        };
        const url = `${backendUrl}/auth/signin`;
        const response = await axios.post(url, userData);
        expect(response.status).toBe(200);
    });

    it('should return error with invalid credentials', async () => {
        const userData = {
            email: '21020367@vnu.edu.vn',
            password: '87654321',
        };

        try {
            const url = `${backendUrl}/auth/signin`;
            await axios.post(url, userData);
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toHaveProperty("msg", "The password is incorrect");
        }
    });

    it('should return error with invalid email or password', async () => {
        const userData = {
            email: 'invalidemail',
            password: '12345678',
        };

        try {
            const url = `${backendUrl}/auth/signin`;
            await axios.post(url, userData);
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toHaveProperty("msg", "The account does not exist");
        }
    });
});