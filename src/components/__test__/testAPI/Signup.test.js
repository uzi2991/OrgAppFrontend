import { backendUrl } from '../../../static/js/const';
import axios from 'axios';

describe('API Register User', () => {
    let id;
    it('should register a new user', async () => {
        const userData = {
            email: 'exampleeee@gmail.com',
            password: '12345678',
            first_name: 'John',
            last_name: 'Doe'
        };
        const url = `${backendUrl}/auth/signup`;
        const response = await axios.post(url, userData);
        expect(response.status).toBe(201);

        id = response.data._id;
    });
    it('email already exists', async () => {
        const userData = {
            email: '21020367@vnu.edu.vn',
            password: '12345678',
            first_name: 'Nghia',
            last_name: 'Nguyen'
        };

        try {
            const url = `${backendUrl}/auth/signup`;
            await axios.post(url, userData);
        } catch (error) {
            expect(error.response.status).toBe(400);
        }
    });
    // afterAll(async () => {
    //     // Xóa tài khoản đã tạo trong quá trình test
    //     const deleteAccountUrl = `${backendUrl}/user/${id}`;
    //     await axios.delete(deleteAccountUrl, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //   });
});