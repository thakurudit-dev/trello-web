import DEVELOPMENT_CONFIG from "./config";
import axios from "axios";

export default {
    postRequest: (url, data) => {
        let token = localStorage.getItem("token")
        let config = {
            method: "post",
            url: DEVELOPMENT_CONFIG.base_url + "/api/v1/" + url,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            data: data
        };
        const response = axios(config)
            .then(async (response) => {
                // console.log("response POST : ", response)
                if (response.data.code === DEVELOPMENT_CONFIG.statusCode) {
                    // console.log("AAA")
                    return response.data
                }
                else {
                    // console.log("BBB")
                    return response.data
                }
            })
            .catch((error) => {
                // CHECK ( OR SEND NETWORK ERROR )
                // console.log("CCC", error)
                // return error
                return error.response.data
            });
        return response;
    },

    getRequest: function (url, data) {
        let token = localStorage.getItem("token")
        var config = {
            method: "get",
            url: DEVELOPMENT_CONFIG.base_url + "/api/v1/" + url,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            data: data,
        };
        const response = axios(config)
            .then(async (response) => {
                // console.log("response GET : ", response)
                if (response.data.code === DEVELOPMENT_CONFIG.statusCode) {
                    // console.log("111")
                    return response.data
                }
                // console.log("222")
            })
            .catch((error) => {
                // CHECK ( OR SEND NETWORK ERROR )
                // console.log("333")
                // return error
                return error.response.data
            });
        return response;
    },
}
