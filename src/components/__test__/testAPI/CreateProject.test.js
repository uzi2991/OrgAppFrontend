import { backendUrl } from '../../../static/js/const';
import axios from 'axios';

describe('API Create Project', () => {
    it('create success', async () => {
        const userData = {
            email: '21020367@vnu.edu.vn',
            password: '12345678'
        };
        const urlSignin = `${backendUrl}/auth/signin`;
        const res = await axios.post(urlSignin, userData);
        const token = res.data.token;


        const projectData = {
            title: 'new project',
            description: ''
        };
        const url = `${backendUrl}/project`;
        const response = await axios.post(url, projectData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        expect(response.status).toBe(201);
    });
});