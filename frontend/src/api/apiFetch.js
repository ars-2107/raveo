import axios from "axios";
import apiConfig from "./apiConfig";

const headers = {
    Authorization: "bearer " + apiConfig.apiKey,
};

export const apiFetch = async (url, params) => {
    try {
        const { data } = await axios.get(apiConfig.baseUrl + url, {
            headers,
            params,
        });
        return data;
    } catch (err) {
        console.error(err);
        return err;
    }
};