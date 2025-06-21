![image-20250621131043433](https://7r1umph.top/image/20250621131043717.webp)

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl -i http://momo.hackmyvm.eu/0r1g04szt0p/                
HTTP/1.1 200 OK
Server: nginx/1.18.0
Date: Sat, 21 Jun 2025 05:54:19 GMT
Content-Type: text/html
Content-Length: 317
Last-Modified: Sun, 02 Jun 2024 17:47:47 GMT
Connection: keep-alive
ETag: "665cb043-13d"
Accept-Ranges: bytes

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HackMyVM - Sertor</title>
    <link rel="icon" href="logo.png" type="image/png" sizes="16x16">
    <link href="index.css" type="text/css" rel="stylesheet">
</head>
<body>
<p id="smoothkeyset">
    THIS LOOKS SO CLEAN!
</p>
</body>
</html>
 
 ┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl -i http://momo.hackmyvm.eu/0r1g04szt0p/logo.png                                              
HTTP/1.1 404 Not Found
Server: nginx/1.18.0
Date: Sat, 21 Jun 2025 05:57:21 GMT
Content-Type: text/html
Content-Length: 153
Connection: keep-alive

<html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>nginx/1.18.0</center>
</body>
</html>
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl -i http://momo.hackmyvm.eu/0r1g04szt0p/index.css
HTTP/1.1 200 OK
Server: nginx/1.18.0
Date: Sat, 21 Jun 2025 05:57:39 GMT
Content-Type: text/css
Content-Length: 451
Last-Modified: Sun, 02 Jun 2024 17:48:30 GMT
Connection: keep-alive
ETag: "665cb06e-1c3"
Accept-Ranges: bytes

body
{
    background: rgb(123, 0, 128);
    background: linear-gradient(90deg, rgba(123, 0, 128, 1) 0%, rgba(205, 0, 187, 1) 34%, rgba(255, 0, 134, 1) 68%);
}

body #smoothkeyset
{
    position: absolute;
    right: 45vw;
    top: 45vh;

    color: white;
    font-family: "Lucida Sans", "dGhpc2lzbXlrZXkuY3NzLnR4dA==", sans-serif;
    font-size: large;
    font-style: italic;
    text-decoration: white underline solid 6px;
    cursor: default;
}

                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ echo dGhpc2lzbXlrZXkuY3NzLnR4dA== |base64 -d
thisismykey.css.txt                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl -i http://momo.hackmyvm.eu/0r1g04szt0p/thisismykey.css.txt
HTTP/1.1 200 OK
Server: nginx/1.18.0
Date: Sat, 21 Jun 2025 05:57:57 GMT
Content-Type: text/plain
Content-Length: 20
Last-Modified: Sun, 02 Jun 2024 17:48:38 GMT
Connection: keep-alive
ETag: "665cb076-14"
Accept-Ranges: bytes

HMV{wonderfulltext}
               
```

