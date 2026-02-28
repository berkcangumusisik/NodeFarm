const fs = require('fs'); // Bu bize dosya işlemleri yapmak için bir modül sağlar.
const http = require('http'); // Bu bize HTTP istekleri yapmak için bir modül sağlar.
const url = require('url'); // Bu bize URL işlemleri yapmak için bir modül sağlar.


//Server
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName); // .replace() methodu ile temp'in içindeki {%PRODUCTNAME%} kısmını product.productName ile değiştirir.
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%ID%}/g, product.id);
    return output;
};

const tempOverview = fs.readFileSync("./templates/template-overview.html", "utf-8");
const tempProduct = fs.readFileSync("./templates/template-product.html", "utf-8");
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");

const data = fs.readFileSync("./dev-data/data.json", "utf-8"); // Bu bize data.json dosyasını okur.
const dataObj = JSON.parse(data); // JSON.parse() methodu ile data'yı JSON formatına çevirir.
const server = http.createServer((req, res) => {
    const pathName = req.url; // Bu bize isteğin URL'sini verir.
    if(pathName === "/" || pathName === "/overview"){
        res.writeHead(200, { 
            "Content-type": "text/html",
        }); 
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
        res.end(output); // res.end() methodu ile yanıt gönderir.


    } else if(pathName === "/product"){
        res.end("This is the product page");
    } else if(pathName === "/api"){
        res.writeHead(200, { 
            "Content-type": "application/json",
        }); // writeHead() methodu ile yanıtın headers'ını ayarlar.
        res.end(dataObj); // res.end() methodu ile yanıt gönderir.
    } else {
        res.writeHead(404, {
            "Content-type": "text/html", // Bu bize yanıtın content type'ını ayarlar.
            "my-own-header": "hello-world", // Bu bize yanıtın headers'ını ayarlar.
        }); // writeHead() methodu ile yanıtın headers'ını ayarlar.
        res.end("<h1>This page could not be found</h1>"); // res.end() methodu ile yanıt gönderir.
    }
}); // server.createServer() methodu ile bir HTTP sunucusu oluşturur.

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening to requests on port 8000");
}); // server.listen() methodu ile sunucuyu başlatır. 

// projeyi başlatmak için terminalde node index.js yazın.