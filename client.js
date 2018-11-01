const PROTO_PATH = './calculator.proto';

var grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const calculatorPackage = grpc.loadPackageDefinition(packageDefinition).calculator;
const calculatorService = new calculatorPackage.Calculator('localhost:50051', grpc.credentials.createInsecure());

for (let i = 1; i < 1000; i++) {
  calculatorService.Sum({ number1: 1, number2: 2 }, (err, response) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Result:', response.result);
  })
}
