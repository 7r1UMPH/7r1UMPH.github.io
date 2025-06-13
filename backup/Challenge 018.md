![image-20250612182911676](https://7r1umph.top/image/202506121829958.webp)

```
http://momo.hackmyvm.eu/ZiP004JfyGh/
```

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl http://momo.hackmyvm.eu/ZiP004JfyGh/
<!doctype html>
<html lang="en">
<title>018</title>
Maybe the flag is in aaAxghuyrtlksd.php
</html>
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl http://momo.hackmyvm.eu/ZiP004JfyGh/aaAxghuyrtlksd.php
Yes, I have the flag! :)      

┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl -i http://momo.hackmyvm.eu/ZiP004JfyGh/aaAxghuyrtlksd.php
HTTP/1.1 200 OK
Server: nginx/1.18.0
Date: Thu, 12 Jun 2025 10:30:38 GMT
Content-Type: text/html; charset=UTF-8
Transfer-Encoding: chunked
Connection: keep-alive

Yes, I have the flag! :)                                                                
```

POST请求

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl -X POST http://momo.hackmyvm.eu/ZiP004JfyGh/aaAxghuyrtlksd.php   
HMV{postpostpost}                                                                     
```

