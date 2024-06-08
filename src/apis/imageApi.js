import api from "./api";

const apiImage = async (imageName) => {
    let response;
    if ((imageName + "").includes("http"))
        return imageName;
    if (!/\.\w+$/.test(imageName)) {
        imageName += ".png";
    }
    response = await api(`/api/private/images/${imageName}`, {
        method: "GET",
        headers: {
            Accept: "*/*",
            'Date': new Date().toUTCString(),
            'ETag': 'W/"9c7-IuQSuV8lE/RHBShKc7uVZzHUrLo"',
            'Keep-Alive': 'timeout=5',
            'X-Powered-By': 'Express'
        },
    });
    console.log(response, imageName, "ASSS");
    // Assuming response.data contains the URL of the image
    // You can set it in state or directly render it
    return response;
};

export default apiImage;
