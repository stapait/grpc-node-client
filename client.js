const PROTO_PATH = './calculator.proto';

var grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const request = require('request');

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

const totalRequests = process.argv[2];

const benchmarkGRPC = async () => {
  let counter = 0;
  return new Promise((resolve) => {
    for (let i = 1; i < totalRequests; i++) {
      calculatorService.Sum({ number1: Math.round(Math.random() * 1000), number2: Math.round(Math.random() * 1000) }, (err, response) => {
        if (err) {
          console.log(err);
        }
        if (++counter === totalRequests-1) {
          return resolve();
        }
      });
    }
  });
};

const benchmarkREST = async () => {
  let counter = 0;
  const url = 'http://localhost:8080/sum';

  return new Promise((resolve) => {
    for (let i = 1; i < totalRequests; i++) {
      let args = {
        query: {
          number1: Math.round(Math.random() * 1000),
          number2: Math.round(Math.random() * 1000)
        }
      };

      request.get(url, args, (err, response) => {
        if (err) {
          console.log(err);
        }
        if (++counter === totalRequests-1) {
          return resolve();
        }
      });
    }
  });
};

const startBenchmarks = async () => {
  console.log(`Starting benchmarking with ${totalRequests} requests`);
  console.log();

  let startTime = new Date();
  await benchmarkGRPC();
  let elapsed = new Date() - startTime;
  console.log(`RPC Total time: ${elapsed} ms - ${Math.round(totalRequests / (elapsed/1000))} requests/s`);

  console.log();

  startTime = new Date();
  await benchmarkREST();
  elapsed = new Date() - startTime;
  console.log(`REST Total time: ${elapsed} ms - ${Math.round(totalRequests / (elapsed/1000))} requests/s`);
}

startBenchmarks();