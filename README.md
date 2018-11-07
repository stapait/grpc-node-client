# grpc-node-server
A gRPC client written in Node.js to talk with our Golang Server

The purpose is to benchmark how many requests client can make to server.

There are two applications: one server written in Go (golang-grpc-server) and other written in Node.js (node-grpc-client).

Get both from repositories so they can talk with each other and you can get some benchmarks.

### Installing dependencies
```
$ npm install
```

### Running a gRPC benchmark with 10000 requests
```
$ node client.js 10000
```

Medium article: https://medium.com/me/stats/post/35a4d3ef7bf4?source=main_stats_page