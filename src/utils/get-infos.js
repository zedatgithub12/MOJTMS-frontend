import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setbasicinfos } from 'store/actions';
import Connections from 'api';

const GetBasicInfos = () => {
    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            const Api = Connections.api + Connections.getinfos;
            const token = sessionStorage.getItem('token');

            const response = await fetch(Api, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                dispatch(setbasicinfos(data.data));
            }
        } catch (error) {
            console.log(error);
        }
    };

    fetchData();

    return null;
};

export default GetBasicInfos;
