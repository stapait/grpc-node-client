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
  }
);

const calculatorPackage = grpc.loadPackageDefinition(packageDefinition).calculator;
const calculatorService = new calculatorPackage.Calculator('localhost:50051', grpc.credentials.createInsecure());

const totalRequests = process.argv[2];

const MAX_PARALLEL_REQUESTS = 1000;

const benchmarkGRPC = async () => {
  let counter = 0;  
  
  return new Promise((resolve) => {
    for (let i = 1; i < totalRequests; i++) {
      calculatorService.Sum({ number1: 10, number2: 20 }, (err, response) => {
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

const startBenchmark = async () => {
  console.log(`Starting benchmarking with ${totalRequests} requests`);
  console.log();

  startTime = new Date();
  await benchmarkGRPC();
  elapsed = new Date() - startTime;
  console.log(`RPC Total time: ${elapsed} ms - ${Math.round(totalRequests / (elapsed/1000))} requests/s`);
}

startBenchmark();