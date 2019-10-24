'use strict';

const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const server = Hapi.server({
    port: 3101,
    host: 'localhost'
});

/* const main = async () => {
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello World!';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
}); */
server.route([
    {
        method: 'GET',
        path: '/',
        handler: (request,h) =>{
            return 'I am root route'
        }
    },{
        method: 'GET',
        path: '/hello',
        handler: (request,h)=>{
            return {msg: '今日は'}
        }
    },{
        method: 'POST',
        path: '/register',
        handler: (request,h)=>{
            return {msg: 'I am register using post'}
        }
    },
    {
        method: 'POST',
        path: '/persegi',
        config: {
            validate: {
                payload: {
                    panjang: Joi.number().min(1).required(),
                    lebar: Joi.number().min(1).required()
                }
            }
        },
        handler: (request,h)=>{
            console.log(request.payload); //cek parameter inputan form
            let panjangRequest= parseInt(request.payload.panjang);
            let lebarRequest = parseInt(request.payload.lebar);
            let hasilLuas = panjangRequest * lebarRequest;
            const contohArray={
                panjang: panjangRequest,
                lebar: lebarRequest,
                hasil: hasilLuas
            }   
            const data = {
                statusCode: 200,
                info: 'hitung luas persegi',
                content: contohArray
            }//bikin response berbentuk JSON
            return h.response(data).code(data.statusCode) //return output JSON
        }
    },
    {
        method: 'POST',
        path: '/ganjilgenap',
        config: {
            validate: {
                payload: {
                    angka: Joi.number().min(1).required()
                }
            }
        },
        handler: (request,h)=>{
            console.log(request.payload); //cek parameter inputan form
            let input_num= parseInt(request.payload.angka);
            let status;
            if((input_num%2==0)){
                status = 'angka input adalah genap';
            }else if((input_num%2)!=0){
                status = 'angka input adalah ganjil';
            };
            const data = {statusCode: 200 ,data: 'tentukan ganjil genap',...request.payload,keterangan: status}//bikin response berbentuk JSON
            return h.response(data).code(data.statusCode) //return output JSON
        }
    }
])
const main = async()=>{
    await server.register(require('./src/routes/users.js'));
    await server.start()
    return server
}
main().then(server=>{
    console.log('Server running at:',server.info.uri)
}).catch(err =>{
    console.log(err)
    process.exit(1)
});