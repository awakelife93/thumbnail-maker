# fluent-ffmpeg video thumbnail maker

## only exports wanted thumbnail
### author: Hyunwoo.Park
### THANKS fluent-ffmpeg

* guide here https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
* this module config guide

```
라이브 스트리밍 파일은 도데체 어떻게 썸네일을 축출 할 수가 있는가?

그래서 시작하였다.
축출해보자!
(ffmepg 별도 설치 필요!!)
```

```
note

can you use aws s3 bucket upload
please check setting ./lib/s3.json 

```

```
count = exports image count
filename = exports image name
outputPath = exports image output path
size = exports image size
isS3Upload = s3 upload flag
bucketName: s3 bucket name

config = {
    count: number,
    filename: string,
    outputPath: string,
    size: string,
    isS3Upload: boolean,
    bucketName: string
}

maker(config)
.then(file => {
    console.log(file);
});
```